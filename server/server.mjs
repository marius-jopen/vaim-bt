import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { basePath } from './config.js'; // Ensure this path is correctly imported
import generateAnimation from './components/generator/generateAnimation.js';
import LooperFull from './components/looperFull.js';
import LooperLatest from './components/looperLatest.js';
import generateImage from './components/generator/generateImage.js';
import bodyParser from 'body-parser';
import { findRelevantSentence } from './components/chatgpt/FindRelevantSentence.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saveFilePath = path.join(__dirname, 'save.txt'); // Path for save.txt in the root
const app = express();
const port = 4000;
const baseDir = path.join(basePath.replace(/\\/g, '/'));
const animation = new generateAnimation(baseDir);
const looperFull = new LooperFull(baseDir);
const looperLatest = new LooperLatest(baseDir);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(baseDir, 'images')));

app.post('/search-sentence', async (req, res) => {
  const { sentence } = req.body; // Get the sentence from the request body
  try {
    const poem = await findRelevantSentence(sentence);
    res.json({ success: true, poem });
  } catch (error) {
    console.error('Error generating poem:', error);
    res.status(500).json({ success: false, message: 'Error generating poem' });
  }
});

app.get('/get-latest-settings', (req, res) => {
  fs.readFile(saveFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading save file:', err);
      return res.status(500).send('Error reading save file');
    }
    const entries = data.trim().split('\n');
    const lastEntry = entries.pop();
    if (!lastEntry) {
      return res.json({
        message: 'No saved settings found, using defaults.',
        settings: null,
      });
    }
    return res.json({
      message: 'Latest settings loaded successfully.',
      settings: JSON.parse(lastEntry),
    });
  });
});

app.get('/list-saved-entries', (req, res) => {
  try {
    const data = fs.readFileSync(saveFilePath, 'utf8');
    const entries = data.trim().split('\n').map(JSON.parse);
    res.json(entries);
  } catch (error) {
    res.status(500).send('Failed to read saved entries.');
  }
});

app.get('/images/*', (req, res) => {
  const filePath = req.params[0].replace(/\\/g, '/'); // Ensure we use forward slashes
  const absolutePath = path.join(baseDir, filePath);
  res.sendFile(absolutePath);
});

app.get('/list-preview-images', async (req, res) => {
  const imagesDir = path.join(baseDir, 'images');

  try {
    const files = await fs.promises.readdir(imagesDir);
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
                            .sort((a, b) => fs.statSync(path.join(imagesDir, b)).mtime.getTime() - 
                                           fs.statSync(path.join(imagesDir, a)).mtime.getTime());
    res.json(imageFiles);
  } catch (error) {
    console.error('Failed to list images', error);
    res.status(500).json({ message: 'Failed to list images', error: error.message });
  }
});

app.get('/list-latest-animation', async (req, res) => {
  try {
    const data = await looperLatest.findPngImagesInLatestFolder(); // Ensure this method logs output
    if (!data.images.length || !data.soundtrack) {
      console.log("No images or soundtrack found.");
      res.status(404).json({ message: 'No images or soundtrack found.' });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error listing images and soundtrack from the latest folder:', error);
    res.status(500).json({ message: 'Error listing images and soundtrack from the latest folder.' });
  }
});


app.get('/list-animation-images', async (req, res) => {
  try {
    const images = await looperFull.findAllPngImagesAndSoundtracks();  // Ensure method name matches the Looper class method
    res.json(images);
  } catch (error) {
    console.error('Error listing animation images:', error);
    res.status(500).json({ message: 'Error listing animation images.' });
  }
});



app.post('/generate-animation', async (req, res) => {
  try {
    const { btUrl, info } = await animation.generateAnimation(req.body);

    res.json({ bts: [btUrl], info });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating or saving the video.' });
  }
});

app.post('/generate-image', async (req, res) => {
  const outputDirForImages = path.join(baseDir, 'images');
  try {
    const { imageUrl, info } = await generateImage(outputDirForImages, req.body);

    res.json({ images: [imageUrl], info });
  } catch (error) {
    console.error('Error in generate-image route:', error);
    res.status(500).json({ message: 'Error generating or saving the image.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

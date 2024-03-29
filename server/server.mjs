import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { basePath } from './config.js'; // Adjust the path as necessary
import generateAnimation from './components/generator/generateAnimation.js';
import LooperFull from './components/looperFull.js';
import LooperLatest from './components/looperLatest.js';
import generateImage from './components/generator/generateImage.js';

const app = express();
const port = 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.join(basePath.replace(/\\/g, '/')); 
const animation = new generateAnimation(baseDir);
const looperFull = new LooperFull(baseDir);
const looperLatest = new LooperLatest(baseDir); // Initialize LooperLatest

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(baseDir, 'images')));

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

// New route for listing images from the latest folder
app.get('/list-latest-animation-images', async (req, res) => {
  try {
    const images = await looperLatest.findPngImagesInLatestFolder();
    res.json(images);
  } catch (error) {
    console.error('Error listing images from the latest folder:', error);
    res.status(500).json({ message: 'Error listing images from the latest folder.' });
  }
});

// Add a new route to serve the images
app.get('/list-animation-images', async (req, res) => {
  try {
    const images = await looperFull.findAllPngImages();
    res.json(images);
  } catch (error) {
    console.error('Error listing animation images:', error);
    res.status(500).json({ message: 'Error listing animation images.' });
  }
});

// New route for animation generation
app.post('/generate-animation', async (req, res) => {
  try {
    const { btUrl, info } = await animation.generateAnimation(req.body);
    res.json({ bts: [btUrl], info });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating or saving the video.' });
  }
});

// New route for image generation
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

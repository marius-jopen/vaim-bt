import fs from 'fs';
import path from 'path';

class LatestFolderImageLooper {
  constructor(baseDir) {
    this.baseDir = baseDir; // Base directory containing folders
  }

  async findPngImagesInLatestFolder() {
    let directories = await fs.promises.readdir(this.baseDir, { withFileTypes: true });
    directories = directories
      .filter(dir => dir.isDirectory() && dir.name.startsWith('BT_'))
      .map(dir => dir.name)
      .sort()
      .reverse(); // Sort directories in descending order to get the latest folder first

    if (directories.length === 0) {
      return { images: [], soundtrack: null }; // Return empty results if no directories are found
    }

    // Only consider the latest 'BT_' folder
    const latestDir = directories[0];
    const latestDirPath = path.join(this.baseDir, latestDir);
    const files = await this.readDirForPngFiles(latestDirPath);
    const soundtrackPath = await this.getSoundtrackPath(latestDirPath);

    // Convert each absolute file path to a relative path from `this.baseDir`
    const relativeFiles = files.map(file => path.relative(this.baseDir, file));

    return {
      images: relativeFiles,
      soundtrack: soundtrackPath // Include the soundtrack path in the return object
    };
  }

  async readDirForPngFiles(dir) {
    let files = await fs.promises.readdir(dir, { withFileTypes: true });
    files = files
      .filter(file => !file.isDirectory() && file.name.endsWith('.png'))
      .map(file => file.name)
      .sort();
    return files.map(file => path.join(dir, file));
  }

  async getSoundtrackPath(dir) {
    try {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      const txtFile = files.find(file => file.isFile() && file.name.endsWith('.txt'));
      if (!txtFile) {
        console.error('No txt file found in directory:', dir);
        return null;
      }
  
      const txtFilePath = path.join(dir, txtFile.name);
      const data = await fs.promises.readFile(txtFilePath, 'utf8');
      const json = JSON.parse(data);
      if (!json.soundtrack_path) {
        console.warn('Soundtrack path not found in JSON data:', data);
        return null;
      }
      return json.soundtrack_path;
    } catch (error) {
      console.error('Error reading or parsing soundtrack path from txt file:', error);
      return null;
    }
  }
  
}

export default LatestFolderImageLooper;

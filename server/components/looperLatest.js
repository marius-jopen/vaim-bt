import fs from 'fs';
import path from 'path';

class LatestFolderImageLooper {
  constructor(baseDir) {
    this.baseDir = baseDir; // Base directory containing folders
  }

  async findPngImagesInLatestFolder() {
    let directories = await fs.promises.readdir(this.baseDir, { withFileTypes: true });
    directories = directories
      .filter(dir => dir.isDirectory() && dir.name.startsWith('BT_')) // Only consider directories starting with 'BT_'
      .map(dir => dir.name)
      .sort()
      .reverse(); // Sort directories in descending order to get the latest folder first

    if (directories.length === 0) {
      return []; // Return an empty array if no matching directories are found
    }

    // Only consider the latest 'BT_' folder
    const latestDir = directories[0];
    const latestDirPath = path.join(this.baseDir, latestDir);
    const files = await this.readDirForPngFiles(latestDirPath);
    // Convert each absolute file path to a relative path from `this.baseDir`
    const relativeFiles = files.map(file => path.relative(this.baseDir, file));
    return relativeFiles;
  }

  async readDirForPngFiles(dir) {
    let files = await fs.promises.readdir(dir, { withFileTypes: true });
    files = files
      .filter(file => !file.isDirectory() && file.name.endsWith('.png')) // Only consider .png files
      .map(file => file.name)
      .sort(); // Sort files by name
    // Convert file names to full paths
    return files.map(file => path.join(dir, file));
  }
}

export default LatestFolderImageLooper;

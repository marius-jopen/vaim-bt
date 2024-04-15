// FINAL NORMAL

import fs from 'fs';
import path from 'path';

class Looper {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  async findAllPngImagesAndSoundtracks() {
    let directories = await fs.promises.readdir(this.baseDir, { withFileTypes: true });
    directories = directories.filter(dir => dir.isDirectory() && dir.name.startsWith('BT_')).sort();

    if (directories.length === 0) {
      return [];
    }

    let folderData = [];
    for (const dir of directories) {
      const dirPath = path.join(this.baseDir, dir.name); // Use dir.name to get the string name of the directory
      const files = await this.readDirForPngFiles(dirPath);
      const soundtrackPath = await this.getSoundtrackPath(dirPath);
      const relativeFiles = files.map(file => ({
        image: path.relative(this.baseDir, file),
        soundtrack: soundtrackPath
      }));
      folderData.push(...relativeFiles);
    }
    return folderData;
  }

  async readDirForPngFiles(dir) {
    let files = await fs.promises.readdir(dir, { withFileTypes: true });
    files = files.filter(file => file.isFile() && file.name.endsWith('.png'))
      .map(file => path.join(dir, file.name)); // Ensure to use file.name
    return files;
  }

  async getSoundtrackPath(dir) {
    try {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      const txtFile = files.find(file => file.isFile() && file.name.endsWith('.txt'));
      if (!txtFile) return null;

      const txtFilePath = path.join(dir, txtFile.name); // Again, ensure to use txtFile.name
      const data = await fs.promises.readFile(txtFilePath, 'utf8');
      const json = JSON.parse(data);
      return json.soundtrack_path || null;
    } catch (error) {
      console.error('Error reading soundtrack path:', error);
      return null;
    }
  }
}

export default Looper;

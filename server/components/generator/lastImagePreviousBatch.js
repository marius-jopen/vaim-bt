// getLastImagePathFromPreviousBatch.js
import fs from 'fs';
import path from 'path';

async function getLastImagePathFromPreviousBatch(outputDir, nextBatchNumber) {
  if (nextBatchNumber <= 1) {
    console.log("No previous batch exists for BT_0001.");
    return null; // Early return
  }

  const prevBatchNumber = nextBatchNumber - 1;
  const prevBatchFolderName = `BT_${String(prevBatchNumber).padStart(4, '0')}`;
  const prevBatchFolderPath = path.join(outputDir, prevBatchFolderName);

  try {
    const files = await fs.promises.readdir(prevBatchFolderPath);
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i)).sort();
    if (imageFiles.length === 0) {
      console.log(`No image files found in ${prevBatchFolderPath}.`);
      return null;
    }
    const lastImageFile = imageFiles[imageFiles.length - 1];
    return path.join(prevBatchFolderPath, lastImageFile);
  } catch (error) {
    console.error(`Error accessing previous batch folder: ${prevBatchFolderPath}`, error);
    return null;
  }
}

export default getLastImagePathFromPreviousBatch;

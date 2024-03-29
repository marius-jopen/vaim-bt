// getNextBatchNumber.js
import fs from 'fs';

async function getNextBatchNumber(outputDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(outputDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const batchNumbers = files
        .map(file => file.match(/^BT_(\d+)$/))
        .filter(result => result !== null)
        .map(result => parseInt(result[1], 10))
        .sort((a, b) => a - b);

      const nextBatchNumber = batchNumbers.length > 0 ? Math.max(...batchNumbers) + 1 : 1;
      resolve(nextBatchNumber);
    });
  });
}

export default getNextBatchNumber;

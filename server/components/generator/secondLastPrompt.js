import fs from 'fs';
import path from 'path';

async function readSecondLastPrompt(outputDir, nextBatchNumber) {
  if (nextBatchNumber <= 1) {
    console.log("Generating BT_0001: No previous prompts to fetch because this is the first batch.");
    return false;
  }

  const targetBatchNumber = nextBatchNumber - 1;
  const targetFolderName = `BT_${String(targetBatchNumber).padStart(4, '0')}`;
  const targetFolderPath = path.join(outputDir, targetFolderName);
  
  try {
    const txtFiles = fs.readdirSync(targetFolderPath)
      .filter(file => path.extname(file).toLowerCase() === '.txt');

    if (txtFiles.length === 0) {
      console.log(`No .txt file found in ${targetFolderName}.`);
      return false;
    }
    
    // Assuming there's only one txt file per folder or it's the first txt file we're interested in
    const promptsFilePath = path.join(targetFolderPath, txtFiles[0]);
    const promptsContent = fs.readFileSync(promptsFilePath, 'utf-8');

    let promptsJson;
    try {
      promptsJson = JSON.parse(promptsContent);
    } catch (error) {
      console.error(`Error parsing JSON from ${promptsFilePath}:`, error);
      return false;
    }

    // Verifying the structure of the JSON to ensure it has a 'prompts' object with at least two keys
    if (promptsJson && typeof promptsJson.prompts === 'object') {
      const promptKeys = Object.keys(promptsJson.prompts);
      if (promptKeys.length < 2) {
        console.log(`Not enough prompts in ${targetFolderName} to fetch the second one. Found keys: ${promptKeys}`);
        return false;
      }
      
      // Sorting keys to find the second one reliably, assuming numeric keys
      const sortedKeys = promptKeys.sort((a, b) => Number(a) - Number(b));
      const secondPromptKey = sortedKeys[1]; // Getting the second key after sorting
      const secondPrompt = promptsJson.prompts[secondPromptKey];
      
      console.log(`In ${targetFolderName}, the second prompt is: ${secondPrompt}`);
      return secondPrompt;
    } else {
      console.log(`'prompts' object not found or invalid in ${promptsFilePath}.`);
      return false;
    }
  } catch (error) {
    console.error(`Error reading file in ${targetFolderPath}:`, error);
    return false;
  }
}

export default readSecondLastPrompt;

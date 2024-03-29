import fetch from 'node-fetch';
import { getVideoConfig, getVideoConfigModified, getVideoConfigOriginal } from './config.js';
import getLastImagePathFromPreviousBatch from './lastImagePreviousBatch.js';
import getNextBatchNumber from './nextBatchNumber.js';
import readSecondLastPrompt from './secondLastPrompt.js';

class Generator {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  async generateAnimation(parameters) {
    try {
      // Pass this.outputDir to getNextBatchNumber
      const nextBatchNumber = await getNextBatchNumber(this.outputDir);
      let useInit = false;
      let initImagePath = null;
      let prompts = parameters.deforum_settings?.prompts || {};
  
      if (nextBatchNumber === 1) {
        const secondPromptKey = Object.keys(prompts).sort((a, b) => parseInt(a) - parseInt(b))[1] || "0";
        const secondPromptValue = prompts[secondPromptKey];
        prompts["0"] = secondPromptValue;
        for (const key in prompts) {
          prompts[key] = secondPromptValue;
        }
      } else {
        // Also pass this.outputDir to getLastImagePathFromPreviousBatch
        if (await getLastImagePathFromPreviousBatch(this.outputDir, nextBatchNumber)) {
          useInit = true;
          initImagePath = await getLastImagePathFromPreviousBatch(this.outputDir, nextBatchNumber);
        }
        // And to readSecondLastPrompt
        const secondLastPrompt = await readSecondLastPrompt(this.outputDir, nextBatchNumber);
        if (secondLastPrompt !== false) {
          prompts["0"] = secondLastPrompt;
        }
      }
     
      const batchName = `BT_${String(nextBatchNumber).padStart(4, '0')}`;
      
      const videoConfig = getVideoConfig();
      const videoConfigModified = getVideoConfigModified();
      const videoConfigOriginal = getVideoConfigOriginal();

      // Ensure saveSecondPromptInfo also receives this.outputDir if needed

      const modifiedParameters = {
        ...parameters,
        deforum_settings: {
          ...parameters.deforum_settings,
          ...videoConfig,
          ...videoConfigModified,
          ...videoConfigOriginal,
          prompts,
          batch_name: batchName,
          use_init: useInit,
          init_image: initImagePath,

        },
      };

      // Proceed with the fetch call to generate the batch
      const response = await fetch("http://127.0.0.1:7860/deforum_api/batches", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedParameters)
      });

      const jsonResponse = await response.json();
      // console.log(jsonResponse);

      return {
        message: "Batch generation initiated. Check console for response details.",
        info: "Operation completed successfully!"
      };
    } catch (error) {
      console.error('Error in Generator:', error);
      throw error;
    }
  }

}

export default Generator;
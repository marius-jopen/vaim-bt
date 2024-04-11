import fetch from 'node-fetch'; // Use fetch to make requests to web servers.
import { getVideoConfig, getVideoConfigModified, getVideoConfigOriginal } from './config.js'; // Get different video settings from the config file.
import getLastImagePathFromPreviousBatch from './lastImagePreviousBatch.js'; // Get the path of the last image created in the previous batch.
import getNextBatchNumber from './nextBatchNumber.js'; // Get the number for the next batch of images or videos to create.
import readSecondLastPrompt from './secondLastPrompt.js'; // Read the prompt used before the last one.
import { saveEntry } from '../entrySaver.js'; // Save details about this batch for later.

class Generator {
  constructor(outputDir) { // Start of the Generator class definition with a constructor.
    this.outputDir = outputDir; // Remember the folder where we should save files.
  }

  async generateAnimation(parameters) { // Define a method to start creating an animation.
    try { // Try to do the following steps, but if there's an error, catch it.
      const nextBatchNumber = await getNextBatchNumber(this.outputDir); // Find out what the next batch's number should be.
      let useInit = false; // Start off not using an initial image.
      let initImagePath = null; // We don't have an initial image path yet.
      let prompts = parameters.deforum_settings?.prompts || {}; // Get the prompts from the settings or use an empty object if there are none.
  
      if (nextBatchNumber === 1) { // If this is the very first batch...
        const secondPromptKey = Object.keys(prompts).sort((a, b) => parseInt(a) - parseInt(b))[1] || "0"; // Find the second prompt's key, or use "0" if not found.
        const secondPromptValue = prompts[secondPromptKey]; // Get the value of the second prompt.
        prompts["0"] = secondPromptValue; // Set the first prompt to the second one's value.
        for (const key in prompts) { // For each prompt...
          prompts[key] = secondPromptValue; // Replace its value with the second prompt's value.
        }
      } else { // If this isn't the first batch...
        // Try to get the path of the last image from the previous batch.
        if (await getLastImagePathFromPreviousBatch(this.outputDir, nextBatchNumber)) { 
          useInit = true; // If there's a last image, we'll use it as an initial image.
          initImagePath = await getLastImagePathFromPreviousBatch(this.outputDir, nextBatchNumber); // Get the last image's path.
        }
        const secondLastPrompt = await readSecondLastPrompt(this.outputDir, nextBatchNumber); // Try to read the second-last prompt.
        if (secondLastPrompt !== false) { // If there was a second-last prompt...
          prompts["0"] = secondLastPrompt; // Use it as the first prompt.
        }
      }
     
      const batchName = `BT_${String(nextBatchNumber).padStart(4, '0')}`; // Create a batch name with the batch number, padded with zeros.
      const videoConfig = getVideoConfig(); // Get the general video configuration.
      const videoConfigModified = getVideoConfigModified(); // Get the modified video configuration.
      const videoConfigOriginal = getVideoConfigOriginal(); // Get the original video configuration.

      // Before sending the request, gather data about this batch for saving.
      const entryData = {
        prompts: parameters.deforum_settings.promptsSave || "", // Save the prompts.
        positivePrompts: parameters.deforum_settings.positivePromptsSave || "", // Save the positive prompts.
        negativePrompts: parameters.deforum_settings.negativePromptsSave || "", // Save the negative prompts.
        loras: parameters.deforum_settings.lorasSave || "", // Save the LoRA settings.
        maxFrames: parameters.deforum_settings.max_frames || "", // Save the maximum number of frames.
        cn1Enabled: parameters.deforum_settings.cn_1_enabled || false, // Save whether CN1 is enabled.
        cn1VidPath: parameters.deforum_settings.cn_1_vid_path || "", // Save the CN1 video path.
        soundtrack_path: parameters.deforum_settings.soundtrack_path || "", // Save the soundtrack path.
        // Add more fields as necessary
      };

      saveEntry(entryData); // Save the structured entry data.

      // Combine the original parameters with the video configurations and modifications.
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

      // Send a request to start generating the batch.
      const response = await fetch("http://127.0.0.1:7860/deforum_api/batches", {
        method: "POST", // The method is POST because we're sending data.
        headers: { 'Content-Type': 'application/json' }, // Tell the server we're sending JSON data.
        body: JSON.stringify(modifiedParameters) // Send the modified parameters as the request body.
      });

      const jsonResponse = await response.json(); // Wait for and then read the response as JSON.

      // If everything went well, let the user know.
      return {
        message: "Batch generation initiated. Check console for response details.",
        info: "Operation completed successfully!"
      };
    } catch (error) { // If an error happened in the try block...
      console.error('Error in Generator:', error); // Log the error to the console.
      throw error; // Rethrow the error to be handled elsewhere.
    }
  }

}

export default Generator; // Make the Generator class available for other files to use.

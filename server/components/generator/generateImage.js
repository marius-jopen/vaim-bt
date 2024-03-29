// File: ./components/generator/generateImage.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { getImageConfig } from './config.js'; // Adjust the path as necessary

async function generateImage(outputDir, dynamicParameters) {
    // Assume getImageConfig() correctly returns image configuration
    const imageConfig =  getImageConfig();

    // Merge dynamic parameters with the image configuration
    const parameters = {
        ...dynamicParameters,
        ...imageConfig,
    };

    try {
        const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters),
        });

        const jsonResponse = await response.json();
        const base64ImageData = jsonResponse.images[0];
        const imageData = Buffer.from(base64ImageData, 'base64');
        const timestamp = Date.now();
        const imageName = `image_${timestamp}.png`;

        const outputPath = path.join(outputDir, imageName);

        await fs.promises.mkdir(outputDir, { recursive: true });
        await fs.promises.writeFile(outputPath, imageData);

        console.log(`Image saved at: ${outputPath}`);

        // Assuming your server setup serves static files from 'E:/output/sd-api/'
        // and you want the URL to be relative to this root
        const imageUrl = `/images/${imageName}`;

        return { imageUrl, info: "Image generated and saved successfully!" };
    } catch (error) {
        console.error('Error in generateImage:', error);
        throw error;
    }
}

export default generateImage;

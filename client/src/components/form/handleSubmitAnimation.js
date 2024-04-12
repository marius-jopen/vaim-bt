const handleSubmitAnimation = async (
  e, { prompts, maxFrames, positivePrompts, cn1VidPath, loras, negativePrompts, cn1Enabled }, setResponseMessage
) => {
  e.preventDefault();
  
  const mainPromptText = prompts.prompts || "";
  const speech = prompts.speech || "";
  const keyframe = Math.floor(parseInt(maxFrames, 10) / 4);
  const formattedPrompts = mainPromptText.replace(/\n/g, ' ');

   // Generate initial random values
   let rotation_3d_x = Math.random() * 0.5;
   let rotation_3d_y = Math.random() * 0.5;
   let rotation_3d_z = Math.random() * 0.5;
 
   // Check if any rotation exceeds 0.4 and adjust others if necessary
   if (rotation_3d_x > 0.3 || rotation_3d_y > 0.3 || rotation_3d_z > 0.3) {
     if (rotation_3d_x > 0.3) {
       rotation_3d_y = Math.random() * 0.1;
       rotation_3d_z = Math.random() * 0.1;
     }
     if (rotation_3d_y > 0.3) {
       rotation_3d_x = Math.random() * 0.1;
       rotation_3d_z = Math.random() * 0.1;
     }
     if (rotation_3d_z > 0.3) {
       rotation_3d_x = Math.random() * 0.1;
       rotation_3d_y = Math.random() * 0.1;
     }
   }
 
  const parameters = {
    deforum_settings: {
      "prompts": {
        "0": `${formattedPrompts} // ${positivePrompts} ${loras} --neg ${negativePrompts}`,
        [keyframe.toString()]: `${formattedPrompts} // ${positivePrompts} ${loras} --neg ${negativePrompts}`
      },
      "max_frames": parseInt(maxFrames, 10),
      "cn_1_enabled": cn1Enabled,
      "cn_1_vid_path": cn1Enabled ? cn1VidPath : undefined,
      "rotation_3d_x": "0: (" + rotation_3d_x / 2 + ")",
      "rotation_3d_y": "0: (" + rotation_3d_y / 2 + ")",
      "rotation_3d_z": "0: (" + rotation_3d_z / 2 + ")",
      "soundtrack_path": speech || "",
      positivePromptsSave: positivePrompts,
      negativePromptsSave: negativePrompts,
      lorasSave: loras,
      promptsSave: formattedPrompts,
    }
  };

  try {
    const response = await fetch('/generate-animation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });

    if (response.ok) {
      setResponseMessage("Video generated and saved successfully!");
    } else {
      setResponseMessage("Error generating or saving the video.");
    }
  } catch (error) {
    console.error('Error:', error);
    setResponseMessage(`Error: ${error}`);
  }
};

export default handleSubmitAnimation;
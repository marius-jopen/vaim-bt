const handleSubmitAnimation = async (
    e, { prompts, maxFrames, positivePrompts, loras, negativePrompts }, setResponseMessage
  ) => {
    e.preventDefault();
  
    const keyframe = Math.floor(parseInt(maxFrames, 10) / 4);
    const formattedPrompts = prompts.replace(/\n/g, ' ');
  
    const parameters = {
      deforum_settings: {
        "prompts": {
          "0": `${formattedPrompts} // ${positivePrompts} ${loras} --neg ${negativePrompts}`,
          [keyframe.toString()]: `${formattedPrompts} // ${positivePrompts} ${loras} --neg ${negativePrompts}` // Use the calculated keyframe
        },
        "max_frames": parseInt(maxFrames, 10),
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
  
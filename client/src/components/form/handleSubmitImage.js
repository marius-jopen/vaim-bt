const handleSubmitImage = async (
  e, { prompts, positivePrompts, loras, negativePrompts, maxFrames,cn1VidPath,cn1Enabled }, setResponseMessage
) => {
  e.preventDefault();
  const mainPromptText = prompts.prompts || ""; // Access the 'prompts' string from the prompts object

  const formattedPrompts = mainPromptText.replace(/\n/g, ' ');

  // console.log(formattedPrompts)
  
  const parameters = {
    prompt: `( ${formattedPrompts}:2) ${positivePrompts} ${loras}`,
    negative_prompt: negativePrompts,
    positivePromptsSave: positivePrompts,
    lorasSave: loras,
    promptsSave: formattedPrompts,
    maxframesSave: maxFrames,
    cn1VidPathSave: cn1VidPath,
    cn1EnabledSave: cn1Enabled,

  };

  try {
    const response = await fetch('/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });

    if (response.ok) {
      setResponseMessage("Image generated and saved successfully!");
    } else {
      setResponseMessage("Error generating or saving the image.");
    }
  } catch (error) {
    console.error('Error:', error);
    setResponseMessage(`Error: ${error}`);
  }
};

export default handleSubmitImage;

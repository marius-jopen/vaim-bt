const handleSubmitImage = async (
  e, { prompts, positivePrompts, loras, negativePrompts }, setResponseMessage
) => {
  e.preventDefault();

  const formattedPrompts = prompts.replace(/\n/g, ' ');

  const parameters = {
    prompt: `${formattedPrompts} ${positivePrompts} ${loras}`,
    negative_prompt: negativePrompts,
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

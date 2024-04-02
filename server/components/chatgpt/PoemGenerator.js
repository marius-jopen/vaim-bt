import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const generatePoem = async (sentence) => {
  const apiKey = process.env.API_KEY; // API key is now loaded from .env file
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4", // Specify the chat model
        messages: [
          {role: "system", content: "You are a helpful assistant."},
          {role: "user", content: `The context is a conference about AI in the German Bundestag. I am an artist and was invited to create an interactive artpiece. The application here is a part of this artpiece. The artpiece works like that: While the conference is happening, people come to me and enter some words or thoughts, which they connect to the keywords like: Democracy, Sustainability, Innovation. The application uses this input and generates a small haiku and some propts for stable diffusion. The application then sends the prompts to stable diffusion and generates a video. While the video is running, people can read the haiku as a caption. Now please generate me the haiku and the prompts from this input: ${sentence}. Here are some additional infos about the style of the output which you generate: The haiku should not be directly use those words. It should give a poetic more abstract interpretation of the input. The prompts for stable diffusion should also not just show some super stereotype images. It should be a bit dreamy and surreal. Also for stable diffusion it only needs one string of prompts. Not many. `}
        ],
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    const data = await response.json();
    if (!data || !data.choices || data.choices.length === 0 || !data.choices[0].message) {
      // console.error('API did not return the expected responses:', JSON.stringify(data, null, 2));
      console.log(data.choices[0].message.content.trim())
      return 'API did not return a poem. Please check the logs for more details.';
    }
    console.log(data)
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating poem:', error);
    return 'An error occurred while generating the poem. Please check the logs for more details.';
  }
};



export { generatePoem };


const sentence = "hello my name is marius";
generatePoem(sentence).then(poem => console.log(poem));

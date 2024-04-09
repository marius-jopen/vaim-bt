import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const findRelevantSentence = async (sentence) => {
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
          {role: "user", content: `
          This is the user input: ${sentence}. 
          
          That my system recognizes the difference bewteen the speech and the Stable Diffusion prompts, I want it in this format:
          Speech:
          Source:
          Prompts:

          Take a famous political speech and output a sentence that is relevant to the user input. 
          Only use positive speeches. 
          Nothing which includes hate or popularism.
          Maximum two sentences long. 
          There you can write the source.
          Also no need for quotation marks.
          Translate to German. Dont show the english text at all.
          Don't invent anything, only use existing speeches.
          Dont write explanations or other things. Make sure that you only write the speech and the source.
          I saw that you sometimes added the source in brackets behind the speech. And then you also added it as source. 
          Stick to the format I gave you.

          Then I also need a string of prompts in english language which are relevant to the user input.
          Those prompts for Stable DIffusion have to be in english!!
          Don't be abstract. Name objects or things, because Stabel Diffusion can then generate them.
          Stable Diffusion will generate an image out of this.
          Maybe make a mix of the user input and the speech.
          But keep it short and simple.
          Consider, that Stable Diffusion needs to generate an image from that.
          Also dont include the speaker or something from the captions in the prompts.

          `}
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



export { findRelevantSentence };


const sentence = "hello my name is marius";
findRelevantSentence(sentence).then(poem => console.log(poem));

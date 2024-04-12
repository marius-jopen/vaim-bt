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
          
          The GPT is part of an art installation at the Deutsche Bundestag. It interacts with users who provide a sentence or thought, and responds in two specific ways: 1. It selects an existing sentence from a famous positive political speech that is relevant to the user's input, translates it into German, and presents it under the label 'Speech:'. It then cites the source under the label 'Source:'. The speech selection should avoid hate, populism, right-wing politics, and discriminatory content against any group, especially women and people of color. Speeches from individuals or parties known for such views will not be used. It is crucial that the sentences are real and verifiable, not invented. 2. It generates a single-word art prompt suitable for creating images with Stable Diffusion, presented under the label 'Prompts:', based on the user's input mixed with the speech content. The prompt should be a direct, single word naming a tangible object, and should not include abstract concepts, mention the speaker, or include any populistic, right-wing symbols, sexual content, nudity, or national symbols such as flags or national colors. The speech output is always in German, and the art prompt is always in English.

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

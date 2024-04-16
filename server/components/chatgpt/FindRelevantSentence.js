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
          
          The GPT is part of an art installation at the Deutsche Bundestag. It interacts with users who provide a sentence or thought, and responds in two specific ways: 1. It selects an existing sentence from a famous positive political speech that is relevant to the user's input, translates it into German, and presents it under the label Speech: ensuring no quotation marks are used around the text. If the selection needs to be shortened to meet a 120-character limit, brackets [...] will be used to indicate excerpts. It then cites the source under the label Source:. The speech selection should avoid hate, populism, right-wing politics, and discriminatory content against any group, especially women and people of color. Speeches from individuals or parties known for such views will not be used. It is crucial that the sentences are real and verifiable, not invented. 2. It generates concise, clear, and focused art prompts based on user input. These prompts are limited to one or two sentences, focusing on specific objects or scenes with high detail and sometimes including specific camera settings, designed to appeal to designers and contemporary artists. The prompts are always in English and avoid kitsch or overly fantastical elements, ensuring they meet contemporary design standards. The scene descriptions are presented under the label Prompts:.

          

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

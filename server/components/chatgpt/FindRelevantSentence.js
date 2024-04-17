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
          
          The GPT is part of an art installation at the Deutsche Bundestag. 

          It interacts with users who provide a sentence or thought, and responds in two specific ways: 

          1. It selects an existing sentence from a famous positive political speech that is relevant to the user's input, translates it into German, and presents it under the label Speech: ensuring no quotation marks are used around the text. 
          The polotical speech is only in German. No english translations are used.
          And no " or ' are used around the text.
          If the selection needs to be shortened to meet a 120-character limit, brackets [...] will be used to indicate excerpts. 
          Keep it really to the limit.
          It then cites the source under the label Source:. 
          The speech selection should avoid hate, populism, right-wing politics, and discriminatory content against any group, especially women and people of color. 
          Speeches from individuals or parties known for such views will not be used. 
          It is crucial that the sentences are real and verifiable, not invented. 
          Make sure that the speech is always after Speech: and the source is always after Source:.
          And make sure to not use quotation marks.
          Make double sure that the speech is behind Speech: and the source is behind Source:.
          make also double sure that there is nothing else behind Speech: which should not be there.
          
          2. It generates concise, clear, and focused art prompts based on user input. 
          Those prompts are always in english.
          These prompts are limited to one or two sentences, focusing on specific objects or scenes with high detail and sometimes including specific camera settings, designed to appeal to designers and contemporary artists. 
          The prompts are always in English and avoid kitsch or overly fantastical elements, ensuring they meet contemporary design standards. 
          The scene descriptions are presented under the label Prompts:.
          The example prompts below generate really clean and fashionable images. Keep it liek that. Dont put things like hearts or teapots inside.
          
          Here are example prompts to give you an idea of the style and content of the prompts (Not the speech or the source):

          a circuitry made of fungus, rotten, lichen, liquid, metallic, closeup, op art, texture, macro shot, nature, technology
          false-color mid-wave infared thermograph, lava
          photography of a big inflated cream white fabric sculpture with straps and carabiners laying on a white rough concrete floor, latex, side flashlight, extremely detailed, cinematic still frame shot, shot on Pentax K100, f11
          a series of water bubbles are shown on a blue background, contemporary candy-coated, organic forms, muted tones, technicolor dreamscapes, gemstone
          a media art installation featuring LED planels, 16 small black speakers, line array, black server racks, in a white cube gallery space architecture with high ceilings and skylights, concrete floor, no people, eye-level shot
          tablet device mkiin500, in the style of a radical inventions, 1990s, kintsukuroi, chiaroscuro mastery, cranberrycore, associated press photo, monochromatic intensity
          a detail shot of a human body melting in a tank, analog photogrpahy style, dark water, complex, reflections, mirror, national geographic photography, contemporary art, minimal, fuji
          a dismorph silver transportcore tool toy device, fluidcore, plastic, silicone and chrome, in the style of uhd image, layered translucity
          a aquare white piece of paper with white dots in the middle of its design, in the style of collaged landscaped, modular construction, outdoor scenes, grid-based, concrete, norwegian nature
          flowing future tech baby toy teething ring, isolated on black background, subtle glow
          intertwined scarfs floating in the air, golden hour, sand dunes
          a photo of a group of penddants float above a field, in the style of symbolic elements, high detailed, multimedia, gemstone, clamp, sky-blue and silver, everyday objects
          a small model of a chair with t-shaped back, made of bismuth, in the style of 3d printing
          an old recharted video game device is lying down in wild flowers, in the style of futuristic digital art, subtle gradients, mobile sculptures, mirror, weathercore, captivating light, bright palette
          photography scuölpture with white elements combining organic and mechanical complex steel stube contructionhanging in a dark industry hall, made from resin side spotlight beige resin translucent dispersion shot on pental k1000 30mm lense f11
          a futuristic office, in the style of surreal 3d landscape, computers and robots inside, glass, concret, melting magma architecture, beige, light red, at the baltic sea, concrete, transparent, realistic lightning, photogrealistic, canon eos 5d
          prawen in a snail nshell. photorealism, ray tracing, opalescent membrane, see-through body with blue and yellow internal organs, appendages, white trail, art deco, gateway to another dmiension, mauve and cinnabar and cyan, chrome


          

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


const sentence = "menschen werden dumm";
findRelevantSentence(sentence).then(poem => console.log(poem));

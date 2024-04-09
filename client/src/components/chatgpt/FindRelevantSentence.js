import React, { useState } from 'react';
import { usePrompts } from '../promptsContext'; // Adjust based on actual directory structure
import TextAreaInput from '../form/TextAreaInput'; // Adjust the import path as necessary
import SubmitButton from '../form/SubmitButton'; // Adjust the import path as necessary

const FindRelevantSentence = () => {
  const [sentence, setSentence] = useState('');
  const [poem, setPoem] = useState({ speech: '', source: '', prompts: '' });
  const [loading, setLoading] = useState(false);
  const { setPrompts } = usePrompts();

  const parsePoemData = (poemString) => {
    const keys = ['Speech', 'Source', 'Prompts']; // Define keys to look for
    const regex = new RegExp(keys.join(':|') + ':', 'g'); // Create regex to match keys with trailing colon
    let parts = poemString.split(regex).slice(1); // Split by keys and remove the first empty result if any
    let result = {};
    
    keys.forEach((key, index) => {
      result[key.toLowerCase()] = parts[index]?.trim() ?? '';
    });
  
    return result;
  };
  
  const generatePoem = async (event) => {
    event.preventDefault(); // Prevent the default form behavior
    setLoading(true);
    try {
      const response = await fetch('/search-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log(data.poem);
        // Use the new parsing function
        const parts = parsePoemData(data.poem);
  
        setPoem({
          speech: parts.speech,
          source: parts.source,
          prompts: parts.prompts,
        });
        setPrompts(parts.prompts); // Safely update prompts
      } else {
        alert('Failed to generate poem: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching poem:', error);
      alert('Error fetching poem. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <form onSubmit={generatePoem}>
      <SubmitButton
        text={loading ? "Generating..." : "Generate Thoughts"}
        colorClass="bg-orange-400 hover:bg-orange-500"
        disabled={loading}
      />
      <TextAreaInput
        label="Enter a sentence"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />
      <div className='bg-neutral-100 py-3 px-5 rounded-lg border border-neutral-200 text-sm mb-6'>
        <div><span className='font-medium'>Speech:</span> {poem.speech}</div>
        <div><span className='font-medium'>Source:</span> {poem.source}</div>
        <div><span className='font-medium'>Prompts:</span> {poem.prompts}</div>
      </div>
    </form>
  );
};

export default FindRelevantSentence;

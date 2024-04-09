import React, { useState } from 'react';
import { usePrompts } from '../promptsContext'; // Adjust based on actual directory structure
import TextAreaInput from '../form/TextAreaInput'; // Adjust the import path as necessary
import SubmitButton from '../form/SubmitButton'; // Adjust the import path as necessary

const FindRelevantSentence = () => {
  const [sentence, setSentence] = useState('');
  const [poem, setPoem] = useState({ speech: '', source: '', prompts: '' });
  const [loading, setLoading] = useState(false);
  const { setPrompts } = usePrompts();

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
        // Use a more defensive approach to handle the data
        const parts = data.poem.split('\n').reduce((acc, current) => {
          const [key, value] = current.split(':').map(part => part?.trim()); // Trim parts safely
          if (key && value !== undefined) { // Check for undefined explicitly
            acc[key.toLowerCase()] = value;
          }
          return acc;
        }, {});
  
        setPoem({
          speech: parts.speech ?? '', // Use nullish coalescing to handle undefined
          source: parts.source ?? '',
          prompts: parts.prompts ?? '',
        });
        setPrompts(parts.prompts ?? ''); // Safely update prompts
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
      <TextAreaInput
        label="Enter a sentence"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />
      <SubmitButton
        text={loading ? "Generating..." : "Search"}
        colorClass="bg-orange-400 hover:bg-orange-500"
        disabled={loading}
      />
      <div>
        <div><strong>Speech:</strong> {poem.speech}</div>
        <div><strong>Source:</strong> {poem.source}</div>
        <div><strong>Prompts:</strong> {poem.prompts}</div>
      </div>
    </form>
  );
};

export default FindRelevantSentence;

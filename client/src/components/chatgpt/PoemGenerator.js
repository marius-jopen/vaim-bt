import React, { useState } from 'react';

const PoemGenerator = () => {
  const [sentence, setSentence] = useState('');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePoem = async () => {
    setLoading(true);
    try {
      const response = await fetch('/generate-poem', {
        method: 'POST', // Assuming the backend route accepts POST requests for dynamic input
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }), // Send the sentence as part of the request body
      });

      const data = await response.json();
      if (data.success) {
        setPoem(data.poem);
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
    <div>
      <input
        type="text"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder="Enter a sentence"
      />
      <button onClick={generatePoem} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Poem'}
      </button>
      <div>
        <h3>Generated Poem</h3>
        <p>{poem}</p>
      </div>
    </div>
  );
};

export default PoemGenerator;

import Form from './components/form/form';
import React, { useEffect } from 'react';
import PoemGenerator from './components/chatgpt/PoemGenerator';

function App() {
  useEffect(() => {
    document.title = "vAIm";
  }, []);

  return (
    <div className="App px-4  antialiased">
      <PoemGenerator /> 
      <Form />
    </div>
  );
}

export default App;
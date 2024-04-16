import React, { useEffect } from 'react';
import { PromptsProvider } from './components/promptsContext'; // Adjust the import path as necessary
import Form from './components/form/form';

function App() {
  useEffect(() => {
    document.title = "vAIm";
  }, []);

  return (
    <PromptsProvider>
      <div className="Appantialiased">
        <Form />
      </div>
    </PromptsProvider>
  );
}

export default App;

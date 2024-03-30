import Form from './components/form/form';
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "vAIm";
  }, []);

  return (
    <div className="App px-4  antialiased">
      <Form />
    </div>
  );
}

export default App;
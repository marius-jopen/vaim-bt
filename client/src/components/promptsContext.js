// promptsContext.js
import React, { createContext, useContext, useState } from 'react';

const PromptsContext = createContext();

export const usePrompts = () => useContext(PromptsContext);

export const PromptsProvider = ({ children }) => {
  const [prompts, setPrompts] = useState('');

  return (
    <PromptsContext.Provider value={{ prompts, setPrompts }}>
      {children}
    </PromptsContext.Provider>
  );
};
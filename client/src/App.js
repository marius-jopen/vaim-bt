import React from 'react';
import Form from './components/form/form';
import LooperSwitch from './components/looperSwitch'

function App() {
  return (
    <div className="App px-4 pt-4 antialiased">
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Form />
        <LooperSwitch/>
      </div>
    </div>
  );
}

export default App;
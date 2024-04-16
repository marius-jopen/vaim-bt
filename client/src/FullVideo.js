import React, { useEffect } from 'react';
import LooperFull from './components/looperFullXl';

function FullVideo() {
  useEffect(() => {
    document.title = "WordWandel Video";
  }, []);

  return (
    <div className="App antialiased bg-black">
      <LooperFull />
    </div>
  );
}

export default FullVideo;
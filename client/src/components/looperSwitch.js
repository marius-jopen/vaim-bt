import React, { useState } from 'react';
import LooperFull from './looperFull'; // Adjust the path as necessary
import LooperLatest from './looperLatest'; // Adjust the path as necessary
import ImagesPreview from './imagesPreview'; // Adjust the path as necessary

function LooperSwitch() {
  const [displayMode, setDisplayMode] = useState('latest');

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === 'latest' ? 'image' : 'latest');
  };

  return (
    <div className="looper-switch">
      {displayMode === 'latest' && <LooperLatest />}
      {displayMode === 'image' && <ImagesPreview />}

      <div className="flex rounded-md shadow-sm mt-4">
        <button
          onClick={toggleDisplayMode}
          type="button"
          className="flex justify-center rounded-full pt-0.5 pb-1 px-6 text-lg text-black bg-neutral-400"
        >
          {displayMode === 'latest' ? 'Vorschau Bild' : 'Vorschau Video'}
        </button>
      </div>
    </div>
  );
}

export default LooperSwitch;

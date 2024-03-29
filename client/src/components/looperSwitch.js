import React, { useState } from 'react';
import LooperFull from './looperFull'; // Adjust the path as necessary
import LooperLatest from './looperLatest'; // Adjust the path as necessary
import ImagesPreview from './imagesPreview'; // Adjust the path as necessary

function LooperSwitch() {
  const [displayMode, setDisplayMode] = useState('full');

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  };

  // Adjust the function to apply a different background color for the active mode
  const getButtonClass = (mode) => 
    `transition rounded-xl px-3 py-2 w-full text-xs ${displayMode === mode ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`;

  return (
    <div className="looper-switch">
      <div className='flex gap-4 mb-4'>
        <button 
          className={getButtonClass('full')}
          onClick={() => handleDisplayModeChange('full')}
        >
          FULL
        </button>
        <button 
          className={getButtonClass('latest')}
          onClick={() => handleDisplayModeChange('latest')}
        >
          CURRENT
        </button>
        <button 
          className={getButtonClass('image')}
          onClick={() => handleDisplayModeChange('image')}
        >
          IMAGE
        </button>
      </div>

      {displayMode === 'full' && <LooperFull />}
      {displayMode === 'latest' && <LooperLatest />}
      {displayMode === 'image' && <ImagesPreview />}
    </div>
  );
}

export default LooperSwitch;

import React, { useState } from 'react';
import LooperFull from './looperFull'; // Adjust the path as necessary
import LooperLatest from './looperLatest'; // Adjust the path as necessary
import ImagesPreview from './imagesPreview'; // Adjust the path as necessary

function LooperSwitch() {
  const [displayMode, setDisplayMode] = useState('full');

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  };

  const isActive = (mode) => displayMode === mode ? 'bg-gray-100' : 'bg-white';

  return (
    <div className="looper-switch">
      <span className="isolate inline-flex rounded-md shadow-sm  mb-4">
        <button
            onClick={() => handleDisplayModeChange('full')}
          type="button"
          className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${isActive('full')}`}
        >
          Full
        </button>
        <button
          onClick={() => handleDisplayModeChange('latest')}
          type="button"
          className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${isActive('latest')}`}
        >
          Current
        </button>
        <button
          onClick={() => handleDisplayModeChange('image')}
          type="button"
          className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${isActive('image')}`}
        >
          Images
        </button>
      </span>

      {displayMode === 'full' && <LooperFull />}
      {displayMode === 'latest' && <LooperLatest />}
      {displayMode === 'image' && <ImagesPreview />}
    </div>
  );
}

export default LooperSwitch;

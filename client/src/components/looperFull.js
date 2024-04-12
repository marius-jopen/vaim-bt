import React, { useState, useEffect } from 'react';

function LooperFull() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:4000/list-animation-images');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageData = await response.json();
        setData(imageData);
      } catch (error) {
        console.error("Failed to load images and soundtracks", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (data.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % data.length);
      }, 1000 / 15);
      return () => clearInterval(interval);
    }
  }, [data, isPlaying]);

  const currentItem = data[currentIndex] || { image: '', soundtrack: '' };
  const currentImageUrl = currentItem.image ? `http://localhost:4000/images/${encodeURIComponent(currentItem.image)}` : '';

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="looper">
      {data.length > 0 ? (
        <>
        <div className='relative'>
          {currentItem.soundtrack && (
            <div className="caption absolute bottom-8 w-full text-center text-3xl font-bold px-8">{currentItem.soundtrack}</div>
          )}
          <img className='cursor-pointer rounded-xl' src={currentImageUrl} alt="Gallery" onClick={togglePlayPause} />
        </div>
          <div className='h-12'>
            <div className="text-xs text-gray-500 mt-2 mb-1">Path: {currentItem.image}</div>
          </div>
        </>
      ) : (
        <div>No images or soundtracks found</div>
      )}
    </div>
  );
}

export default LooperFull;

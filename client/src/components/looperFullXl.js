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
    <div className="looper h-screen w-screen">
      {data.length > 0 && currentItem.image ? (
        <>
        <div className='relative'>
          {currentItem.soundtrack && (
            <div className="caption">
              <div className='caption-box'>
                {currentItem.soundtrack}
              </div>
            </div>
          )}
          <img className='img-full h-screen w-screen object-cover' src={currentImageUrl} alt="Gallery" />
        </div>
          {/* <div className='h-12'>
            <div className="text-xs text-gray-500 mt-2 mb-1">Path: {currentItem.image}</div>
          </div> */}
        </>
      ) : (
        <div>No images or soundtracks found</div>
      )}
    </div>
  );
}

export default LooperFull;

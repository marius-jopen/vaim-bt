import React, { useState, useEffect } from 'react';

function LooperFull() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:4000/list-animation-images');
      const imageData = await response.json();
      setImages(imageData);
    } catch (error) {
      console.error("Failed to load images", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 1000 / 15);

      return () => clearInterval(interval);
    }
  }, [images, isPlaying]);

  const currentImageUrl = images.length > 0 ? `http://localhost:4000/images/${encodeURIComponent(images[currentIndex])}` : '';

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="looper">
      {images.length > 0 ? (
        <>
          <img className='cursor-pointer rounded-xl' src={currentImageUrl} alt="Gallery" onClick={togglePlayPause} />
          <div className="text-xs text-gray-500 mt-1 mb-1">Path: {images[currentIndex]}</div>
        </>
      ) : (
        <div>No images found</div>
      )}
    </div>
  );
}

export default LooperFull;

import React, { useState, useEffect } from 'react';

function LooperLatest() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // State to control playback

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:4000/list-latest-animation-images');
        const data = await response.json();

        if (data && data.length > 0) {
          setImages(data);
        } else {
          console.log("No images found in the latest folder.");
        }
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 1000 / 15);

      return () => clearInterval(interval);
    }
  }, [images, isPlaying]); // Depend on both images and isPlaying state

  const currentImageUrl = images.length > 0 ? `http://localhost:4000/images/${encodeURIComponent(images[currentIndex])}` : '';
  
  const togglePlayPause = () => setIsPlaying(!isPlaying); // Function to toggle the playback state

  return (
    <div className="looper-latest">
      {images.length > 0 ? (
        <>
          <img src={currentImageUrl} alt="Gallery" className="cursor-pointer rounded-xl" onClick={togglePlayPause} />
          <div className="text-xs text-gray-500 mt-1 mb-1">Path: {images[currentIndex]}</div>
        </>
      ) : (
        <div>No images found.</div>
      )}
    </div>
  );
}

export default LooperLatest;

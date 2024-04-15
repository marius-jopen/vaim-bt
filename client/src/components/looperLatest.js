import React, { useState, useEffect } from 'react';

function LooperLatest() {
  const [images, setImages] = useState([]);
  const [soundtrackInfo, setSoundtrackInfo] = useState(''); // Renamed to reflect that it's just information
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // State to control playback

  useEffect(() => {
    const fetchImagesAndSoundtrack = async () => {
      try {
        // Update the fetch URL to match the new endpoint
        const response = await fetch('http://localhost:4000/list-latest-animation');
        const data = await response.json();

        if (data && data.images && data.images.length > 0) {
          setImages(data.images);
          setSoundtrackInfo(data.soundtrack); // Set the soundtrack info
        } else {
          console.log("No images or soundtrack found in the latest folder.");
        }
      } catch (error) {
        console.error("Failed to load images and soundtrack info", error);
      }
    };

    fetchImagesAndSoundtrack();
  }, []);

  useEffect(() => {
    if (images.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 1000 / 3); // For example, 15 frames per second

      return () => clearInterval(interval);
    }
  }, [images, isPlaying]); // Depend on both images and isPlaying state

  const currentImageUrl = images.length > 0 ? `http://localhost:4000/images/${encodeURIComponent(images[currentIndex])}` : '';
  
  const togglePlayPause = () => setIsPlaying(!isPlaying); // Function to toggle the playback state

  return (
    <div className="looper-latest">
      {images.length > 0 && currentImageUrl ? (
        <>
        <div className='relative'>
          {soundtrackInfo && (
            <div className="caption absolute bottom-8 w-full text-center  font-bold px-8">{soundtrackInfo}</div>
          )}
          <img src={currentImageUrl} alt="Gallery" className="cursor-pointer rounded-xl" onClick={togglePlayPause} />
        </div>
          <div className='h-12'>
            <div className="text-xs text-gray-500 mt-2 mb-1">Image Path: {images[currentIndex]}</div>
          </div>
        </>
      ) : (
        <div>No images found.</div>
      )}
    </div>
  );
}

export default LooperLatest;

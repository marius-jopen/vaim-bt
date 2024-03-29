import React, { useState, useEffect } from 'react';

function ImagesPreview() {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:4000/list-preview-images')
      .then(response => response.json())
      .then(data => {
        setImages(data);
        setCurrentImageIndex(0); // Reset to the first image on receiving new data
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const handlePrevClick = () => {
    // Move to the previous image, looping back to the last if at the first
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    // Move to the next image and loop back to the first
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  return (
    <div className="images-preview">
      {images.length > 0 && (
        <>
          <img
            className='rounded-xl'
            src={`/images/${images[currentImageIndex]}`}
            alt="Slideshow"
            style={{ maxWidth: '100%', maxHeight: '90vh' }}
          />
          <div className='flex justify-between'>
            <div className="text-xs text-gray-500 mt-1 mb-1">Path:{`/images/${images[currentImageIndex]}`}</div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={handlePrevClick} className="transition bg-gray-200 hover:bg-gray-300 uppercase text-gray-800 py-2 px-4 rounded-xl text-xs">
                Prev
              </button>
              <button onClick={handleNextClick} className="transition bg-gray-200 hover:bg-gray-300 uppercase text-gray-800 py-2 px-4 rounded-xl text-xs">
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ImagesPreview;

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

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
        <div className='relative'>
          <img
            className='rounded-2xl'
            src={`/images/${images[currentImageIndex]}`}
            alt="Slideshow"
            style={{ maxWidth: '100%', maxHeight: '90vh' }}
          />
          <div className='h-12 absolute right-0 mt-[6px]'>
            <div className='flex justify-between'>
              {/* <div className="text-xs text-gray-500 mt-2 mb-1">Path:{`/images/${images[currentImageIndex]}`}</div> */}
              <div className="flex justify-end gap-2 mt-2">
                <span className="isolate inline-flex rounded-2xl shadow-sm">
                  <button
                    onClick={handlePrevClick}
                    type="button"
                    className="relative inline-flex items-center rounded-l-full bg-neutral-400 px-2 py-2 text-black border-r-2 border-black"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleNextClick}
                    type="button"
                    className="relative -ml-px inline-flex items-center rounded-r-full bg-neutral-400 px-2 py-2 text-black "
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagesPreview;

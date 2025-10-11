import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { getImageUrl } from '../utils'
import { useLanguageStore } from '../stores/languageStore'

const ImageGallery = ({ images = [], alt = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const { isRTL } = useLanguageStore()

  // Default placeholder if no images
  const displayImages = images.length > 0 ? images : ['/placeholder-car.jpg']

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox()
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage()
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage()
    }
  }

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <img
            src={getImageUrl(displayImages[currentIndex])}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => openLightbox(currentIndex)}
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg'
            }}
          />
          
          {/* Zoom Icon */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-70 transition-all"
               onClick={() => openLightbox(currentIndex)}>
            <ZoomIn className="w-5 h-5" />
          </div>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all`}
              >
                {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </button>
              <button
                onClick={nextImage}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all`}
              >
                {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>
            </>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="flex space-x-2 rtl:space-x-reverse mt-4 overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-car.jpg'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <img
              src={getImageUrl(displayImages[lightboxIndex])}
              alt={`${alt} - Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-car.jpg'
              }}
            />

            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all`}
                >
                  {isRTL ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
                </button>
                <button
                  onClick={nextLightboxImage}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all`}
                >
                  {isRTL ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {displayImages.length}
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 rtl:space-x-reverse max-w-full overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === lightboxIndex
                        ? 'border-white ring-2 ring-white ring-opacity-50'
                        : 'border-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${alt} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-car.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
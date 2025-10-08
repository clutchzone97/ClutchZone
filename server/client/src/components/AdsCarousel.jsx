import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { carsAPI } from '../services/api'
import { formatPrice, getImageUrl, generateSlug, cn } from '../utils'
import { useLanguageStore } from '../stores/languageStore'

const AdsCarousel = () => {
  const { t } = useTranslation()
  const { language, isRTL } = useLanguageStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Fetch featured cars
  const { data: featuredCars = [] } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: () => carsAPI.getAll({ featured: true, limit: 10 }).then(res => res.data.cars || []),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Auto-rotate slides
  useEffect(() => {
    if (featuredCars.length === 0 || isHovered) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCars.length)
    }, 4000) // 4 seconds

    return () => clearInterval(interval)
  }, [featuredCars.length, isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCars.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCars.length) % featuredCars.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (featuredCars.length === 0) {
    return null
  }

  return (
    <div 
      className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg">
          {/* Slides Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(${isRTL() ? currentSlide * 100 : -currentSlide * 100}%)` 
            }}
          >
            {featuredCars.map((car, index) => (
              <div key={car.id} className="w-full flex-shrink-0">
                <Link 
                  to={`/cars/${car.id}/${generateSlug(car.title)}`}
                  className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(car.images?.[0])}
                      alt={car.title}
                      className="w-24 h-16 object-cover rounded-md"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Car Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {car.title}
                    </h3>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <span className="text-sm text-gray-600">
                        {car.year} • {t(`makes.${car.make}`, car.make)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Price & Badges */}
                  <div className="flex-shrink-0 text-right rtl:text-left">
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(car.priceEGP, language)}
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
                      {car.condition === 'new' && (
                        <span className="badge badge-new">{t('common.new')}</span>
                      )}
                      <span className="badge badge-hot">{t('common.hot')}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {featuredCars.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all',
                  isRTL() ? 'right-2' : 'left-2'
                )}
              >
                {isRTL() ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={nextSlide}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all',
                  isRTL() ? 'left-2' : 'right-2'
                )}
              >
                {isRTL() ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {featuredCars.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {featuredCars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentSlide
                      ? 'bg-blue-600 w-6'
                      : 'bg-white/60 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdsCarousel
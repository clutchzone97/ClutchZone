import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, MapPin, Calendar, Gauge, Fuel, Settings, Bed, Bath, Square } from 'lucide-react'
import { formatPrice, getImageUrl, generateSlug, getBadge } from '../utils'
import { useLanguageStore } from '../stores/languageStore'

const ItemCard = ({ item, type }) => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()
  
  // Safety check for item
  if (!item) {
    return null
  }
  
  const badges = getBadge(item) || []

  const getItemUrl = () => {
    const slug = generateSlug(item.title)
    return `/${type === 'car' ? 'cars' : 'properties'}/${item.id}/${slug}`
  }

  const renderCarSpecs = () => (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Calendar className="w-4 h-4" />
        <span>{item.year || 'N/A'}</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Gauge className="w-4 h-4" />
        <span>{item.mileage?.toLocaleString() || '0'} {language === 'ar' ? 'كم' : 'km'}</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Settings className="w-4 h-4" />
        <span>{item.transmission ? t(`cars.transmission.${item.transmission}`, item.transmission) : 'N/A'}</span>
      </div>
    </div>
  )

  const renderPropertySpecs = () => (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Bed className="w-4 h-4" />
        <span>{item.bedrooms || 0} {language === 'ar' ? 'غرف' : 'beds'}</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Bath className="w-4 h-4" />
        <span>{item.bathrooms || 0} {language === 'ar' ? 'حمام' : 'baths'}</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Square className="w-4 h-4" />
        <span>{item.areaM2 || 0} {language === 'ar' ? 'م²' : 'm²'}</span>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(item.images?.[0])}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex flex-col space-y-1">
            {badges.map((badge, index) => (
              <span key={index} className={`badge badge-${badge.type}`}>
                {t(`common.${badge.text}`)}
              </span>
            ))}
          </div>
        )}

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link
            to={getItemUrl()}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Eye className="w-4 h-4" />
            <span>{t('common.viewDetails')}</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link to={getItemUrl()} className="hover:text-blue-600 transition-colors">
            {item.title || 'Untitled'}
          </Link>
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{item.city ? t(`cities.${item.city}`, item.city) : 'Unknown'}</span>
          {type === 'property' && item.neighborhood && (
            <span>, {item.neighborhood}</span>
          )}
        </div>

        {/* Specs */}
        {type === 'car' ? renderCarSpecs() : renderPropertySpecs()}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold price-highlight">
            {formatPrice(item.priceEGP, language)}
          </div>
          <Link
            to={getItemUrl()}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {t('common.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
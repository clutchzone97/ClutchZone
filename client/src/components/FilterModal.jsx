import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { carMakes, egyptianCities, propertyTypes } from '../utils'

const FilterModal = ({ isOpen, onClose, filters, onApply, type }) => {
  const { t } = useTranslation()
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApply(localFilters)
  }

  const handleReset = () => {
    const resetFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {})
    setLocalFilters(resetFilters)
  }

  if (!isOpen) return null

  const renderCarFilters = () => (
    <>
      {/* Make */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cars.filters.make')}
        </label>
        <select
          value={localFilters.make || ''}
          onChange={(e) => handleInputChange('make', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          {carMakes.map(make => (
            <option key={make} value={make}>
              {t(`makes.${make}`, make)}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cars.filters.year')}
        </label>
        <select
          value={localFilters.year || ''}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('cars.filters.minPrice')}
          </label>
          <input
            type="number"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('cars.filters.maxPrice')}
          </label>
          <input
            type="number"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            placeholder="1000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cars.filters.transmission')}
        </label>
        <select
          value={localFilters.transmission || ''}
          onChange={(e) => handleInputChange('transmission', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          <option value="manual">{t('cars.transmission.manual')}</option>
          <option value="automatic">{t('cars.transmission.automatic')}</option>
          <option value="cvt">{t('cars.transmission.cvt')}</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cars.filters.fuelType')}
        </label>
        <select
          value={localFilters.fuelType || ''}
          onChange={(e) => handleInputChange('fuelType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          <option value="petrol">{t('cars.fuelType.petrol')}</option>
          <option value="diesel">{t('cars.fuelType.diesel')}</option>
          <option value="hybrid">{t('cars.fuelType.hybrid')}</option>
          <option value="electric">{t('cars.fuelType.electric')}</option>
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cars.filters.condition')}
        </label>
        <select
          value={localFilters.condition || ''}
          onChange={(e) => handleInputChange('condition', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          <option value="new">{t('common.new')}</option>
          <option value="used">{t('common.used')}</option>
        </select>
      </div>
    </>
  )

  const renderPropertyFilters = () => (
    <>
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('properties.filters.type')}
        </label>
        <select
          value={localFilters.type || ''}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          {propertyTypes.map(type => (
            <option key={type} value={type}>
              {t(`properties.types.${type}`, type)}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('properties.filters.bedrooms')}
        </label>
        <select
          value={localFilters.bedrooms || ''}
          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('properties.filters.bathrooms')}
        </label>
        <select
          value={localFilters.bathrooms || ''}
          onChange={(e) => handleInputChange('bathrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties.filters.minPrice')}
          </label>
          <input
            type="number"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('properties.filters.maxPrice')}
          </label>
          <input
            type="number"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            placeholder="10000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('properties.filters.area')}
        </label>
        <input
          type="number"
          value={localFilters.areaM2 || ''}
          onChange={(e) => handleInputChange('areaM2', e.target.value)}
          placeholder="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Furnished */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('properties.filters.furnished')}
        </label>
        <select
          value={localFilters.furnished || ''}
          onChange={(e) => handleInputChange('furnished', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('common.all')}</option>
          <option value="furnished">{t('properties.furnished.furnished')}</option>
          <option value="unfurnished">{t('properties.furnished.unfurnished')}</option>
          <option value="semi-furnished">{t('properties.furnished.semi-furnished')}</option>
        </select>
      </div>
    </>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('common.filter')} {type === 'car' ? t('cars.title') : t('properties.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {type === 'car' ? renderCarFilters() : renderPropertyFilters()}
            
            {/* City - Common for both */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'car' ? t('cars.filters.city') : t('properties.filters.city')}
              </label>
              <select
                value={localFilters.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('common.all')}</option>
                {egyptianCities.map(city => (
                  <option key={city} value={city}>
                    {t(`cities.${city}`, city)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('common.reset')}
          </button>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('common.filter')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterModal
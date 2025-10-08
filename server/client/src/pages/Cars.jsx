import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Filter, Grid, List, Search, X } from 'lucide-react'
import { carsAPI } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'
import { sortOptions, carMakes, egyptianCities, debounce } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ItemCard from '../components/ItemCard'
import FilterModal from '../components/FilterModal'

const Cars = () => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    city: '',
    condition: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Debounced search
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, 500)

  // Fetch cars
  const { data, isLoading, error } = useQuery({
    queryKey: ['cars', filters, sortBy, searchTerm, currentPage],
    queryFn: () => carsAPI.getAll({
      ...filters,
      search: searchTerm,
      sort: sortBy,
      page: currentPage,
      limit: itemsPerPage
    }).then(res => res.data),
    keepPreviousData: true
  })

  const cars = data?.cars || []
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      mileage: '',
      transmission: '',
      fuelType: '',
      city: '',
      condition: ''
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('cars.title')}</h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>{t('common.filter')}</span>
                {hasActiveFilters && (
                  <span className="bg-blue-300 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">{t('common.filter')}:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null
                return (
                  <span key={key} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {t(`cars.filters.${key}`)}: {value}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                      className="ml-2 rtl:ml-0 rtl:mr-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
              {searchTerm && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {t('common.search')}: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 rtl:ml-0 rtl:mr-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                {t('common.reset')}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'ar' 
              ? `عرض ${cars.length} من أصل ${data?.total || 0} سيارة`
              : `Showing ${cars.length} of ${data?.total || 0} cars`
            }
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{t('common.error')}</p>
          </div>
        )}

        {/* Cars Grid/List */}
        {!isLoading && !error && (
          <>
            {cars.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {cars.map((car) => (
                  <ItemCard key={car.id} item={car} type="car" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {language === 'ar' ? 'لا توجد سيارات تطابق البحث' : 'No cars found matching your search'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={handleFilterChange}
        type="car"
      />
    </div>
  )
}

export default Cars
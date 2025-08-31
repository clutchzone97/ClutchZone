import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Grid, List, Filter, Search, SortAsc, SortDesc, MapPin, Home } from 'lucide-react'
import { propertiesAPI } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'
import { debounce, SORT_OPTIONS, CITIES, PROPERTY_TYPES } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ItemCard from '../components/ItemCard'
import FilterModal from '../components/FilterModal'

const Properties = () => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    city: '',
    furnished: ''
  })

  const itemsPerPage = 12

  // Debounce search term
  useEffect(() => {
    const debouncedUpdate = debounce((term) => {
      setDebouncedSearchTerm(term)
      setCurrentPage(1) // Reset to first page on search
    }, 300)

    debouncedUpdate(searchTerm)
    return () => debouncedUpdate.cancel?.()
  }, [searchTerm])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  // Fetch properties
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', {
      search: debouncedSearchTerm,
      sort: sortBy,
      page: currentPage,
      limit: itemsPerPage,
      ...filters
    }],
    queryFn: () => propertiesAPI.getAll({
      search: debouncedSearchTerm,
      sort: sortBy,
      page: currentPage,
      limit: itemsPerPage,
      ...filters
    }).then(res => res.data),
    keepPreviousData: true
  })

  const properties = data?.properties || []
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)
  const totalCount = data?.total || 0

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      bedrooms: '',
      bathrooms: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      city: '',
      furnished: ''
    })
    setSearchTerm('')
    setSortBy('newest')
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and Count */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('navigation.properties')}
              </h1>
              <p className="text-gray-600">
                {isLoading ? (
                  language === 'ar' ? 'جاري التحميل...' : 'Loading...'
                ) : (
                  language === 'ar' 
                    ? `${totalCount.toLocaleString()} عقار متاح`
                    : `${totalCount.toLocaleString()} properties available`
                )}
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن عقار...' : 'Search properties...'}
                  className="w-full sm:w-64 pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title={language === 'ar' ? 'عرض شبكي' : 'Grid view'}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title={language === 'ar' ? 'عرض قائمة' : 'List view'}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 border rounded-lg transition-colors ${
                  hasActiveFilters
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>{t('common.filters')}</span>
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sort and Active Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* Sort */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <label className="text-sm font-medium text-gray-700">
                {t('common.sortBy')}:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(`sort.${option.value}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'المرشحات النشطة:' : 'Active filters:'}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  {language === 'ar' ? 'مسح الكل' : 'Clear all'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'حدث خطأ' : 'Something went wrong'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' ? 'تعذر تحميل العقارات' : 'Failed to load properties'}
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? (language === 'ar' ? 'جرب تغيير المرشحات' : 'Try adjusting your filters')
                : (language === 'ar' ? 'لا توجد عقارات متاحة حالياً' : 'No properties available at the moment')
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {language === 'ar' ? 'مسح المرشحات' : 'Clear filters'}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Properties Grid/List */}
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
              {properties.map(property => (
                <ItemCard
                  key={property.id}
                  item={property}
                  type="property"
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === pageNum
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </button>
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
        onApplyFilters={handleFilterChange}
        type="property"
      />
    </div>
  )
}

export default Properties
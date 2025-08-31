import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Gauge, Settings, Fuel, Palette, Phone, Mail, Calculator } from 'lucide-react'
import { carsAPI } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'
import { formatPrice, getImageUrl, getBadge } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ImageGallery from '../components/ImageGallery'
import PurchaseRequestForm from '../components/PurchaseRequestForm'
import InstallmentCalculator from '../components/InstallmentCalculator'

const CarDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { language, isRTL } = useLanguageStore()
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)

  // Fetch car details
  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carsAPI.getById(id).then(res => res.data),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'السيارة غير موجودة' : 'Car not found'}
          </h1>
          <Link
            to="/cars"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {language === 'ar' ? 'العودة إلى السيارات' : 'Back to Cars'}
          </Link>
        </div>
      </div>
    )
  }

  const badges = getBadge(car)
  const specs = [
    { icon: Calendar, label: t('cars.specs.year'), value: car.year },
    { icon: Gauge, label: t('cars.specs.mileage'), value: `${car.mileage?.toLocaleString()} ${language === 'ar' ? 'كم' : 'km'}` },
    { icon: Settings, label: t('cars.specs.transmission'), value: t(`cars.transmission.${car.transmission}`, car.transmission) },
    { icon: Fuel, label: t('cars.specs.fuelType'), value: t(`cars.fuelType.${car.fuelType}`, car.fuelType) },
    { icon: Palette, label: t('cars.specs.color'), value: car.color },
    { icon: MapPin, label: t('cars.specs.city'), value: t(`cities.${car.city}`, car.city) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              {t('navigation.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/cars" className="text-gray-500 hover:text-gray-700">
              {t('navigation.cars')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate">{car.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImageGallery images={car.images || []} alt={car.title} />
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Title and Badges */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {badges.map((badge, index) => (
                      <span key={index} className={`badge badge-${badge.type}`}>
                        {t(`common.${badge.text}`)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right rtl:text-left mt-4 sm:mt-0">
                  <div className="text-3xl font-bold price-highlight">
                    {formatPrice(car.priceEGP, language)}
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {specs.map((spec, index) => {
                  const Icon = spec.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">{spec.label}</div>
                        <div className="font-medium text-gray-900">{spec.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {car.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'تواصل مع البائع' : 'Contact Seller'}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">01500978111</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">clutchzone97@gmail.com</span>
                </div>
              </div>

              <button
                onClick={() => setShowPurchaseForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('common.requestPurchase')}
              </button>
            </div>

            {/* Installment Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('calculator.title')}
                </h3>
              </div>
              <InstallmentCalculator price={car.priceEGP} />
            </div>

            {/* Share */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'شارك هذه السيارة' : 'Share this car'}
              </h3>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  WhatsApp
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  {language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Request Modal */}
      <PurchaseRequestForm
        isOpen={showPurchaseForm}
        onClose={() => setShowPurchaseForm(false)}
        item={car}
        itemType="car"
      />
    </div>
  )
}

export default CarDetail
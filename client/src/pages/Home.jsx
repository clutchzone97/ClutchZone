import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Car, Home as HomeIcon, ArrowLeft, ArrowRight } from 'lucide-react'
import { carsAPI, propertiesAPI } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'
import { formatPrice, getImageUrl, generateSlug } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ItemCard from '../components/ItemCard'

const Home = () => {
  const { t } = useTranslation()
  const { language, isRTL } = useLanguageStore()

  // Fetch featured cars
  const { data: featuredCars = [], isLoading: carsLoading } = useQuery({
    queryKey: ['featured-cars-home'],
    queryFn: () => carsAPI.getAll({ featured: true, limit: 6 }).then(res => res.data.cars || []),
  })

  // Fetch featured properties
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['featured-properties-home'],
    queryFn: () => propertiesAPI.getAll({ featured: true, limit: 6 }).then(res => res.data.properties || []),
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'ar' ? 'مرحبا بكم في ClutchZone' : 'Welcome to ClutchZone'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'وجهتك الأولى لشراء السيارات والعقارات في مصر. اكتشف أفضل العروض والخيارات المتنوعة.'
              : 'Your premier destination for buying cars and properties in Egypt. Discover the best deals and diverse options.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cars"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Car className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" />
              {t('navigation.cars')}
            </Link>
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <HomeIcon className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" />
              {t('navigation.properties')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'السيارات المميزة' : 'Featured Cars'}
            </h2>
            <Link
              to="/cars"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              {isRTL() ? (
                <ArrowLeft className="w-4 h-4 mr-1" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-1" />
              )}
            </Link>
          </div>

          {carsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <ItemCard key={car.id} item={car} type="car" />
              ))}
            </div>
          )}

          {!carsLoading && featuredCars.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد سيارات مميزة حالياً' : 'No featured cars available'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}
            </h2>
            <Link
              to="/properties"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              {isRTL() ? (
                <ArrowLeft className="w-4 h-4 mr-1" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-1" />
              )}
            </Link>
          </div>

          {propertiesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <ItemCard key={property.id} item={property} type="property" />
              ))}
            </div>
          )}

          {!propertiesLoading && featuredProperties.length === 0 && (
            <div className="text-center py-12">
              <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد عقارات مميزة حالياً' : 'No featured properties available'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'هل تريد بيع سيارتك أو عقارك؟' : 'Want to sell your car or property?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'انضم إلى آلاف البائعين الذين يثقون في منطقة الكلتش لبيع ممتلكاتهم بأفضل الأسعار.'
              : 'Join thousands of sellers who trust ClutchZone to sell their assets at the best prices.'
            }
          </p>
          <a
            href="tel:01500978111"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {language === 'ar' ? 'اتصل بنا الآن' : 'Contact Us Now'}
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
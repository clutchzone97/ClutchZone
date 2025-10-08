import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../stores/languageStore'

const Footer = () => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CZ</span>
              </div>
              <span className="text-xl font-bold">ClutchZone</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {language === 'ar' 
                ? 'منطقة الكلتش - وجهتك الأولى لشراء السيارات والعقارات في مصر. نوفر لك أفضل الخيارات بأسعار تنافسية وخدمة عملاء متميزة.'
                : 'ClutchZone - Your premier destination for buying cars and properties in Egypt. We provide you with the best options at competitive prices and excellent customer service.'
              }
            </p>
            <div className="text-sm text-gray-400">
              <p>{language === 'ar' ? 'جميع الأسعار بالجنيه المصري (ج.م)' : 'All prices in Egyptian Pounds (EGP)'}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.cars')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.properties')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="block">
                  {language === 'ar' ? 'الهاتف:' : 'Phone:'} 01500978111
                </span>
              </li>
              <li>
                <span className="block">
                  {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'} clutchzone97@gmail.com
                </span>
              </li>
              <li>
                <span className="block">
                  {language === 'ar' ? 'العنوان:' : 'Address:'} 
                  {language === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ClutchZone. 
            {language === 'ar' ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
          </div>
          <div className="flex space-x-6 rtl:space-x-reverse text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguageStore } from '../stores/languageStore'
import { cn } from '../utils'
import AdsCarousel from './AdsCarousel'

const Header = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { language, setLanguage, isRTL } = useLanguageStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const toggleLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
    setIsLanguageMenuOpen(false)
  }

  const navItems = [
    { path: '/cars', label: t('navigation.cars') },
    { path: '/properties', label: t('navigation.properties') },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CZ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">ClutchZone</span>
              <span className="text-xs text-gray-600">
                {language === 'ar' ? 'بيتك وعربيتك الجديدة هنا' : 'Your New Home and Car Are Here'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'ar' ? 'العربية' : 'English'}</span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute top-full mt-1 right-0 rtl:right-auto rtl:left-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[120px] z-50">
                  <button
                    onClick={() => toggleLanguage('ar')}
                    className={cn(
                      'block w-full text-right rtl:text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors',
                      language === 'ar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    )}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={cn(
                      'block w-full text-right rtl:text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors',
                      language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    )}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Ads Carousel - Only show on home page */}
      {location.pathname === '/' && (
        <div className="border-t border-gray-200">
          <AdsCarousel />
        </div>
      )}
    </header>
  )
}

export default Header
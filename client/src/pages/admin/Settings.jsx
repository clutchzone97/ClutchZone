import React, { useState, useEffect } from 'react'
import { Save, Upload, Palette, Phone, Mail, Globe, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('logo')
  const {
    settings,
    isLoading,
    updateLogo,
    updateSocialMedia,
    updateTheme,
    updateContact,
    updateSiteInfo,
    isUpdatingLogo,
    isUpdatingSocial,
    isUpdatingTheme,
    isUpdatingContact,
    isUpdatingSiteInfo
  } = useSettings()
  
  // Settings state
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: '',
    logoText: 'ClutchZone',
    faviconUrl: ''
  })
  
  const [socialSettings, setSocialSettings] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    whatsapp: ''
  })
  
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    backgroundColor: '#F9FAFB',
    textColor: '#111827'
  })
  
  const [contactSettings, setContactSettings] = useState({
    phone: '01500978111',
    email: 'clutchzone97@gmail.com',
    address: ''
  })
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ClutchZone',
    siteDescription: '',
    siteKeywords: '',
    language: 'ar'
  })

  // Load settings when data is available
  useEffect(() => {
    if (settings) {
      setLogoSettings(prev => ({ ...prev, ...settings.logo }))
      setSocialSettings(prev => ({ ...prev, ...settings.socialMedia }))
      setThemeSettings(prev => ({ ...prev, ...settings.theme }))
      setContactSettings(prev => ({ ...prev, ...settings.contact }))
      setSiteSettings(prev => ({ ...prev, ...settings.siteInfo }))
    }
  }, [settings])

  const handleSaveLogo = () => {
    updateLogo(logoSettings)
  }

  const handleSaveSocial = () => {
    updateSocialMedia(socialSettings)
  }

  const handleSaveTheme = () => {
    updateTheme(themeSettings)
  }

  const handleSaveContact = () => {
    updateContact(contactSettings)
  }

  const handleSaveSiteInfo = () => {
    updateSiteInfo(siteSettings)
  }

  const tabs = [
    { id: 'logo', name: 'الشعار', icon: Upload },
    { id: 'social', name: 'وسائل التواصل', icon: Globe },
    { id: 'theme', name: 'الألوان والتصميم', icon: Palette },
    { id: 'contact', name: 'معلومات التواصل', icon: Phone },
    { id: 'site', name: 'إعدادات الموقع', icon: Mail }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
            <p className="text-gray-600 mt-1">تحكم في جميع إعدادات الموقع من هنا</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" dir="rtl">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Logo Settings */}
            {activeTab === 'logo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">إعدادات الشعار</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الشعار
                    </label>
                    <input
                      type="url"
                      value={logoSettings.logoUrl}
                      onChange={(e) => setLogoSettings({...logoSettings, logoUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نص الشعار
                    </label>
                    <input
                      type="text"
                      value={logoSettings.logoText}
                      onChange={(e) => setLogoSettings({...logoSettings, logoText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ClutchZone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الأيقونة المفضلة (Favicon)
                    </label>
                    <input
                      type="url"
                      value={logoSettings.faviconUrl}
                      onChange={(e) => setLogoSettings({...logoSettings, faviconUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSaveLogo}
                  disabled={isUpdatingLogo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdatingLogo ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">وسائل التواصل الاجتماعي</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 inline ml-2" />
                      فيسبوك
                    </label>
                    <input
                      type="url"
                      value={socialSettings.facebook}
                      onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://facebook.com/clutchzone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 inline ml-2" />
                      تويتر
                    </label>
                    <input
                      type="url"
                      value={socialSettings.twitter}
                      onChange={(e) => setSocialSettings({...socialSettings, twitter: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://twitter.com/clutchzone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline ml-2" />
                      إنستغرام
                    </label>
                    <input
                      type="url"
                      value={socialSettings.instagram}
                      onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://instagram.com/clutchzone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Youtube className="w-4 h-4 inline ml-2" />
                      يوتيوب
                    </label>
                    <input
                      type="url"
                      value={socialSettings.youtube}
                      onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/clutchzone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      واتساب
                    </label>
                    <input
                      type="tel"
                      value={socialSettings.whatsapp}
                      onChange={(e) => setSocialSettings({...socialSettings, whatsapp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="01500978111"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSaveSocial}
                  disabled={isUpdatingSocial}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdatingSocial ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">الألوان والتصميم</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللون الأساسي
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللون الثانوي
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لون التمييز
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings({...themeSettings, accentColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings({...themeSettings, accentColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لون الخلفية
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.backgroundColor}
                        onChange={(e) => setThemeSettings({...themeSettings, backgroundColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.backgroundColor}
                        onChange={(e) => setThemeSettings({...themeSettings, backgroundColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لون النص
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={themeSettings.textColor}
                        onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeSettings.textColor}
                        onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSaveTheme}
                  disabled={isUpdatingTheme}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdatingTheme ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">معلومات التواصل</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={contactSettings.phone}
                      onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="01500978111"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={contactSettings.email}
                      onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="clutchzone97@gmail.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <textarea
                      value={contactSettings.address}
                      onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="العنوان الكامل للشركة"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSaveContact}
                  disabled={isUpdatingContact}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdatingContact ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            )}

            {/* Site Settings */}
            {activeTab === 'site' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">إعدادات الموقع العامة</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الموقع
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ClutchZone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لغة الموقع
                    </label>
                    <select
                      value={siteSettings.language}
                      onChange={(e) => setSiteSettings({...siteSettings, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الموقع
                    </label>
                    <textarea
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="وصف مختصر عن الموقع"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكلمات المفتاحية
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteKeywords}
                      onChange={(e) => setSiteSettings({...siteSettings, siteKeywords: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="سيارات، عقارات، كلاتش زون"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSaveSiteInfo}
                  disabled={isUpdatingSiteInfo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdatingSiteInfo ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
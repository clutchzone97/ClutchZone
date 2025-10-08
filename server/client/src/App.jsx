import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetail from './pages/CarDetail'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminSettings from './pages/admin/Settings'
import AddCar from './pages/admin/AddCar'
import AddProperty from './pages/admin/AddProperty'
import ProtectedRoute from './components/ProtectedRoute'
import { useLanguageStore } from './stores/languageStore'

function App() {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  useEffect(() => {
    // Set initial language and direction
    const savedLanguage = localStorage.getItem('language') || 'ar'
    setLanguage(savedLanguage)
    i18n.changeLanguage(savedLanguage)
    
    // Update document direction and language
    document.documentElement.lang = savedLanguage
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
    
    // Update body class for font family
    document.body.className = savedLanguage === 'ar' ? 'font-arabic' : 'font-english'
  }, [language, i18n, setLanguage])

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/:id/:slug?" element={<CarDetail />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id/:slug?" element={<PropertyDetail />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-car" element={
          <ProtectedRoute>
            <AddCar />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-property" element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  )
}

export default App
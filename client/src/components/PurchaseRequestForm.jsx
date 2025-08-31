import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { X, User, Phone, Mail, Car, Home, CheckCircle, AlertCircle } from 'lucide-react'
import { purchaseRequestsAPI } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'
import { validateEgyptianPhone, validateEmail } from '../utils'

const PurchaseRequestForm = ({ isOpen, onClose, item, itemType }) => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (data) => purchaseRequestsAPI.create(data),
    onSuccess: () => {
      setIsSubmitted(true)
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', phone: '', email: '' })
        setErrors({})
        onClose()
      }, 3000)
    },
    onError: (error) => {
      console.error('Error submitting purchase request:', error)
      setErrors({ submit: language === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting request' })
    }
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = language === 'ar' ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'ar' ? 'رقم الموبايل مطلوب' : 'Phone number is required'
    } else if (!validateEgyptianPhone(formData.phone)) {
      newErrors.phone = language === 'ar' ? 'رقم الموبايل المصري غير صحيح' : 'Invalid Egyptian phone number'
    }

    // Email validation (optional)
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const requestData = {
      itemType,
      itemId: item.id,
      name: formData.name.trim(),
      phoneEG: formData.phone.trim(),
      email: formData.email.trim() || null
    }

    submitMutation.mutate(requestData)
  }

  const handleClose = () => {
    if (!submitMutation.isPending) {
      setFormData({ name: '', phone: '', email: '' })
      setErrors({})
      setIsSubmitted(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {itemType === 'car' ? (
              <Car className="w-6 h-6 text-blue-600" />
            ) : (
              <Home className="w-6 h-6 text-blue-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {t('common.requestPurchase')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={submitMutation.isPending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Success Message
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request sent successfully!'}
              </h3>

              <div className="text-sm text-gray-500">
                {language === 'ar' ? 'سيتم إغلاق هذه النافذة تلقائياً...' : 'This window will close automatically...'}
              </div>
            </div>
          ) : (
            <>
              {/* Item Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <img
                    src={item.images?.[0] || '/placeholder-car.jpg'}
                    alt={item.title}
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/placeholder-car.jpg'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {itemType === 'car' ? t('navigation.cars') : t('navigation.properties')}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {item.priceEGP?.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
                    {t('form.fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    disabled={submitMutation.isPending}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
                    {t('form.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={language === 'ar' ? '01xxxxxxxxx' : '01xxxxxxxxx'}
                    disabled={submitMutation.isPending}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                      {errors.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ar' ? 'مثال: 01012345678' : 'Example: 01012345678'}
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
                    {t('form.email')} ({language === 'ar' ? 'اختياري' : 'optional'})
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                    disabled={submitMutation.isPending}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1 rtl:mr-1" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <span>{language === 'ar' ? 'إرسال الطلب' : 'Send Request'}</span>
                  )}
                </button>
              </form>


            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseRequestForm
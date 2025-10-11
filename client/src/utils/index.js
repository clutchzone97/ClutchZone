import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Egyptian phone number validation
export const validateEgyptianPhone = (phone) => {
  const regex = /^(01)(0|1|2|5)\d{8}$/
  return regex.test(phone)
}

// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Format price in EGP
export const formatPrice = (price, language = 'ar') => {
  if (!price) return '0'
  
  const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  const formattedNumber = formatter.format(price)
  return language === 'ar' ? `${formattedNumber} ج.م` : `EGP ${formattedNumber}`
}

// Calculate monthly installment
export const calculateMonthlyPayment = (price, downPaymentPercent, annualInterestRate, years) => {
  const principal = price - (price * downPaymentPercent / 100)
  const monthlyRate = annualInterestRate / 12 / 100
  const numberOfPayments = years * 12
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }
  
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  
  return monthlyPayment
}

// Alias for backward compatibility
export const calculateMonthlyInstallment = calculateMonthlyPayment

// Generate slug from title
export const generateSlug = (title) => {
  if (!title || typeof title !== 'string') {
    return 'untitled'
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '') // Keep Arabic characters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Format date
export const formatDate = (date, language = 'ar') => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', options).format(new Date(date))
}

// Format number with Arabic/English numerals
export const formatNumber = (number, language = 'ar') => {
  if (language === 'ar') {
    return number.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
  }
  return number.toString()
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg'
  if (imagePath.startsWith('http')) return imagePath
  if (typeof imagePath === 'object' && imagePath.url) return imagePath.url
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get car/property badge
export const getBadge = (item) => {
  const badges = []
  
  if (item.isFeatured) badges.push({ text: 'featured', type: 'featured' })
  if (item.condition === 'new') badges.push({ text: 'new', type: 'new' })
  if (item.isHot) badges.push({ text: 'hot', type: 'hot' })
  if (item.isSold) badges.push({ text: 'sold', type: 'sold' })
  
  return badges
}

// Sort options
export const sortOptions = [
  { value: 'newest', label: 'sort.newest' },
  { value: 'oldest', label: 'sort.oldest' },
  { value: 'priceAsc', label: 'sort.priceAsc' },
  { value: 'priceDesc', label: 'sort.priceDesc' },
]

// Alias for backward compatibility
export const SORT_OPTIONS = sortOptions

// Egyptian cities
export const egyptianCities = [
  'cairo', 'alexandria', 'giza', 'sharm', 'hurghada',
  'luxor', 'aswan', 'mansoura', 'tanta', 'ismailia'
]

// Alias for backward compatibility
export const CITIES = egyptianCities

// Car makes
export const carMakes = [
  'toyota', 'nissan', 'hyundai', 'kia', 'chevrolet',
  'ford', 'volkswagen', 'bmw', 'mercedes', 'audi'
]

// Property types
export const propertyTypes = [
  'apartment', 'villa', 'house', 'studio', 'duplex', 'penthouse', 'townhouse', 'shop'
]

// Alias for backward compatibility
export const PROPERTY_TYPES = propertyTypes
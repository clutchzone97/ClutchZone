import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react'
import { useLanguageStore } from '../stores/languageStore'
import { formatPrice, calculateMonthlyInstallment } from '../utils'

const InstallmentCalculator = ({ price = 0 }) => {
  const { t } = useTranslation()
  const { language } = useLanguageStore()
  const [inputs, setInputs] = useState({
    price: price,
    downPaymentPercent: 20,
    annualInterestRate: 12,
    tenureYears: 5
  })
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  // Update price when prop changes
  useEffect(() => {
    setInputs(prev => ({ ...prev, price }))
  }, [price])

  // Calculate monthly payment whenever inputs change
  useEffect(() => {
    const { price, downPaymentPercent, annualInterestRate, tenureYears } = inputs
    
    if (price > 0 && tenureYears > 0) {
      const downPayment = (price * downPaymentPercent) / 100
      const loanAmount = price - downPayment
      
      if (loanAmount > 0 && annualInterestRate > 0) {
        const monthly = calculateMonthlyInstallment(
          loanAmount,
          annualInterestRate,
          tenureYears
        )
        const total = monthly * tenureYears * 12
        const interest = total - loanAmount
        
        setMonthlyPayment(monthly)
        setTotalAmount(total + downPayment)
        setTotalInterest(interest)
      } else if (loanAmount > 0) {
        // No interest case
        const monthly = loanAmount / (tenureYears * 12)
        setMonthlyPayment(monthly)
        setTotalAmount(price)
        setTotalInterest(0)
      } else {
        // Full down payment
        setMonthlyPayment(0)
        setTotalAmount(price)
        setTotalInterest(0)
      }
    } else {
      setMonthlyPayment(0)
      setTotalAmount(0)
      setTotalInterest(0)
    }
  }, [inputs])

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    setInputs(prev => ({ ...prev, [field]: numValue }))
  }

  const downPaymentAmount = (inputs.price * inputs.downPaymentPercent) / 100
  const loanAmount = inputs.price - downPaymentAmount

  return (
    <div className="space-y-4">
      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
          {t('calculator.price')}
        </label>
        <input
          type="number"
          value={inputs.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="0"
          min="0"
          step="1000"
        />
      </div>

      {/* Down Payment Percentage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Percent className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
          {t('calculator.downPayment')} ({inputs.downPaymentPercent}%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={inputs.downPaymentPercent}
          onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span className="font-medium text-blue-600">
            {formatPrice(downPaymentAmount, language)}
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Annual Interest Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Percent className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
          {t('calculator.interestRate')} ({inputs.annualInterestRate}%)
        </label>
        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={inputs.annualInterestRate}
          onChange={(e) => handleInputChange('annualInterestRate', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>

      {/* Tenure Years */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline-block ml-1 rtl:mr-1" />
          {t('calculator.tenure')} ({inputs.tenureYears} {language === 'ar' ? 'سنوات' : 'years'})
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={inputs.tenureYears}
          onChange={(e) => handleInputChange('tenureYears', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 {language === 'ar' ? 'سنة' : 'year'}</span>
          <span>30 {language === 'ar' ? 'سنة' : 'years'}</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-blue-900 text-center">
          {t('calculator.results')}
        </h4>
        
        {/* Monthly Payment */}
        <div className="bg-white rounded-lg p-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {t('calculator.monthlyPayment')}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(monthlyPayment, language)}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'ar' ? 'شهرياً' : 'per month'}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('calculator.loanAmount')}:</span>
            <span className="font-medium">{formatPrice(loanAmount, language)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('calculator.downPaymentAmount')}:</span>
            <span className="font-medium">{formatPrice(downPaymentAmount, language)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('calculator.totalInterest')}:</span>
            <span className="font-medium text-orange-600">{formatPrice(totalInterest, language)}</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="text-gray-900 font-semibold">{t('calculator.totalAmount')}:</span>
            <span className="font-bold text-blue-600">{formatPrice(totalAmount, language)}</span>
          </div>
        </div>

        {/* Payment Schedule Info */}
        {monthlyPayment > 0 && (
          <div className="text-xs text-gray-600 text-center border-t border-blue-200 pt-2">
            {language === 'ar' 
              ? `${inputs.tenureYears * 12} قسط شهري بقيمة ${formatPrice(monthlyPayment, language)}`
              : `${inputs.tenureYears * 12} monthly payments of ${formatPrice(monthlyPayment, language)}`
            }
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center">
        {language === 'ar' 
          ? 'هذه الحسابات تقديرية وقد تختلف الشروط الفعلية'
          : 'These calculations are estimates and actual terms may vary'
        }
      </div>
    </div>
  )
}

export default InstallmentCalculator
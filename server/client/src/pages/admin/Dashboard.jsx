import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Car, Home, Users, TrendingUp, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Settings } from 'lucide-react'
import { carsAPI, propertiesAPI, purchaseRequestsAPI, dashboardAPI } from '../../services/api'
import { useLanguageStore } from '../../stores/languageStore'
import { formatPrice, formatDate } from '../../utils'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => dashboardAPI.getStats().then(res => res.data)
  })

  // Fetch recent purchase requests
  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['recent-requests'],
    queryFn: () => dashboardAPI.getRecentRequests().then(res => res.data.requests || [])
  })

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4 rtl:mr-4 rtl:ml-0">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  const RequestRow = ({ request }) => {
    const itemType = request.itemType === 'car' ? t('navigation.cars') : t('navigation.properties')
    const statusColor = request.status === 'pending' ? 'yellow' : request.status === 'contacted' ? 'blue' : 'green'
    
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{request.name}</div>
          <div className="text-sm text-gray-500">{request.phoneEG}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{itemType}</div>
          <div className="text-sm text-gray-500">ID: {request.itemId}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
            {t(`admin.status.${request.status}`)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(request.createdAt, language)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button className="text-blue-600 hover:text-blue-900">
              <Eye className="w-4 h-4" />
            </button>
            <button className="text-green-600 hover:text-green-900">
              <CheckCircle className="w-4 h-4" />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'ar' ? 'إدارة السيارات والعقارات وطلبات الشراء' : 'Manage cars, properties, and purchase requests'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>{language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Car}
            title={t('navigation.cars')}
            value={stats?.totalCars || 0}
            color="blue"
          />
          <StatCard
            icon={Home}
            title={t('navigation.properties')}
            value={stats?.totalProperties || 0}
            color="green"
          />
          <StatCard
            icon={Users}
            title={language === 'ar' ? 'طلبات الشراء' : 'Purchase Requests'}
            value={stats?.totalRequests || 0}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 rtl:space-x-reverse px-6">
              {[
                { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: TrendingUp },
                { id: 'cars', label: t('navigation.cars'), icon: Car },
                { id: 'properties', label: t('navigation.properties'), icon: Home },
                { id: 'requests', label: language === 'ar' ? 'طلبات الشراء' : 'Purchase Requests', icon: Users }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate('/admin/add-car')}
                        className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 font-medium">
                          {language === 'ar' ? 'إضافة سيارة جديدة' : 'Add New Car'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/add-property')}
                        className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {language === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                    </h3>
                    <div className="space-y-3">
                      {requestsLoading ? (
                        <div className="flex justify-center py-4">
                          <LoadingSpinner />
                        </div>
                      ) : recentRequests?.slice(0, 5).map(request => (
                        <div key={request.id} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {language === 'ar' ? 'طلب شراء جديد من' : 'New purchase request from'} {request.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(request.createdAt, language)}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">
                          {language === 'ar' ? 'لا توجد أنشطة حديثة' : 'No recent activity'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'طلبات الشراء' : 'Purchase Requests'}
                  </h3>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                      <option value="pending">{t('admin.status.pending')}</option>
                      <option value="contacted">{t('admin.status.contacted')}</option>
                      <option value="completed">{t('admin.status.completed')}</option>
                    </select>
                  </div>
                </div>

                {requestsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'ar' ? 'العميل' : 'Customer'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'ar' ? 'العنصر' : 'Item'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'ar' ? 'التاريخ' : 'Date'}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {language === 'ar' ? 'الإجراءات' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentRequests?.map(request => (
                          <RequestRow key={request.id} request={request} />
                        )) || (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                              {language === 'ar' ? 'لا توجد طلبات' : 'No requests found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'cars' || activeTab === 'properties') && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {activeTab === 'cars' ? <Car className="w-16 h-16 mx-auto" /> : <Home className="w-16 h-16 mx-auto" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'cars' 
                    ? (language === 'ar' ? 'إدارة السيارات' : 'Car Management')
                    : (language === 'ar' ? 'إدارة العقارات' : 'Property Management')
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ar' ? 'هذا القسم قيد التطوير' : 'This section is under development'}
                </p>
                <button 
                  onClick={() => navigate(activeTab === 'cars' ? '/admin/add-car' : '/admin/add-property')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'إضافة جديد' : 'Add New'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
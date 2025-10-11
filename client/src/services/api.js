import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://clutchzone.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
}

// Cars API
export const carsAPI = {
  getAll: (params) => api.get('/api/cars', { params }),
  getById: (id) => api.get(`/api/cars/${id}`),
  create: (data) => api.post('/api/cars', data),
  update: (id, data) => api.put(`/api/cars/${id}`, data),
  delete: (id) => api.delete(`/api/cars/${id}`),
  updateStatus: (id, status) => api.patch(`/api/cars/${id}/status`, { status }),
  uploadImages: (id, formData) => api.post(`/api/cars/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Properties API
export const propertiesAPI = {
  getAll: (params) => api.get('/api/properties', { params }),
  getById: (id) => api.get(`/api/properties/${id}`),
  create: (data) => api.post('/api/properties', data),
  update: (id, data) => api.put(`/api/properties/${id}`, data),
  delete: (id) => api.delete(`/api/properties/${id}`),
  updateStatus: (id, status) => api.patch(`/api/properties/${id}/status`, { status }),
  uploadImages: (id, formData) => api.post(`/api/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Purchase Requests API
export const purchaseRequestsAPI = {
  create: (data) => api.post('/api/requests', data),
  getAll: (params) => api.get('/api/requests', { params }),
  updateStatus: (id, status) => api.patch(`/api/requests/${id}`, { status }),
  delete: (id) => api.delete(`/api/requests/${id}`),
  exportCsv: () => api.get('/api/requests/export', { responseType: 'blob' }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getRecentRequests: (params) => api.get('/api/dashboard/recent-requests', { params }),
}

// Alias for backward compatibility
export const requestsAPI = purchaseRequestsAPI

export default api
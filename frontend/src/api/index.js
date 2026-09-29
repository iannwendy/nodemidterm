import axios from 'axios'

// In production (Docker): API is proxied through nginx at port 3000
// In development: Use localhost:3000 directly
const API_BASE = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'
)

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.message)
    return Promise.reject(error)
  }
)

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  upload: (formData) => api.post('/tasks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const statsAPI = {
  getDashboard: () => api.get('/stats'),
  getHealth: () => api.get('/health'),
}

export default api

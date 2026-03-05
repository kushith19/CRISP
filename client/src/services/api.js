import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const uploadDataset = (formData, onProgress) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
    },
  })

export const getAnalytics = () => api.get('/analytics')

export const getCustomers = (params) => api.get('/customers', { params })

export const getCustomerById = (id) => api.get(`/customers/${id}`)

export default api
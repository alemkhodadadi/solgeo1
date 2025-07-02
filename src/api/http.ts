import axios from 'axios'
import { useAppStore } from '@/store/app'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('API Base URL:', apiClient.defaults.baseURL)

// Optional: attach token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
    response => response,
    error => {
        const msg = error.message || 'Unknown error';
        console.log('error is:', error)
        useAppStore().notify({
            severity: 'error',
            summary: 'Something went wrong!',
            detail: msg,
            group: 'api',
            life: 5000
        })
        return Promise.reject(error);
    }
);

export default apiClient

import axios from 'axios'
import { authService } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = authService.getAccessToken()
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshResponse = await authService.refreshToken()
        authService.setTokens(refreshResponse.data)
        originalRequest.headers.Authorization = `Bearer ${authService.getAccessToken()}`
        return api(originalRequest)
      } catch {
        authService.clearTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

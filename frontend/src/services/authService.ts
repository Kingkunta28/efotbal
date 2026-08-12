import { api } from './api'

type TokenResponse = {
  access: string
  refresh: string
}

const ACCESS_TOKEN_KEY = 'efotbal_access_token'
const REFRESH_TOKEN_KEY = 'efotbal_refresh_token'

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login/', { email, password }),
  register: (payload: { username: string; email: string; password: string }) => api.post('/auth/register/', payload),
  refreshToken: () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    return api.post('/auth/refresh/', { refresh })
  },
  getCurrentUser: () => api.get('/auth/me/'),
  setTokens: (data: TokenResponse) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
  },
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

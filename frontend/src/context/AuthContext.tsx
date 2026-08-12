import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

type User = {
  id: number
  username: string
  email: string
  role: string
  avatar?: string | null
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: { username: string; email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const token = authService.getAccessToken()
        if (!token) {
          setUser(null)
          return
        }
        const response = await authService.getCurrentUser()
        setUser(response.data)
      } catch {
        authService.clearTokens()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const response = await authService.login(email, password)
    authService.setTokens(response.data)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser.data)
    setIsLoading(false)
  }

  const register = async (payload: { username: string; email: string; password: string }) => {
    setIsLoading(true)
    await authService.register(payload)
    const response = await authService.login(payload.email, payload.password)
    authService.setTokens(response.data)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser.data)
    setIsLoading(false)
  }

  const logout = () => {
    authService.clearTokens()
    setUser(null)
  }

  const memoValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

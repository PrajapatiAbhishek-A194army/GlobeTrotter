import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — restore user from localStorage and optionally refresh from API
  useEffect(() => {
    const savedUser  = localStorage.getItem('gt_user')
    const savedToken = localStorage.getItem('gt_token')

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('gt_user')
        localStorage.removeItem('gt_token')
      }
    }
    setLoading(false)
  }, [])

  /**
   * Called after successful login or signup
   */
  const loginCtx = useCallback((userData, token) => {
    setUser(userData)
    localStorage.setItem('gt_token', token)
    localStorage.setItem('gt_user', JSON.stringify(userData))
  }, [])

  /**
   * Clear session
   */
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('gt_token')
    localStorage.removeItem('gt_user')
  }, [])

  /**
   * Refresh user data from the API (used after profile updates)
   */
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me')
      const fresh = data.data.user
      setUser(fresh)
      localStorage.setItem('gt_user', JSON.stringify(fresh))
      return fresh
    } catch {
      logout()
    }
  }, [logout])

  /**
   * Patch local user state without a full API refresh
   */
  const updateUserLocal = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem('gt_user', JSON.stringify(next))
      return next
    })
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin:         user?.role === 'ADMIN',
    loginCtx,
    logout,
    refreshUser,
    updateUserLocal,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook — must be used inside AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export default AuthContext

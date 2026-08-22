import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { setSuppressAuthRedirect } from '../services/api'

const AuthContext = createContext(null)

// Storage helpers — support both 'remember me' (localStorage) and session (sessionStorage)
const STORAGE_KEY_TOKEN = 'gt_token'
const STORAGE_KEY_USER  = 'gt_user'

function saveSession(userData, token, remember = true) {
  const store = remember ? localStorage : sessionStorage
  store.setItem(STORAGE_KEY_TOKEN, token)
  store.setItem(STORAGE_KEY_USER,  JSON.stringify(userData))
  // Also store in localStorage so we can read on startup
  if (!remember) {
    // sessionStorage only — remove from localStorage in case old session is there
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_USER)
  sessionStorage.removeItem(STORAGE_KEY_TOKEN)
  sessionStorage.removeItem(STORAGE_KEY_USER)
}

function readSavedSession() {
  // Try localStorage first (remember me), then sessionStorage (session-only)
  const token = localStorage.getItem(STORAGE_KEY_TOKEN) || sessionStorage.getItem(STORAGE_KEY_TOKEN)
  const user  = localStorage.getItem(STORAGE_KEY_USER)  || sessionStorage.getItem(STORAGE_KEY_USER)
  return { token, user }
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — read saved session, then VERIFY the token with the API
  useEffect(() => {
    async function restoreSession() {
      const { token, user: savedUser } = readSavedSession()

      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      // Optimistically restore user so the UI doesn't flash to login
      try { setUser(JSON.parse(savedUser)) } catch { /* ignore */ }

      // Silently verify the token is still valid
      setSuppressAuthRedirect(true)
      try {
        const { data } = await api.get('/auth/me')
        const freshUser = data.data.user
        setUser(freshUser)
        // Update cached user profile (in case it changed)
        const inLocal = !!localStorage.getItem(STORAGE_KEY_TOKEN)
        const store   = inLocal ? localStorage : sessionStorage
        store.setItem(STORAGE_KEY_USER, JSON.stringify(freshUser))
      } catch {
        // Token is invalid or expired — clear everything
        clearSession()
        setUser(null)
      } finally {
        setSuppressAuthRedirect(false)
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  /**
   * Called after successful login or signup.
   * @param {boolean} remember - if true, persists across browser restarts (localStorage);
   *                              if false, only valid for the current tab session (sessionStorage).
   */
  const loginCtx = useCallback((userData, token, remember = true) => {
    setUser(userData)
    saveSession(userData, token, remember)
  }, [])

  /** Clear session and log out */
  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  /** Refresh user data from the API (used after profile updates) */
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me')
      const fresh = data.data.user
      setUser(fresh)
      // Keep in whichever storage was used
      const inLocal = !!localStorage.getItem(STORAGE_KEY_TOKEN)
      const store   = inLocal ? localStorage : sessionStorage
      store.setItem(STORAGE_KEY_USER, JSON.stringify(fresh))
      return fresh
    } catch {
      logout()
    }
  }, [logout])

  /** Patch local user state without a full API refresh */
  const updateUserLocal = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial }
      const inLocal = !!localStorage.getItem(STORAGE_KEY_TOKEN)
      const store   = inLocal ? localStorage : sessionStorage
      store.setItem(STORAGE_KEY_USER, JSON.stringify(next))
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

/** Hook — must be used inside AuthProvider */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export default AuthContext

import api from './api'

/**
 * GlobeTrotter Authentication Service
 * All functions return the `data` payload from the API response.
 */

/**
 * Create a new account
 */
export const signup = async (payload) => {
  const { data } = await api.post('/auth/signup', payload)
  return data.data // { user, token }
}

/**
 * Login with email + password
 */
export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data.data // { user, token }
}

/**
 * Get the current user's profile (requires JWT in header)
 */
export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data.data.user
}

/**
 * Send a password reset email
 */
export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

/**
 * Reset password using the token from the email link
 */
export const resetPassword = async (token, password) => {
  const { data } = await api.patch(`/auth/reset-password/${token}`, { password })
  return data
}

/**
 * Change password while logged in (supports optional OTP)
 */
export const changePassword = async (currentPassword, newPassword, otp) => {
  const { data } = await api.patch('/auth/change-password', { currentPassword, newPassword, otp })
  return data
}

/**
 * Send OTP verification code to user email
 */
export const sendPasswordOtp = async (email = null) => {
  const { data } = await api.post('/auth/send-otp', { email })
  return data
}

/**
 * Verify OTP and set new password
 */
export const verifyOtp = async (email, otp, newPassword) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp, newPassword })
  return data
}

/**
 * Update profile fields
 */
export const updateProfile = async (updates) => {
  const { data } = await api.patch('/auth/update-profile', updates)
  return data.data.user
}

/**
 * Upload avatar image file
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const { data } = await api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data.user
}

export default { signup, login, getMe, forgotPassword, resetPassword, changePassword, updateProfile, uploadAvatar, sendPasswordOtp, verifyOtp }

import * as authService from '../services/auth.service.js'

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, city, country } = req.body
    const result = await authService.signup({ email, password, firstName, lastName, phone, city, country })

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to GlobeTrotter.',
      data:    result,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await authService.login({ email, password })

    res.json({
      success: true,
      message: 'Login successful. Welcome back!',
      data:    result,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me  [protected]
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id)
    res.json({ success: true, data: { user } })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email)
    // Always respond with success — don't reveal whether email is registered
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password)
    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/change-password  [protected]
export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword)
    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/update-profile  [protected]
export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body)
    res.json({ success: true, message: 'Profile updated.', data: { user } })
  } catch (err) {
    next(err)
  }
}

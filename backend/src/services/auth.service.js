import crypto from 'node:crypto'
import prisma from '../config/database.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import { createError } from '../middleware/errorHandler.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safe user shape — never expose password or reset tokens
 */
const safeUserSelect = {
  id:         true,
  email:      true,
  firstName:  true,
  lastName:   true,
  phone:      true,
  city:       true,
  country:    true,
  bio:        true,
  avatar:     true,
  role:       true,
  preferences: true,
  createdAt:  true,
  updatedAt:  true,
}

// ─── Auth Service ──────────────────────────────────────────────────────────────

/**
 * Create a new user account
 */
export const signup = async ({ email, password, firstName, lastName, phone, city, country }) => {
  // Check for existing email (case-insensitive)
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })
  if (existing) {
    throw createError('An account with this email already exists.', 409)
  }

  const hashed = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email:     email.toLowerCase().trim(),
      password:  hashed,
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      phone:     phone?.trim() || null,
      city:      city?.trim()  || null,
      country:   country?.trim() || null,
    },
    select: safeUserSelect,
  })

  const token = generateToken(user.id)
  return { user, token }
}

/**
 * Authenticate an existing user
 */
export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  // Generic error — don't reveal whether email exists
  if (!user || !(await comparePassword(password, user.password))) {
    throw createError('Invalid email or password.', 401)
  }

  const token = generateToken(user.id)

  // Return safe user (exclude password)
  const { password: _, resetToken: __, resetTokenExpiresAt: ___, ...safeUser } = user
  return { user: safeUser, token }
}

/**
 * Return current authenticated user's profile
 */
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      ...safeUserSelect,
      _count: { select: { trips: true, savedDestinations: true } },
    },
  })
  if (!user) throw createError('User not found.', 404)
  return user
}

/**
 * Generate a password reset token and email it (or log it in dev)
 */
export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  // Always return success — don't reveal whether email is registered
  if (!user) return

  const resetToken   = crypto.randomBytes(32).toString('hex')
  const hashedToken  = crypto.createHash('sha256').update(resetToken).digest('hex')
  const expiresAt    = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data:  { resetToken: hashedToken, resetTokenExpiresAt: expiresAt },
  })

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

  // In development — log to console; in production — send email
  if (process.env.NODE_ENV === 'development') {
    console.log('\n📧 Password Reset')
    console.log(`   User  : ${user.email}`)
    console.log(`   Token : ${resetToken}`)
    console.log(`   URL   : ${resetUrl}\n`)
  }

  // TODO (Phase 12): Send email via Nodemailer
  // await sendPasswordResetEmail(user.email, resetUrl)
  return resetUrl
}

/**
 * Reset a user's password using their valid reset token
 */
export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

  const user = await prisma.user.findFirst({
    where: {
      resetToken:          hashedToken,
      resetTokenExpiresAt: { gt: new Date() },
    },
  })

  if (!user) {
    throw createError('Password reset link is invalid or has expired. Please request a new one.', 400)
  }

  const hashed = await hashPassword(newPassword)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password:            hashed,
      resetToken:          null,
      resetTokenExpiresAt: null,
    },
  })
}

/**
 * Update authenticated user's profile
 */
export const updateProfile = async (userId, data) => {
  const allowed = ['firstName', 'lastName', 'phone', 'city', 'country', 'bio', 'preferences']
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k))
  )

  const user = await prisma.user.update({
    where:  { id: userId },
    data:   filtered,
    select: safeUserSelect,
  })

  return user
}

/**
 * Change authenticated user's password
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw createError('User not found.', 404)

  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch) throw createError('Current password is incorrect.', 400)

  const hashed = await hashPassword(newPassword)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
}

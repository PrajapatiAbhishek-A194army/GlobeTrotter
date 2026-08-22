import jwt from 'jsonwebtoken'
import { createError } from '../middleware/errorHandler.js'

/**
 * Generate a signed JWT for a given userId
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables.')
  }
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * Verify a JWT and return the decoded payload
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw createError('JWT_SECRET is not configured.', 500)
  }
  return jwt.verify(token, process.env.JWT_SECRET)
}

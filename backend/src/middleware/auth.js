import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'
import { createError } from './errorHandler.js'

/**
 * Protect — verifies JWT and attaches user to req.user
 */
export const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('No authentication token provided. Please log in.', 401))
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return next(createError('Authentication token is missing.', 401))
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
      },
    })

    if (!user) {
      return next(createError('User no longer exists. Please sign up again.', 401))
    }

    // Attach to request
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Restrict — limits access to specific roles
 * Usage: router.delete('/...', protect, restrict('ADMIN'), controller)
 */
export const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError('You do not have permission to perform this action.', 403)
      )
    }
    next()
  }
}

/**
 * Optional auth — attaches user if token present but doesn't block
 * Used for public routes that have enhanced behavior when logged in
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      })

      req.user = user || null
    } else {
      req.user = null
    }

    next()
  } catch {
    req.user = null
    next()
  }
}

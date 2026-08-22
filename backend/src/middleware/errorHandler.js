// =============================================
// Global Error Handler Middleware
// =============================================

/**
 * 404 Handler — catches unmatched routes
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  })
}

/**
 * Global Error Handler — catches all errors passed via next(err)
 */
export const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('\n❌ Error:', err.message)
    console.error('Stack:', err.stack)
  }

  // Prisma known request error (e.g., unique constraint, not found)
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
      statusCode: 401,
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please log in again.',
      statusCode: 401,
    })
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.',
      statusCode: 400,
    })
  }

  // Validation errors (express-validator)
  if (err.type === 'validation') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      statusCode: 422,
    })
  }

  // Default — Internal Server Error
  const statusCode = err.statusCode || err.status || 500
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Something went wrong. Please try again later.'
      : err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * Prisma error codes to HTTP responses
 */
function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002':
      return res.status(409).json({
        success: false,
        message: `A record with this ${err.meta?.target?.join(', ')} already exists.`,
        statusCode: 409,
      })
    case 'P2025':
      return res.status(404).json({
        success: false,
        message: 'Record not found.',
        statusCode: 404,
      })
    case 'P2003':
      return res.status(400).json({
        success: false,
        message: 'Foreign key constraint failed.',
        statusCode: 400,
      })
    default:
      return res.status(500).json({
        success: false,
        message: 'Database error occurred.',
        statusCode: 500,
      })
  }
}

/**
 * Helper — create an HTTP error with a status code
 */
export const createError = (message, statusCode = 500) => {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

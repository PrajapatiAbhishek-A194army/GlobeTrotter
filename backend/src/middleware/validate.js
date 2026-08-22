import { validationResult } from 'express-validator'

/**
 * Middleware that reads express-validator results and returns 422 on failure.
 * Place after your validation chain: [validators..., validate, controller]
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors:  errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    })
  }
  next()
}

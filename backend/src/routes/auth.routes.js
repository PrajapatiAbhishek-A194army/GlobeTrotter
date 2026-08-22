import { Router } from 'express'
import { body, param } from 'express-validator'
import * as authController from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── Validation Chains ──────────────────────────────────────────────────────────

const signupValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
  body('firstName')
    .trim().notEmpty().withMessage('First name is required.')
    .isLength({ max: 50 }).withMessage('First name must be under 50 characters.'),
  body('lastName')
    .trim().notEmpty().withMessage('Last name is required.')
    .isLength({ max: 50 }).withMessage('Last name must be under 50 characters.'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .isMobilePhone().withMessage('Please provide a valid phone number.'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
]

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
]

const resetPasswordValidation = [
  param('token').notEmpty().withMessage('Reset token is required.'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number.'),
]

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase, and a number.'),
]

// ── Routes ─────────────────────────────────────────────────────────────────────

// Public
router.post('/signup',          signupValidation,          validate, authController.signup)
router.post('/login',           loginValidation,            validate, authController.login)
router.post('/forgot-password', forgotPasswordValidation,  validate, authController.forgotPassword)
router.patch('/reset-password/:token', resetPasswordValidation, validate, authController.resetPassword)

// Protected
router.get  ('/me',              protect, authController.getMe)
router.patch('/update-profile',  protect, authController.updateProfile)
router.patch('/change-password', protect, changePasswordValidation, validate, authController.changePassword)

export default router

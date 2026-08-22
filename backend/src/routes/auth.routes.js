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

import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Multer — avatar upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `avatar-${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true)
    else cb(new Error('Only image files are allowed.'))
  },
})

import { optionalAuth } from '../middleware/auth.js'

// ── Routes ─────────────────────────────────────────────────────────────────────

// Public
router.post('/signup',          signupValidation,          validate, authController.signup)
router.post('/login',           loginValidation,            validate, authController.login)
router.post('/forgot-password', forgotPasswordValidation,  validate, authController.forgotPassword)
router.patch('/reset-password/:token', resetPasswordValidation, validate, authController.resetPassword)

// OTP Verification (Public / Protected)
router.post('/send-otp',        optionalAuth, authController.sendOtp)
router.post('/verify-otp',      optionalAuth, authController.verifyOtp)

// Protected
router.get  ('/me',              protect, authController.getMe)
router.patch('/update-profile',  protect, upload.single('avatar'), authController.updateProfile)
router.post ('/avatar',          protect, upload.single('avatar'), authController.uploadAvatar)
router.patch('/change-password', protect, authController.changePassword)

export default router

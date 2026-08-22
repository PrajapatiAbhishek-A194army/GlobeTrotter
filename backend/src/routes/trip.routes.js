import { Router } from 'express'
import { body } from 'express-validator'
import * as tripController from '../controllers/trip.controller.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Multer — cover image upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `trip-${unique}${path.extname(file.originalname)}`)
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

const tripValidation = [
  body('title').trim().notEmpty().withMessage('Trip title is required.')
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters.'),
  body('description').optional().isLength({ max: 2000 }),
  body('startDate').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate(),
  body('endDate').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate(),
]

const router = Router()

// All trip routes require authentication
router.use(protect)

// Stats (before /:id to avoid conflict)
router.get('/stats', tripController.getTripStats)

// CRUD
router.get  ('/',    tripController.getTrips)
router.post ('/',    upload.single('coverImage'), tripValidation, validate, tripController.createTrip)
router.get  ('/:id', tripController.getTripById)
router.patch('/:id', upload.single('coverImage'), validate, tripController.updateTrip)
router.delete('/:id', tripController.deleteTrip)

export default router

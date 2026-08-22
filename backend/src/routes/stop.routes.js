import { Router } from 'express'
import { body } from 'express-validator'
import * as stopController from '../controllers/stop.controller.js'
import * as activityController from '../controllers/activity.controller.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router({ mergeParams: true }) // gives access to :tripId

// All routes require auth
router.use(protect)

// Validation
const stopValidation = [
  body('city').trim().notEmpty().withMessage('City is required.').isLength({ max: 100 }),
  body('startDate').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate(),
  body('endDate').optional({ nullable: true, checkFalsy: true }).isISO8601().toDate(),
]

const activityValidation = [
  body('title').trim().notEmpty().withMessage('Activity title is required.').isLength({ max: 150 }),
  body('category').optional().isIn([
    'SIGHTSEEING','ADVENTURE','FOOD_DINING','CULTURE','SHOPPING',
    'TRANSPORT','ACCOMMODATION','ENTERTAINMENT','WELLNESS','NATURE','OTHER',
  ]),
  body('cost').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
  body('duration').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('date').optional({ nullable: true, checkFalsy: true }).isISO8601(),
]

// ── Stop Routes ────────────────────────────────────────────────────────────────
router.get  ('/',          stopController.getStops)
router.post ('/',          stopValidation, validate, stopController.createStop)
router.patch('/reorder',   stopController.reorderStops)       // MUST be before /:id
router.patch('/:id',       stopController.updateStop)
router.delete('/:id',      stopController.deleteStop)

// ── Activity Routes (nested under stop) ────────────────────────────────────────
router.get   ('/:stopId/activities',     activityController.getActivities)
router.post  ('/:stopId/activities',     activityValidation, validate, activityController.createActivity)
router.patch ('/:stopId/activities/:id', activityController.updateActivity)
router.delete('/:stopId/activities/:id', activityController.deleteActivity)

export default router

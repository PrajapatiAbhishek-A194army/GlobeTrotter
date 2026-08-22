import express from 'express'

const router = express.Router()

// ---- API Root ----
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌍 GlobeTrotter API v1.0',
    version: '1.0.0',
    docs: '/api/docs',
    endpoints: {
      auth:         '/api/auth',
      users:        '/api/users',
      trips:        '/api/trips',
      stops:        '/api/stops',
      activities:   '/api/activities',
      budgets:      '/api/budgets',
      destinations: '/api/destinations',
      admin:        '/api/admin',
    },
  })
})

// ---- Route Modules ----
// Phase 3: Authentication
import authRoutes from './auth.routes.js'
router.use('/auth', authRoutes)

// Phase 4: Trips & Destinations
import tripRoutes from './trip.routes.js'
import destinationRoutes from './destination.routes.js'
router.use('/trips',        tripRoutes)
router.use('/destinations', destinationRoutes)

// Phase 6: Itinerary — Stops & Activities (nested under trips)
import stopRoutes from './stop.routes.js'
router.use('/trips/:tripId/stops', stopRoutes)

// Phase 7+8: Budget (nested under trips)
import { Router as BudgetRouter } from 'express'
import * as budgetController from '../controllers/budget.controller.js'
import { protect as budgetProtect } from '../middleware/auth.js'
const budgetRouter = BudgetRouter({ mergeParams: true })
budgetRouter.use(budgetProtect)
budgetRouter.get('/', budgetController.getBudget)
budgetRouter.patch('/', budgetController.updateBudget)
router.use('/trips/:tripId/budget', budgetRouter)

// Phase 11: Admin
import adminRoutes from './admin.routes.js'
router.use('/admin', adminRoutes)

export default router



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

// Phase 4+:
// import userRoutes from './user.routes.js'
// import tripRoutes from './trip.routes.js'
// import stopRoutes from './stop.routes.js'
// import activityRoutes from './activity.routes.js'
// import budgetRoutes from './budget.routes.js'
// import destinationRoutes from './destination.routes.js'
// import adminRoutes from './admin.routes.js'

export default router

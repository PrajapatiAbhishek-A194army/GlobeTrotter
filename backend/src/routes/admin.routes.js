import { Router } from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { protect, restrict } from '../middleware/auth.js'

const router = Router()

// All admin routes require auth + ADMIN role
router.use(protect, restrict('ADMIN'))

// Stats
router.get('/stats', adminController.getStats)

// Users
router.get   ('/users',          adminController.getUsers)
router.patch ('/users/:id/role', adminController.updateUserRole)
router.delete('/users/:id',      adminController.deleteUser)

// Destinations
router.get   ('/destinations',     adminController.getDestinations)
router.post  ('/destinations',     adminController.createDestination)
router.patch ('/destinations/:id', adminController.updateDestination)
router.delete('/destinations/:id', adminController.deleteDestination)

// Trips
router.get   ('/trips',     adminController.getTrips)
router.delete('/trips/:id', adminController.deleteTrip)

export default router

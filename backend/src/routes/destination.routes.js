import { Router } from 'express'
import * as destinationController from '../controllers/destination.controller.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.get ('/',             optionalAuth, destinationController.getDestinations)
router.get ('/continents',  destinationController.getContinents)
router.get ('/:id',          destinationController.getDestinationById)

export default router

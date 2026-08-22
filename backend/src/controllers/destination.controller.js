import * as destinationService from '../services/destination.service.js'

// GET /api/destinations
export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await destinationService.getPopularDestinations(req.query)
    res.json({ success: true, data: { destinations } })
  } catch (err) { next(err) }
}

// GET /api/destinations/continents
export const getContinents = async (req, res, next) => {
  try {
    const continents = await destinationService.getContinents()
    res.json({ success: true, data: { continents } })
  } catch (err) { next(err) }
}

// GET /api/destinations/:id
export const getDestinationById = async (req, res, next) => {
  try {
    const destination = await destinationService.getDestinationById(req.params.id)
    res.json({ success: true, data: { destination } })
  } catch (err) { next(err) }
}

import * as tripService from '../services/trip.service.js'

// GET /api/trips
export const getTrips = async (req, res, next) => {
  try {
    const result = await tripService.getUserTrips(req.user.id, req.query)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

// GET /api/trips/stats
export const getTripStats = async (req, res, next) => {
  try {
    const stats = await tripService.getUserTripStats(req.user.id)
    res.json({ success: true, data: { stats } })
  } catch (err) { next(err) }
}

// GET /api/trips/:id
export const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id)
    res.json({ success: true, data: { trip } })
  } catch (err) { next(err) }
}

// POST /api/trips
export const createTrip = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, isPublic } = req.body
    const trip = await tripService.createTrip(req.user.id, {
      title, description,
      startDate: startDate ? new Date(startDate) : null,
      endDate:   endDate   ? new Date(endDate)   : null,
      isPublic:  !!isPublic,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
    })
    res.status(201).json({ success: true, message: 'Trip created!', data: { trip } })
  } catch (err) { next(err) }
}

// PATCH /api/trips/:id
export const updateTrip = async (req, res, next) => {
  try {
    const allowed = ['title','description','startDate','endDate','status','isPublic']
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.endDate)   data.endDate   = new Date(data.endDate)
    if (req.file) data.coverImage = `/uploads/${req.file.filename}`
    const trip = await tripService.updateTrip(req.params.id, req.user.id, data)
    res.json({ success: true, message: 'Trip updated.', data: { trip } })
  } catch (err) { next(err) }
}

// DELETE /api/trips/:id
export const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id, req.user.id)
    res.json({ success: true, message: 'Trip deleted.' })
  } catch (err) { next(err) }
}

// GET /api/trips/share/:token  (public)
export const getSharedTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getSharedTrip(req.params.token)
    res.json({ success: true, data: { trip } })
  } catch (err) { next(err) }
}

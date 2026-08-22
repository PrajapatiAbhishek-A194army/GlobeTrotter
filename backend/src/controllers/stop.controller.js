import * as stopService from '../services/stop.service.js'

// GET /api/trips/:tripId/stops
export const getStops = async (req, res, next) => {
  try {
    const stops = await stopService.getStopsByTrip(req.params.tripId, req.user.id)
    res.json({ success: true, data: { stops } })
  } catch (err) { next(err) }
}

// POST /api/trips/:tripId/stops
export const createStop = async (req, res, next) => {
  try {
    const { city, country, state, latitude, longitude, notes, startDate, endDate } = req.body
    const stop = await stopService.createStop(req.params.tripId, req.user.id, {
      city,
      country: country || null,
      state:   state   || null,
      latitude:  latitude  ? parseFloat(latitude)  : null,
      longitude: longitude ? parseFloat(longitude) : null,
      notes:     notes     || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate:   endDate   ? new Date(endDate)   : null,
    })
    res.status(201).json({ success: true, message: 'Stop added!', data: { stop } })
  } catch (err) { next(err) }
}

// PATCH /api/trips/:tripId/stops/reorder
export const reorderStops = async (req, res, next) => {
  try {
    const { orderedIds } = req.body // array of stop IDs in new order
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ success: false, message: 'orderedIds must be a non-empty array.' })
    }
    const stops = await stopService.reorderStops(req.params.tripId, req.user.id, orderedIds)
    res.json({ success: true, message: 'Stops reordered.', data: { stops } })
  } catch (err) { next(err) }
}

// PATCH /api/trips/:tripId/stops/:id
export const updateStop = async (req, res, next) => {
  try {
    const allowed = ['city', 'country', 'state', 'latitude', 'longitude', 'notes', 'startDate', 'endDate', 'image']
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.endDate)   data.endDate   = new Date(data.endDate)
    const stop = await stopService.updateStop(req.params.id, req.user.id, data)
    res.json({ success: true, message: 'Stop updated.', data: { stop } })
  } catch (err) { next(err) }
}

// DELETE /api/trips/:tripId/stops/:id
export const deleteStop = async (req, res, next) => {
  try {
    await stopService.deleteStop(req.params.id, req.user.id)
    res.json({ success: true, message: 'Stop deleted.' })
  } catch (err) { next(err) }
}

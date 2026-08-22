import * as adminService from '../services/admin.service.js'

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats()
    res.json({ success: true, data: { stats } })
  } catch (err) { next(err) }
}

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search = '', role = '' } = req.query
    const result = await adminService.getUsers({ page: parseInt(page), limit: parseInt(limit), search, role })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role, req.user.id)
    res.json({ success: true, message: 'Role updated.', data: { user } })
  } catch (err) { next(err) }
}

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id, req.user.id)
    res.json({ success: true, message: 'User deleted.' })
  } catch (err) { next(err) }
}

// GET /api/admin/destinations
export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await adminService.getAllDestinations()
    res.json({ success: true, data: { destinations } })
  } catch (err) { next(err) }
}

// POST /api/admin/destinations
export const createDestination = async (req, res, next) => {
  try {
    const { name, country, continent, description, image, latitude, longitude, costIndex, popularity, tags, climate, bestMonths } = req.body
    const dest = await adminService.createDestination({
      name, country,
      continent:   continent   || null,
      description: description || null,
      image:       image       || null,
      latitude:    latitude    ? parseFloat(latitude)    : null,
      longitude:   longitude   ? parseFloat(longitude)   : null,
      costIndex:   costIndex   ? parseFloat(costIndex)   : null,
      popularity:  popularity  ? parseInt(popularity)    : 0,
      tags:        Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      climate:     climate     || null,
      bestMonths:  Array.isArray(bestMonths) ? bestMonths : (bestMonths ? bestMonths.split(',').map(m => m.trim()) : []),
    })
    res.status(201).json({ success: true, message: 'Destination created.', data: { destination: dest } })
  } catch (err) { next(err) }
}

// PATCH /api/admin/destinations/:id
export const updateDestination = async (req, res, next) => {
  try {
    const allowed = ['name','country','continent','description','image','latitude','longitude','costIndex','popularity','tags','climate','bestMonths']
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))
    if (data.latitude)   data.latitude   = parseFloat(data.latitude)
    if (data.longitude)  data.longitude  = parseFloat(data.longitude)
    if (data.costIndex)  data.costIndex  = parseFloat(data.costIndex)
    if (data.popularity) data.popularity = parseInt(data.popularity)
    if (data.tags && !Array.isArray(data.tags)) data.tags = data.tags.split(',').map(t => t.trim())
    if (data.bestMonths && !Array.isArray(data.bestMonths)) data.bestMonths = data.bestMonths.split(',').map(m => m.trim())

    const dest = await adminService.updateDestination(req.params.id, data)
    res.json({ success: true, message: 'Destination updated.', data: { destination: dest } })
  } catch (err) { next(err) }
}

// DELETE /api/admin/destinations/:id
export const deleteDestination = async (req, res, next) => {
  try {
    await adminService.deleteDestination(req.params.id)
    res.json({ success: true, message: 'Destination deleted.' })
  } catch (err) { next(err) }
}

// GET /api/admin/trips
export const getTrips = async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search = '', status = '' } = req.query
    const result = await adminService.getAllTrips({ page: parseInt(page), limit: parseInt(limit), search, status })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

// DELETE /api/admin/trips/:id
export const deleteTrip = async (req, res, next) => {
  try {
    await adminService.adminDeleteTrip(req.params.id)
    res.json({ success: true, message: 'Trip deleted.' })
  } catch (err) { next(err) }
}

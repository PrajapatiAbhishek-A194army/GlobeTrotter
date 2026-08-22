import * as activityService from '../services/activity.service.js'

// GET /api/trips/:tripId/stops/:stopId/activities
export const getActivities = async (req, res, next) => {
  try {
    const activities = await activityService.getActivities(req.params.stopId, req.user.id)
    res.json({ success: true, data: { activities } })
  } catch (err) { next(err) }
}

// POST /api/trips/:tripId/stops/:stopId/activities
export const createActivity = async (req, res, next) => {
  try {
    const {
      title, description, category, cost, duration,
      date, startTime, endTime, location, address,
      latitude, longitude, image, bookingUrl, notes,
    } = req.body

    const activity = await activityService.createActivity(req.params.stopId, req.user.id, {
      title,
      description: description || null,
      category:    category    || 'OTHER',
      cost:        cost        ? parseFloat(cost) : 0,
      duration:    duration    ? parseInt(duration) : null,
      date:        date        ? new Date(date) : null,
      startTime:   startTime   || null,
      endTime:     endTime     || null,
      location:    location    || null,
      address:     address     || null,
      latitude:    latitude    ? parseFloat(latitude)  : null,
      longitude:   longitude   ? parseFloat(longitude) : null,
      image:       image       || null,
      bookingUrl:  bookingUrl  || null,
      notes:       notes       || null,
    })
    res.status(201).json({ success: true, message: 'Activity added!', data: { activity } })
  } catch (err) { next(err) }
}

// PATCH /api/trips/:tripId/stops/:stopId/activities/:id
export const updateActivity = async (req, res, next) => {
  try {
    const allowed = [
      'title','description','category','cost','duration',
      'date','startTime','endTime','location','address',
      'latitude','longitude','image','bookingUrl','notes',
    ]
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))
    if (data.date)      data.date      = new Date(data.date)
    if (data.cost)      data.cost      = parseFloat(data.cost)
    if (data.duration)  data.duration  = parseInt(data.duration)
    if (data.latitude)  data.latitude  = parseFloat(data.latitude)
    if (data.longitude) data.longitude = parseFloat(data.longitude)

    const activity = await activityService.updateActivity(req.params.id, req.user.id, data)
    res.json({ success: true, message: 'Activity updated.', data: { activity } })
  } catch (err) { next(err) }
}

// DELETE /api/trips/:tripId/stops/:stopId/activities/:id
export const deleteActivity = async (req, res, next) => {
  try {
    await activityService.deleteActivity(req.params.id, req.user.id)
    res.json({ success: true, message: 'Activity deleted.' })
  } catch (err) { next(err) }
}

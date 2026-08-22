import api from './api'

const base = (tripId) => `/trips/${tripId}/stops`

// ── Stops ─────────────────────────────────────────────────────────────────────

export const getStops = async (tripId) => {
  const { data } = await api.get(base(tripId))
  return data.data.stops
}

export const createStop = async (tripId, payload) => {
  const { data } = await api.post(base(tripId), payload)
  return data.data.stop
}

export const updateStop = async (tripId, stopId, payload) => {
  const { data } = await api.patch(`${base(tripId)}/${stopId}`, payload)
  return data.data.stop
}

export const reorderStops = async (tripId, orderedIds) => {
  const { data } = await api.patch(`${base(tripId)}/reorder`, { orderedIds })
  return data.data.stops
}

export const deleteStop = async (tripId, stopId) => {
  await api.delete(`${base(tripId)}/${stopId}`)
}

// ── Activities ────────────────────────────────────────────────────────────────

export const getActivities = async (tripId, stopId) => {
  const { data } = await api.get(`${base(tripId)}/${stopId}/activities`)
  return data.data.activities
}

export const createActivity = async (tripId, stopId, payload) => {
  const { data } = await api.post(`${base(tripId)}/${stopId}/activities`, payload)
  return data.data.activity
}

export const updateActivity = async (tripId, stopId, activityId, payload) => {
  const { data } = await api.patch(`${base(tripId)}/${stopId}/activities/${activityId}`, payload)
  return data.data.activity
}

export const deleteActivity = async (tripId, stopId, activityId) => {
  await api.delete(`${base(tripId)}/${stopId}/activities/${activityId}`)
}

export default {
  getStops, createStop, updateStop, reorderStops, deleteStop,
  getActivities, createActivity, updateActivity, deleteActivity,
}

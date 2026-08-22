import api from './api'

// ── Trip CRUD ──────────────────────────────────────────────────────────────────

export const getTrips = async (params = {}) => {
  const { data } = await api.get('/trips', { params })
  return data.data
}

export const getTripStats = async () => {
  const { data } = await api.get('/trips/stats')
  return data.data.stats
}

export const getTripById = async (id) => {
  const { data } = await api.get(`/trips/${id}`)
  return data.data.trip
}

export const createTrip = async (formData) => {
  const { data } = await api.post('/trips', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data.trip
}

export const updateTrip = async (id, formData) => {
  const { data } = await api.patch(`/trips/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data.trip
}

export const deleteTrip = async (id) => {
  await api.delete(`/trips/${id}`)
}

// ── Public share ───────────────────────────────────────────────────────────────

export const getSharedTrip = async (token) => {
  const { data } = await api.get(`/trips/share/${token}`)
  return data.data.trip
}

export const generateShareToken = async (id) => {
  const { data } = await api.post(`/trips/${id}/share`)
  return data.data.shareToken
}

export default { getTrips, getTripStats, getTripById, createTrip, updateTrip, deleteTrip, getSharedTrip, generateShareToken }

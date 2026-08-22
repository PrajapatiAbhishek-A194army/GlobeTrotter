import api from './api'

const base = '/admin'

export const getStats        = async ()              => { const { data } = await api.get(`${base}/stats`); return data.data.stats }
export const getUsers        = async (params = {})   => { const { data } = await api.get(`${base}/users`, { params }); return data.data }
export const updateUserRole  = async (id, role)      => { const { data } = await api.patch(`${base}/users/${id}/role`, { role }); return data.data.user }
export const deleteUser      = async (id)            => api.delete(`${base}/users/${id}`)
export const getDestinations = async ()              => { const { data } = await api.get(`${base}/destinations`); return data.data.destinations }
export const createDest      = async (payload)       => { const { data } = await api.post(`${base}/destinations`, payload); return data.data.destination }
export const updateDest      = async (id, payload)   => { const { data } = await api.patch(`${base}/destinations/${id}`, payload); return data.data.destination }
export const deleteDest      = async (id)            => api.delete(`${base}/destinations/${id}`)
export const getTrips        = async (params = {})   => { const { data } = await api.get(`${base}/trips`, { params }); return data.data }
export const deleteTrip      = async (id)            => api.delete(`${base}/trips/${id}`)

export default { getStats, getUsers, updateUserRole, deleteUser, getDestinations, createDest, updateDest, deleteDest, getTrips, deleteTrip }

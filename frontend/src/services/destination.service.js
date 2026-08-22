import api from './api'

export const getDestinations = async (params = {}) => {
  const { data } = await api.get('/destinations', { params })
  return data.data.destinations
}

export const getContinents = async () => {
  const { data } = await api.get('/destinations/continents')
  return data.data.continents
}

export const getDestinationById = async (id) => {
  const { data } = await api.get(`/destinations/${id}`)
  return data.data.destination
}

export default { getDestinations, getContinents, getDestinationById }

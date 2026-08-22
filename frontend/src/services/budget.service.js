import api from './api'

const base = (tripId) => `/trips/${tripId}/budget`

export const getBudget = async (tripId) => {
  const { data } = await api.get(base(tripId))
  return data.data.budget
}

export const updateBudget = async (tripId, payload) => {
  const { data } = await api.patch(base(tripId), payload)
  return data.data.budget
}

export default { getBudget, updateBudget }

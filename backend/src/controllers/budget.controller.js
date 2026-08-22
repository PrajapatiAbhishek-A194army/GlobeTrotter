import * as budgetService from '../services/budget.service.js'

// GET /api/trips/:tripId/budget
export const getBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudget(req.params.tripId, req.user.id)
    res.json({ success: true, data: { budget } })
  } catch (err) { next(err) }
}

// PATCH /api/trips/:tripId/budget
export const updateBudget = async (req, res, next) => {
  try {
    const allowed = ['totalBudget', 'transport', 'accommodation', 'meals', 'activities', 'other', 'currency', 'alertThreshold']
    const data = Object.fromEntries(
      Object.entries(req.body)
        .filter(([k]) => allowed.includes(k))
        .map(([k, v]) => [k, k === 'currency' ? v : (v !== '' && v !== null ? parseFloat(v) : 0)])
    )
    // Keep currency as string
    if (req.body.currency) data.currency = req.body.currency

    const budget = await budgetService.updateBudget(req.params.tripId, req.user.id, data)
    res.json({ success: true, message: 'Budget updated.', data: { budget } })
  } catch (err) { next(err) }
}

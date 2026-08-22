import prisma from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

/**
 * Verify trip ownership
 */
const verifyOwner = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } })
  if (!trip) throw createError('Trip not found.', 404)
  return trip
}

/**
 * Get or create budget for a trip
 */
export const getBudget = async (tripId, userId) => {
  await verifyOwner(tripId, userId)

  let budget = await prisma.budget.findUnique({
    where: { tripId },
    include: { trip: { select: { title: true, status: true } } },
  })

  // Auto-create a default budget if none exists
  if (!budget) {
    budget = await prisma.budget.create({
      data: { tripId },
      include: { trip: { select: { title: true, status: true } } },
    })
  }

  // Aggregate actual spending and category breakdown from activities
  const activities = await prisma.activity.findMany({
    where: { stop: { tripId } },
    select: { category: true, cost: true },
  })

  const spendByCategory = {
    transport: 0,
    accommodation: 0,
    meals: 0,
    activities: 0,
    other: 0,
  }

  let totalActualSpend = 0
  activities.forEach(a => {
    const c = a.cost || 0
    totalActualSpend += c
    if (a.category === 'TRANSPORT') spendByCategory.transport += c
    else if (a.category === 'ACCOMMODATION') spendByCategory.accommodation += c
    else if (a.category === 'FOOD_DINING') spendByCategory.meals += c
    else if (['SIGHTSEEING','ADVENTURE','CULTURE','SHOPPING','ENTERTAINMENT','WELLNESS','NATURE'].includes(a.category)) spendByCategory.activities += c
    else spendByCategory.other += c
  })

  return {
    ...budget,
    actualSpend: totalActualSpend,
    remaining: Math.max(0, budget.totalBudget - totalActualSpend),
    spendByCategory,
  }
}

/**
 * Update budget — creates if not exists (upsert)
 */
export const updateBudget = async (tripId, userId, data) => {
  await verifyOwner(tripId, userId)

  const categorySum = (data.transport || 0) + (data.accommodation || 0) + (data.meals || 0) + (data.activities || 0) + (data.other || 0)
  if ((!data.totalBudget || data.totalBudget === 0) && categorySum > 0) {
    data.totalBudget = categorySum
  }

  const budget = await prisma.budget.upsert({
    where: { tripId },
    create: { tripId, ...data },
    update: data,
    include: { trip: { select: { title: true, status: true } } },
  })

  const activities = await prisma.activity.findMany({
    where: { stop: { tripId } },
    select: { category: true, cost: true },
  })

  const spendByCategory = {
    transport: 0,
    accommodation: 0,
    meals: 0,
    activities: 0,
    other: 0,
  }

  let totalActualSpend = 0
  activities.forEach(a => {
    const c = a.cost || 0
    totalActualSpend += c
    if (a.category === 'TRANSPORT') spendByCategory.transport += c
    else if (a.category === 'ACCOMMODATION') spendByCategory.accommodation += c
    else if (a.category === 'FOOD_DINING') spendByCategory.meals += c
    else if (['SIGHTSEEING','ADVENTURE','CULTURE','SHOPPING','ENTERTAINMENT','WELLNESS','NATURE'].includes(a.category)) spendByCategory.activities += c
    else spendByCategory.other += c
  })

  return {
    ...budget,
    actualSpend: totalActualSpend,
    remaining: Math.max(0, budget.totalBudget - totalActualSpend),
    spendByCategory,
  }
}

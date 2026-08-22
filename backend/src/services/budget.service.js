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

  // Aggregate actual spending from activities
  const activitySpend = await prisma.activity.aggregate({
    where: { stop: { tripId } },
    _sum: { cost: true },
  })

  return {
    ...budget,
    actualSpend: activitySpend._sum.cost || 0,
    remaining: budget.totalBudget - (activitySpend._sum.cost || 0),
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

  const activitySpend = await prisma.activity.aggregate({
    where: { stop: { tripId } },
    _sum: { cost: true },
  })

  return {
    ...budget,
    actualSpend: activitySpend._sum.cost || 0,
    remaining: budget.totalBudget - (activitySpend._sum.cost || 0),
  }
}

import prisma from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

/**
 * Verify that a trip belongs to the user — throws 404 if not.
 */
const verifyTripOwner = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } })
  if (!trip) throw createError('Trip not found or access denied.', 404)
  return trip
}

/**
 * Get all stops for a trip (ordered)
 */
export const getStopsByTrip = async (tripId, userId) => {
  await verifyTripOwner(tripId, userId)
  return prisma.stop.findMany({
    where: { tripId },
    orderBy: { order: 'asc' },
    include: {
      activities: {
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      },
    },
  })
}

/**
 * Create a new stop — auto-assigns the next order value
 */
export const createStop = async (tripId, userId, data) => {
  await verifyTripOwner(tripId, userId)

  // Find current max order
  const last = await prisma.stop.findFirst({
    where: { tripId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const order = (last?.order ?? 0) + 1

  return prisma.stop.create({
    data: { ...data, tripId, order },
    include: { activities: true },
  })
}

/**
 * Update a stop (city, dates, notes, etc.)
 */
export const updateStop = async (stopId, userId, data) => {
  // Verify ownership via trip
  const stop = await prisma.stop.findFirst({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  })
  if (!stop || stop.trip.userId !== userId) throw createError('Stop not found.', 404)

  return prisma.stop.update({
    where: { id: stopId },
    data,
    include: { activities: { orderBy: [{ date: 'asc' }, { startTime: 'asc' }] } },
  })
}

/**
 * Bulk reorder stops — receives array of stop IDs in new order
 */
export const reorderStops = async (tripId, userId, orderedIds) => {
  await verifyTripOwner(tripId, userId)

  // Update each stop's order in a transaction
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.stop.update({ where: { id }, data: { order: index + 1 } })
    )
  )

  return getStopsByTrip(tripId, userId)
}

/**
 * Delete a stop (cascades activities via schema)
 */
export const deleteStop = async (stopId, userId) => {
  const stop = await prisma.stop.findFirst({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  })
  if (!stop || stop.trip.userId !== userId) throw createError('Stop not found.', 404)

  await prisma.stop.delete({ where: { id: stopId } })

  // Re-number remaining stops
  const remaining = await prisma.stop.findMany({
    where: { tripId: stop.tripId },
    orderBy: { order: 'asc' },
  })
  await prisma.$transaction(
    remaining.map((s, i) => prisma.stop.update({ where: { id: s.id }, data: { order: i + 1 } }))
  )
}

import prisma from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

/**
 * Verify that a stop belongs to the user (via trip ownership)
 */
const verifyStopOwner = async (stopId, userId) => {
  const stop = await prisma.stop.findFirst({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  })
  if (!stop || stop.trip.userId !== userId) throw createError('Stop not found.', 404)
  return stop
}

/**
 * Get all activities for a stop
 */
export const getActivities = async (stopId, userId) => {
  await verifyStopOwner(stopId, userId)
  return prisma.activity.findMany({
    where: { stopId },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })
}

/**
 * Create an activity under a stop
 */
export const createActivity = async (stopId, userId, data) => {
  await verifyStopOwner(stopId, userId)
  return prisma.activity.create({
    data: { ...data, stopId },
  })
}

/**
 * Update an activity
 */
export const updateActivity = async (activityId, userId, data) => {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
    include: { stop: { include: { trip: { select: { userId: true } } } } },
  })
  if (!activity || activity.stop.trip.userId !== userId)
    throw createError('Activity not found.', 404)

  return prisma.activity.update({
    where: { id: activityId },
    data,
  })
}

/**
 * Delete an activity
 */
export const deleteActivity = async (activityId, userId) => {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
    include: { stop: { include: { trip: { select: { userId: true } } } } },
  })
  if (!activity || activity.stop.trip.userId !== userId)
    throw createError('Activity not found.', 404)

  await prisma.activity.delete({ where: { id: activityId } })
}

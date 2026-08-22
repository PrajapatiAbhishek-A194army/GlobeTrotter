import crypto from 'crypto'
import prisma from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

/**
 * Get all trips for a user, with optional filtering
 */
export const getUserTrips = async (userId, { status, search, limit = 20, page = 1 } = {}) => {
  const skip = (page - 1) * limit

  const where = {
    userId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { stops: { some: { city: { contains: search, mode: 'insensitive' } } } },
      ],
    }),
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy: [{ status: 'asc' }, { startDate: 'asc' }, { createdAt: 'desc' }],
      take: parseInt(limit),
      skip,
      include: {
        stops:  { orderBy: { order: 'asc' }, take: 5 },
        budget: { select: { totalBudget: true, currency: true } },
        _count: { select: { stops: true } },
      },
    }),
    prisma.trip.count({ where }),
  ])

  return { trips, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
}

/**
 * Get trip statistics for dashboard cards
 */
export const getUserTripStats = async (userId) => {
  const [total, upcoming, ongoing, completed] = await Promise.all([
    prisma.trip.count({ where: { userId } }),
    prisma.trip.count({ where: { userId, status: 'UPCOMING' } }),
    prisma.trip.count({ where: { userId, status: 'ONGOING' } }),
    prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
  ])

  // Count unique countries visited
  const stops = await prisma.stop.findMany({
    where: { trip: { userId, status: { in: ['COMPLETED', 'ONGOING'] } } },
    select: { country: true },
    distinct: ['country'],
  })

  // Sum total budget across all trips
  const budgets = await prisma.budget.aggregate({
    where: { trip: { userId } },
    _sum:  { totalBudget: true },
  })

  return {
    total,
    upcoming,
    ongoing,
    completed,
    planning:     total - upcoming - ongoing - completed,
    countries:    stops.filter((s) => s.country).length,
    totalBudget:  budgets._sum.totalBudget || 0,
  }
}

/**
 * Get a single trip by ID (owner check)
 */
export const getTripById = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    include: {
      stops:  {
        orderBy: { order: 'asc' },
        include: {
          activities: { orderBy: { date: 'asc' } },
        },
      },
      budget: true,
    },
  })
  if (!trip) throw createError('Trip not found or access denied.', 404)
  return trip
}

/**
 * Create a new trip
 */
export const createTrip = async (userId, data) => {
  const shareToken = crypto.randomUUID().slice(0, 12)
  const trip = await prisma.trip.create({
    data: { ...data, userId, shareToken },
    include: { stops: true, budget: true },
  })
  return trip
}

/**
 * Generate a share token for an existing trip (if it doesn't have one)
 */
export const generateShareToken = async (tripId, userId) => {
  const trip = await getTripById(tripId, userId)
  if (trip.shareToken) return trip // already has one

  const shareToken = crypto.randomUUID().slice(0, 12)
  return prisma.trip.update({
    where: { id: tripId },
    data: { shareToken },
    include: { stops: true, budget: true },
  })
}

/**
 * Update a trip (owner check)
 */
export const updateTrip = async (tripId, userId, data) => {
  await getTripById(tripId, userId) // ownership check
  return prisma.trip.update({
    where: { id: tripId },
    data,
    include: { stops: true, budget: true },
  })
}

/**
 * Delete a trip (owner check)
 */
export const deleteTrip = async (tripId, userId) => {
  await getTripById(tripId, userId) // ownership check
  await prisma.trip.delete({ where: { id: tripId } })
}

/**
 * Get publicly shared trip by shareToken (no auth needed)
 */
export const getSharedTrip = async (shareToken) => {
  const trip = await prisma.trip.findFirst({
    where: { shareToken, isPublic: true },
    include: {
      user:  { select: { firstName: true, lastName: true, avatar: true } },
      stops: {
        orderBy: { order: 'asc' },
        include: { activities: { orderBy: { date: 'asc' } } },
      },
      budget: true,
    },
  })
  if (!trip) throw createError('Shared trip not found or is no longer public.', 404)
  return trip
}

/**
 * List all public trips (community page, no auth needed)
 */
export const getPublicTrips = async ({ page = 1, limit = 12, search = '', status = '' } = {}) => {
  const skip = (page - 1) * limit
  const where = {
    isPublic: true,
    shareToken: { not: null },
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { stops: { some: { city: { contains: search, mode: 'insensitive' } } } },
      ],
    }),
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip,
      include: {
        user:   { select: { firstName: true, lastName: true, avatar: true } },
        stops:  { orderBy: { order: 'asc' }, take: 5, select: { city: true, country: true } },
        _count: { select: { stops: true } },
        budget: { select: { totalBudget: true, currency: true } },
      },
    }),
    prisma.trip.count({ where }),
  ])

  return { trips, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
}

/**
 * Clone a public trip into a user's account
 */
export const cloneTrip = async (tripId, userId) => {
  // Fetch the source trip (must be public)
  const source = await prisma.trip.findFirst({
    where: { id: tripId, isPublic: true },
    include: {
      stops: {
        orderBy: { order: 'asc' },
        include: { activities: true },
      },
    },
  })
  if (!source) throw createError('Trip not found or is not public.', 404)

  const shareToken = crypto.randomUUID().slice(0, 12)

  // Create the cloned trip
  const cloned = await prisma.trip.create({
    data: {
      title:       `${source.title} (copy)`,
      description: source.description,
      status:      'PLANNING',
      isPublic:    false,
      shareToken,
      userId,
      stops: {
        create: source.stops.map((stop) => ({
          order:     stop.order,
          city:      stop.city,
          country:   stop.country,
          state:     stop.state,
          latitude:  stop.latitude,
          longitude: stop.longitude,
          image:     stop.image,
          notes:     stop.notes,
          activities: {
            create: stop.activities.map((act) => ({
              title:     act.title,
              category:  act.category,
              cost:      act.cost,
              duration:  act.duration,
              startTime: act.startTime,
              endTime:   act.endTime,
              location:  act.location,
              notes:     act.notes,
            })),
          },
        })),
      },
    },
    include: { stops: true },
  })

  return cloned
}

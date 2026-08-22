import prisma from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'
import { hashPassword } from '../utils/password.js'

// ── Platform Stats & Analytics ───────────────────────────────────────────────
export const getPlatformStats = async () => {
  const [
    totalUsers,
    totalTrips,
    totalStops,
    totalActivities,
    totalDestinations,
    tripsByStatus,
    newUsersThisWeek,
    newUsersThisMonth,
    topStopsByCity,
    activitiesByCategory,
    budgetAgg,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.stop.count(),
    prisma.activity.count(),
    prisma.destination.count(),
    prisma.trip.groupBy({ by: ['status'], _count: true }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.stop.groupBy({
      by: ['city'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8,
    }),
    prisma.activity.groupBy({
      by: ['category'],
      _count: { id: true },
      _sum: { cost: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.budget.aggregate({
      _sum: { totalBudget: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: { select: { trips: true } },
      },
    }),
  ])

  const statusMap = Object.fromEntries(tripsByStatus.map(({ status, _count }) => [status, _count]))

  const topCities = topStopsByCity
    .filter(s => s.city)
    .map(s => ({
      city: s.city,
      stopsCount: s._count.id,
    }))

  const categoriesBreakdown = activitiesByCategory.map(cat => ({
    category: cat.category,
    count: cat._count.id,
    totalCost: cat._sum.cost || 0,
  }))

  const avgTripsPerUser = totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : 0

  return {
    users: {
      total: totalUsers,
      newThisWeek: newUsersThisWeek,
      newThisMonth: newUsersThisMonth,
      avgTripsPerUser,
    },
    trips: {
      total: totalTrips,
      byStatus: statusMap,
    },
    stops: totalStops,
    activities: totalActivities,
    destinations: totalDestinations,
    totalBudgetTracked: budgetAgg._sum.totalBudget || 0,
    topCities,
    categoriesBreakdown,
    recentUsers,
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async ({ page = 1, limit = 20, search = '', role = '' }) => {
  const where = {
    ...(search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { email:     { contains: search, mode: 'insensitive' } },
      ],
    } : {}),
    ...(role ? { role } : {}),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, city: true, country: true, avatar: true,
        createdAt: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, page, limit, pages: Math.ceil(total / limit) }
}

export const updateUserRole = async (userId, role, adminId) => {
  if (userId === adminId) throw createError("You cannot change your own role.", 400)
  if (!['USER', 'ADMIN'].includes(role)) throw createError('Invalid role.', 400)
  return prisma.user.update({
    where: { id: userId },
    data:  { role },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  })
}

export const deleteUser = async (userId, adminId) => {
  if (userId === adminId) throw createError("You cannot delete your own account here.", 400)
  await prisma.user.delete({ where: { id: userId } })
}

// ── Destinations ───────────────────────────────────────────────────────────────
export const getAllDestinations = async () => {
  return prisma.destination.findMany({ orderBy: { popularity: 'desc' } })
}

export const createDestination = async (data) => {
  return prisma.destination.create({ data })
}

export const updateDestination = async (id, data) => {
  return prisma.destination.update({ where: { id }, data })
}

export const deleteDestination = async (id) => {
  await prisma.destination.delete({ where: { id } })
}

// ── All Trips (admin view) ─────────────────────────────────────────────────────
export const getAllTrips = async ({ page = 1, limit = 20, search = '', status = '' }) => {
  const where = {
    ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
    ...(status ? { status } : {}),
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        _count: { select: { stops: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.trip.count({ where }),
  ])

  return { trips, total, page, limit, pages: Math.ceil(total / limit) }
}

export const adminDeleteTrip = async (tripId) => {
  await prisma.trip.delete({ where: { id: tripId } })
}

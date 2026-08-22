import prisma from '../config/database.js'

/**
 * Get popular destinations (sorted by popularity)
 */
export const getPopularDestinations = async ({ limit = 12, continent, search } = {}) => {
  const where = {
    ...(continent && { continent }),
    ...(search && {
      OR: [
        { name:    { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { tags:    { hasSome: [search] } },
      ],
    }),
  }

  return prisma.destination.findMany({
    where,
    orderBy: { popularity: 'desc' },
    take:    parseInt(limit),
  })
}

/**
 * Get a single destination by ID
 */
export const getDestinationById = async (id) => {
  const dest = await prisma.destination.findUnique({ where: { id } })
  if (!dest) throw new Error('Destination not found')
  return dest
}

/**
 * Get all unique continents for filter dropdown
 */
export const getContinents = async () => {
  const results = await prisma.destination.findMany({
    select:   { continent: true },
    distinct: ['continent'],
    where:    { continent: { not: null } },
    orderBy:  { continent: 'asc' },
  })
  return results.map((r) => r.continent)
}

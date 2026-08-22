import { PrismaClient } from '@prisma/client'

// Singleton pattern — prevent multiple Prisma instances in development
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown — disconnect Prisma on process exit
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma

// =============================================================
// Prisma Seed File — Sample data for development
// Run: npm run db:seed
// =============================================================
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ---- Seed Destinations ----
  const destinations = [
    {
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      description: 'The City of Light — romance, art, and world-class cuisine.',
      image: 'https://images.unsplash.com/photo-1499856374870-7743d2d7b85f?w=800',
      latitude: 48.8566,
      longitude: 2.3522,
      costIndex: 7.5,
      popularity: 98,
      tags: ['romance', 'culture', 'art', 'food', 'fashion'],
      climate: 'Temperate',
      bestMonths: ['April', 'May', 'September', 'October'],
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      description: 'Where ancient tradition meets cutting-edge modernity.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      latitude: 35.6762,
      longitude: 139.6503,
      costIndex: 6.5,
      popularity: 96,
      tags: ['technology', 'food', 'culture', 'anime', 'temples'],
      climate: 'Humid subtropical',
      bestMonths: ['March', 'April', 'October', 'November'],
    },
    {
      name: 'New York',
      country: 'USA',
      continent: 'North America',
      description: 'The city that never sleeps — iconic skyline and endless energy.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      latitude: 40.7128,
      longitude: -74.0060,
      costIndex: 8.5,
      popularity: 97,
      tags: ['urban', 'culture', 'food', 'nightlife', 'shopping'],
      climate: 'Humid continental',
      bestMonths: ['April', 'May', 'September', 'October'],
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      description: 'Island of the Gods — spiritual retreats, rice terraces, and surf.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      latitude: -8.3405,
      longitude: 115.0920,
      costIndex: 3.5,
      popularity: 92,
      tags: ['beach', 'spirituality', 'nature', 'culture', 'wellness'],
      climate: 'Tropical',
      bestMonths: ['April', 'May', 'June', 'September'],
    },
    {
      name: 'Rome',
      country: 'Italy',
      continent: 'Europe',
      description: 'The Eternal City — millennia of history, art, and pasta.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      latitude: 41.9028,
      longitude: 12.4964,
      costIndex: 6.0,
      popularity: 94,
      tags: ['history', 'architecture', 'food', 'art', 'culture'],
      climate: 'Mediterranean',
      bestMonths: ['April', 'May', 'October', 'November'],
    },
    {
      name: 'Dubai',
      country: 'UAE',
      continent: 'Asia',
      description: 'Where luxury meets desert — futuristic skyline and golden sands.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      latitude: 25.2048,
      longitude: 55.2708,
      costIndex: 8.0,
      popularity: 90,
      tags: ['luxury', 'shopping', 'desert', 'architecture', 'nightlife'],
      climate: 'Desert',
      bestMonths: ['November', 'December', 'January', 'February', 'March'],
    },
  ]

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { id: dest.name.toLowerCase().replace(/ /g, '-') },
      update: dest,
      create: { id: dest.name.toLowerCase().replace(/ /g, '-'), ...dest },
    })
  }

  // ---- Seed Demo Admin User ----
  const hashedPassword = await bcrypt.hash('Admin@123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@globetrotter.app' },
    update: {},
    create: {
      email: 'admin@globetrotter.app',
      password: hashedPassword,
      firstName: 'Globe',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('   Admin: admin@globetrotter.app / Admin@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

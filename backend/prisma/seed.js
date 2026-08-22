// =============================================================
// Prisma Seed File — Rich demo data for GlobeTrotter
// Run: npm run db:seed
// =============================================================
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ── Helpers ───────────────────────────────────────────────────
const hash = (pw) => bcrypt.hash(pw, 10)
const d    = (str) => new Date(str)

async function main() {
  console.log('🌱 Seeding database…')

  // ── 1. DESTINATIONS ──────────────────────────────────────────
  const destinationData = [
    { id: 'paris',        name: 'Paris',         country: 'France',      continent: 'Europe',        description: 'The City of Light — romance, art, and world-class cuisine.',          image: 'https://images.unsplash.com/photo-1499856374870-7743d2d7b85f?w=800',  latitude: 48.8566,  longitude: 2.3522,    costIndex: 7.5, popularity: 98, tags: ['romance','culture','art','food','fashion'],        climate: 'Temperate',           bestMonths: ['April','May','September','October'] },
    { id: 'tokyo',        name: 'Tokyo',          country: 'Japan',       continent: 'Asia',          description: 'Where ancient tradition meets cutting-edge modernity.',               image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',  latitude: 35.6762,  longitude: 139.6503,  costIndex: 6.5, popularity: 96, tags: ['technology','food','culture','anime','temples'],    climate: 'Humid subtropical',   bestMonths: ['March','April','October','November'] },
    { id: 'new-york',     name: 'New York',       country: 'USA',         continent: 'North America', description: 'The city that never sleeps — iconic skyline and endless energy.',     image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',  latitude: 40.7128,  longitude: -74.006,   costIndex: 8.5, popularity: 97, tags: ['urban','culture','food','nightlife','shopping'],    climate: 'Humid continental',   bestMonths: ['April','May','September','October'] },
    { id: 'bali',         name: 'Bali',           country: 'Indonesia',   continent: 'Asia',          description: 'Island of the Gods — spiritual retreats, rice terraces, and surf.',  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',  latitude: -8.3405,  longitude: 115.092,   costIndex: 3.5, popularity: 92, tags: ['beach','spirituality','nature','culture','wellness'], climate: 'Tropical',            bestMonths: ['April','May','June','September'] },
    { id: 'rome',         name: 'Rome',           country: 'Italy',       continent: 'Europe',        description: 'The Eternal City — millennia of history, art, and pasta.',           image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',  latitude: 41.9028,  longitude: 12.4964,   costIndex: 6.0, popularity: 94, tags: ['history','architecture','food','art','culture'],    climate: 'Mediterranean',       bestMonths: ['April','May','October','November'] },
    { id: 'dubai',        name: 'Dubai',          country: 'UAE',         continent: 'Asia',          description: 'Where luxury meets desert — futuristic skyline and golden sands.',   image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',  latitude: 25.2048,  longitude: 55.2708,   costIndex: 8.0, popularity: 90, tags: ['luxury','shopping','desert','architecture','nightlife'], climate: 'Desert',            bestMonths: ['November','December','January','February','March'] },
    { id: 'barcelona',    name: 'Barcelona',      country: 'Spain',       continent: 'Europe',        description: 'Gaudí, tapas, beaches — a vibrant Mediterranean gem.',                image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',  latitude: 41.3851,  longitude: 2.1734,    costIndex: 5.5, popularity: 91, tags: ['beach','architecture','nightlife','food','culture'],  climate: 'Mediterranean',       bestMonths: ['May','June','September','October'] },
    { id: 'sydney',       name: 'Sydney',         country: 'Australia',   continent: 'Oceania',       description: 'Harbour City — iconic Opera House, Bondi Beach, and café culture.',  image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',  latitude: -33.8688, longitude: 151.2093,  costIndex: 7.0, popularity: 88, tags: ['beach','culture','outdoor','food','wildlife'],      climate: 'Temperate oceanic',   bestMonths: ['October','November','February','March'] },
    { id: 'cape-town',    name: 'Cape Town',      country: 'South Africa',continent: 'Africa',        description: 'Dramatic mountains, crystal waters, and fine wines.',                 image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',  latitude: -33.9249, longitude: 18.4241,   costIndex: 4.0, popularity: 85, tags: ['nature','beach','wine','adventure','wildlife'],      climate: 'Mediterranean',       bestMonths: ['November','December','January','February','March'] },
    { id: 'amsterdam',    name: 'Amsterdam',      country: 'Netherlands', continent: 'Europe',        description: 'Canals, tulips, world-class museums, and cycling culture.',           image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',  latitude: 52.3676,  longitude: 4.9041,    costIndex: 7.0, popularity: 87, tags: ['culture','museums','cycling','canals','nightlife'],   climate: 'Temperate maritime',  bestMonths: ['April','May','June','September'] },
    { id: 'bangkok',      name: 'Bangkok',        country: 'Thailand',    continent: 'Asia',          description: 'Temples, street food, and electrifying nightlife in one megacity.',  image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',  latitude: 13.7563,  longitude: 100.5018,  costIndex: 3.0, popularity: 93, tags: ['temples','street food','nightlife','shopping','culture'], climate: 'Tropical',          bestMonths: ['November','December','January','February'] },
    { id: 'new-zealand',  name: 'Queenstown',     country: 'New Zealand', continent: 'Oceania',       description: 'Adventure capital of the world — bungee, skiing, and fjords.',        image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',  latitude: -45.0312, longitude: 168.6626,  costIndex: 6.5, popularity: 82, tags: ['adventure','skiing','nature','hiking','scenic'],      climate: 'Temperate oceanic',   bestMonths: ['December','January','February','March'] },
    { id: 'santorini',    name: 'Santorini',      country: 'Greece',      continent: 'Europe',        description: 'Iconic whitewashed villages, volcanic beaches, and sunset views.',    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',  latitude: 36.3932,  longitude: 25.4615,   costIndex: 7.0, popularity: 89, tags: ['romance','beach','scenery','food','culture'],         climate: 'Mediterranean',       bestMonths: ['May','June','September','October'] },
    { id: 'machu-picchu', name: 'Machu Picchu',   country: 'Peru',        continent: 'South America', description: 'The Lost City of the Incas — a bucket-list wonder above the clouds.',  image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',  latitude: -13.1631, longitude: -72.545,   costIndex: 4.5, popularity: 91, tags: ['history','hiking','UNESCO','adventure','nature'],     climate: 'Highland tropical',   bestMonths: ['May','June','July','August','September'] },
    { id: 'maldives',     name: 'Maldives',       country: 'Maldives',    continent: 'Asia',          description: 'Crystal turquoise waters, overwater bungalows, and coral reefs.',     image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',  latitude: 3.2028,   longitude: 73.2207,   costIndex: 9.5, popularity: 88, tags: ['luxury','beach','diving','romance','wildlife'],       climate: 'Tropical',            bestMonths: ['November','December','January','February','March'] },
    { id: 'istanbul',     name: 'Istanbul',       country: 'Turkey',      continent: 'Europe',        description: 'Where Europe meets Asia — mosques, bazaars, and the Bosphorus.',      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800',  latitude: 41.0082,  longitude: 28.9784,   costIndex: 4.5, popularity: 86, tags: ['history','culture','food','bazaar','architecture'],   climate: 'Mediterranean',       bestMonths: ['April','May','September','October'] },
    { id: 'rio',          name: 'Rio de Janeiro', country: 'Brazil',      continent: 'South America', description: 'Carnival city — beaches, samba, Christ the Redeemer, and rainforest.',image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',  latitude: -22.9068, longitude: -43.1729,  costIndex: 5.0, popularity: 84, tags: ['beach','carnival','culture','nature','music'],        climate: 'Tropical',            bestMonths: ['September','October','November','December'] },
    { id: 'prague',       name: 'Prague',         country: 'Czech Republic', continent: 'Europe',     description: 'Fairytale medieval city — cobblestones, castles, and craft beer.',     image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',  latitude: 50.0755,  longitude: 14.4378,   costIndex: 4.5, popularity: 83, tags: ['history','architecture','beer','culture','nightlife'], climate: 'Temperate continental', bestMonths: ['April','May','June','September','October'] },
    { id: 'kyoto',        name: 'Kyoto',          country: 'Japan',       continent: 'Asia',          description: 'Japan\'s spiritual heart — geisha districts, temples, and sakura.',    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',  latitude: 35.0116,  longitude: 135.7681,  costIndex: 5.5, popularity: 90, tags: ['temples','culture','food','nature','history'],       climate: 'Humid subtropical',   bestMonths: ['March','April','November'] },
    { id: 'singapore',    name: 'Singapore',      country: 'Singapore',   continent: 'Asia',          description: 'Garden city — stunning architecture, hawker food, and efficiency.',    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',  latitude: 1.3521,   longitude: 103.8198,  costIndex: 7.5, popularity: 89, tags: ['food','shopping','architecture','culture','luxury'],  climate: 'Tropical',            bestMonths: ['February','March','April','July','August'] },
    { id: 'ahmedabad',    name: 'Ahmedabad',      country: 'India',       continent: 'Asia',          description: 'India\'s first UNESCO World Heritage City — Sabarmati Ashram, intricate stepwells, vibrant night markets, and heritage architecture.', image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800', latitude: 23.0225, longitude: 72.5714, costIndex: 2.5, popularity: 95, tags: ['heritage','food','culture','history','unesco','ahemedabad','amdavad','gujarat','sabarmati'], climate: 'Semi-arid', bestMonths: ['October','November','December','January','February','March'] },
    { id: 'mumbai',       name: 'Mumbai',         country: 'India',       continent: 'Asia',          description: 'City of Dreams — Gateway of India, Marine Drive, Bollywood, and iconic colonial architecture.', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800', latitude: 19.0760, longitude: 72.8777, costIndex: 4.5, popularity: 94, tags: ['urban','nightlife','food','culture','heritage','bombay'], climate: 'Tropical wet & dry', bestMonths: ['November','December','January','February'] },
    { id: 'delhi',        name: 'Delhi',          country: 'India',       continent: 'Asia',          description: 'Historic capital — Red Fort, Qutub Minar, Chandni Chowk street food, and vibrant bazaars.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', latitude: 28.7041, longitude: 77.1025, costIndex: 3.5, popularity: 93, tags: ['history','monuments','food','culture','shopping'], climate: 'Semi-arid', bestMonths: ['October','November','December','January','February','March'] },
    { id: 'jaipur',       name: 'Jaipur',         country: 'India',       continent: 'Asia',          description: 'The Pink City — Hawa Mahal, majestic Amber Fort, royal palaces, and Rajasthani handicrafts.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', latitude: 26.9124, longitude: 75.7873, costIndex: 3.0, popularity: 92, tags: ['palaces','forts','heritage','culture','shopping','pink city'], climate: 'Semi-arid', bestMonths: ['October','November','December','January','February','March'] },
    { id: 'goa',          name: 'Goa',            country: 'India',       continent: 'Asia',          description: 'Sun, sand & sea — golden beaches, Portuguese churches, water sports, and beachside nightlife.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', latitude: 15.2993, longitude: 74.1240, costIndex: 4.0, popularity: 91, tags: ['beach','nightlife','water sports','seafood','relaxation'], climate: 'Tropical monsoon', bestMonths: ['November','December','January','February'] },
  ]

  for (const dest of destinationData) {
    await prisma.destination.upsert({
      where:  { id: dest.id },
      update: dest,
      create: dest,
    })
  }
  console.log(`  ✅ ${destinationData.length} destinations seeded`)

  // ── 2. USERS ─────────────────────────────────────────────────
  const pw = await hash('Travel@123')
  const adminPw = await hash('Admin@123')

  const usersData = [
    {
      id: 'user-admin',
      email: 'admin@globetrotter.app', password: adminPw,
      firstName: 'Globe', lastName: 'Admin', role: 'ADMIN',
      city: 'San Francisco', country: 'United States',
      bio: 'Platform administrator keeping GlobeTrotter running smoothly.',
    },
    {
      id: 'user-priya',
      email: 'priya.sharma@demo.com', password: pw,
      firstName: 'Priya', lastName: 'Sharma',
      city: 'Mumbai', country: 'India',
      bio: 'Solo traveller & street food enthusiast. 30 countries and counting! 🌏',
      phone: '+91 98765 43210',
    },
    {
      id: 'user-james',
      email: 'james.walker@demo.com', password: pw,
      firstName: 'James', lastName: 'Walker',
      city: 'London', country: 'United Kingdom',
      bio: 'Photography + travel = life. Chasing golden hour in every timezone.',
      phone: '+44 7911 123456',
    },
    {
      id: 'user-sofia',
      email: 'sofia.reyes@demo.com', password: pw,
      firstName: 'Sofia', lastName: 'Reyes',
      city: 'Mexico City', country: 'Mexico',
      bio: 'Foodie first, traveller second. Instagram: @sofiaeats_theworld',
      phone: '+52 55 1234 5678',
    },
    {
      id: 'user-alex',
      email: 'alex.chen@demo.com', password: pw,
      firstName: 'Alex', lastName: 'Chen',
      city: 'Singapore', country: 'Singapore',
      bio: 'Weekend warrior. Backpacking Southeast Asia one island at a time.',
      phone: '+65 9123 4567',
    },
    {
      id: 'user-amara',
      email: 'amara.osei@demo.com', password: pw,
      firstName: 'Amara', lastName: 'Osei',
      city: 'Accra', country: 'Ghana',
      bio: 'Exploring Africa and beyond. Proud ambassador of African travel.',
      phone: '+233 24 123 4567',
    },
  ]

  for (const u of usersData) {
    await prisma.user.upsert({
      where:  { email: u.email },
      update: { firstName: u.firstName, lastName: u.lastName, city: u.city, country: u.country, bio: u.bio },
      create: u,
    })
  }
  console.log(`  ✅ ${usersData.length} users seeded`)

  // ── 3. TRIPS, STOPS & ACTIVITIES ─────────────────────────────

  // Helper: upsert a trip + stops + activities
  async function seedTrip({ id, userId, title, description, status, startDate, endDate, isPublic, shareToken, coverImage, stops }) {
    const trip = await prisma.trip.upsert({
      where:  { id },
      update: { title, description, status, startDate, endDate, isPublic, coverImage },
      create: { id, userId, title, description, status, startDate, endDate, isPublic, shareToken, coverImage },
    })

    // Upsert stops
    for (const [si, stop] of stops.entries()) {
      const { activities: acts, ...stopFields } = stop
      const upsertedStop = await prisma.stop.upsert({
        where:  { id: stop.id },
        update: stopFields,
        create: { ...stopFields, tripId: trip.id, order: si + 1 },
      })

      // Upsert activities
      for (const [ai, act] of (acts || []).entries()) {
        await prisma.activity.upsert({
          where:  { id: act.id },
          update: act,
          create: { ...act, stopId: upsertedStop.id },
        })
      }
    }

    // Upsert budget
    if (stops.length > 0) {
      await prisma.budget.upsert({
        where:  { tripId: trip.id },
        update: {},
        create: {
          tripId: trip.id,
          totalBudget:   Math.floor(Math.random() * 4000) + 1000,
          transport:     Math.floor(Math.random() * 800)  + 200,
          accommodation: Math.floor(Math.random() * 1200) + 400,
          meals:         Math.floor(Math.random() * 600)  + 150,
          activities:    Math.floor(Math.random() * 500)  + 100,
          currency:      'USD',
        },
      })
    }
  }

  // ─── Priya's European Dream ───────────────────────────────────
  await seedTrip({
    id: 'trip-priya-europe',
    userId: 'user-priya',
    title: 'European Dream 🇪🇺',
    description: 'A 14-day whirlwind through the best cities in Western Europe.',
    status: 'COMPLETED',
    startDate: d('2026-04-10'),
    endDate:   d('2026-04-24'),
    isPublic: true,
    shareToken: 'priya-europe-share',
    coverImage: 'https://images.unsplash.com/photo-1499856374870-7743d2d7b85f?w=1200',
    stops: [
      {
        id: 'stop-pe-paris', city: 'Paris', country: 'France', order: 1,
        startDate: d('2026-04-10'), endDate: d('2026-04-14'),
        notes: 'Stay at Hotel des Arts near Montmartre. Metro pass recommended.',
        activities: [
          { id: 'act-pe-1', title: 'Eiffel Tower visit', category: 'SIGHTSEEING', date: d('2026-04-10'), startTime: '09:00', endTime: '11:30', cost: 28.30, location: 'Champ de Mars', notes: 'Book tickets in advance!' },
          { id: 'act-pe-2', title: 'Louvre Museum', category: 'CULTURE', date: d('2026-04-11'), startTime: '10:00', endTime: '14:00', cost: 17, location: 'Rue de Rivoli', duration: 240 },
          { id: 'act-pe-3', title: 'Seine River Cruise', category: 'ENTERTAINMENT', date: d('2026-04-11'), startTime: '19:00', endTime: '20:30', cost: 15, location: 'Pont de l\'Alma' },
          { id: 'act-pe-4', title: 'Croissants at Du Pain et des Idées', category: 'FOOD_DINING', date: d('2026-04-12'), startTime: '08:00', endTime: '09:00', cost: 8, location: '34 Rue Yves Toudic' },
          { id: 'act-pe-5', title: 'Sacré-Cœur & Montmartre walk', category: 'SIGHTSEEING', date: d('2026-04-12'), startTime: '10:00', endTime: '13:00', cost: 0, location: 'Montmartre' },
          { id: 'act-pe-6', title: 'Moulin Rouge dinner show', category: 'ENTERTAINMENT', date: d('2026-04-13'), startTime: '19:00', endTime: '23:00', cost: 185, location: '82 Bd de Clichy', notes: 'Dress code: smart casual' },
        ],
      },
      {
        id: 'stop-pe-rome', city: 'Rome', country: 'Italy', order: 2,
        startDate: d('2026-04-14'), endDate: d('2026-04-18'),
        notes: 'AirBnB in Trastevere — walking distance to most sights.',
        activities: [
          { id: 'act-pe-7',  title: 'Colosseum & Roman Forum', category: 'SIGHTSEEING', date: d('2026-04-14'), startTime: '09:00', endTime: '12:30', cost: 16, location: 'Piazza del Colosseo', notes: 'Pre-book skip-the-line tickets' },
          { id: 'act-pe-8',  title: 'Cacio e Pepe at Tonnarello', category: 'FOOD_DINING', date: d('2026-04-14'), startTime: '13:00', endTime: '14:30', cost: 22, location: 'Via della Paglia, Trastevere' },
          { id: 'act-pe-9',  title: 'Vatican Museums & Sistine Chapel', category: 'CULTURE', date: d('2026-04-15'), startTime: '08:00', endTime: '13:00', cost: 27, location: 'Viale Vaticano', duration: 300 },
          { id: 'act-pe-10', title: 'Trevi Fountain & Spanish Steps', category: 'SIGHTSEEING', date: d('2026-04-16'), startTime: '18:00', endTime: '20:00', cost: 0, location: 'Piazza di Trevi' },
          { id: 'act-pe-11', title: 'Cooking class — fresh pasta', category: 'FOOD_DINING', date: d('2026-04-17'), startTime: '10:00', endTime: '13:00', cost: 75, location: 'Via dei Coronari 181', duration: 180 },
        ],
      },
      {
        id: 'stop-pe-barcelona', city: 'Barcelona', country: 'Spain', order: 3,
        startDate: d('2026-04-18'), endDate: d('2026-04-24'),
        notes: 'Hotel near La Rambla — Passeig de Gràcia is 10 min walk.',
        activities: [
          { id: 'act-pe-12', title: 'Sagrada Família', category: 'SIGHTSEEING', date: d('2026-04-18'), startTime: '10:00', endTime: '12:30', cost: 26, location: 'Carrer de Mallorca', notes: 'Tower access recommended' },
          { id: 'act-pe-13', title: 'La Boqueria Market tapas', category: 'FOOD_DINING', date: d('2026-04-19'), startTime: '11:00', endTime: '13:00', cost: 20, location: 'La Rambla, 91' },
          { id: 'act-pe-14', title: 'Park Güell', category: 'SIGHTSEEING', date: d('2026-04-20'), startTime: '08:00', endTime: '10:30', cost: 10, location: 'Carrer d\'Olot' },
          { id: 'act-pe-15', title: 'Barceloneta Beach sunset', category: 'NATURE', date: d('2026-04-21'), startTime: '17:00', endTime: '20:00', cost: 0, location: 'Barceloneta' },
          { id: 'act-pe-16', title: 'Flamenco show at Tablao Cordobés', category: 'CULTURE', date: d('2026-04-22'), startTime: '20:00', endTime: '22:00', cost: 49, location: 'La Rambla, 35' },
        ],
      },
    ],
  })

  // ─── James's Japan Photography Tour ──────────────────────────
  await seedTrip({
    id: 'trip-james-japan',
    userId: 'user-james',
    title: 'Japan Through a Lens 📷',
    description: 'Chasing cherry blossoms, neon lights, and ancient temples.',
    status: 'UPCOMING',
    startDate: d('2026-10-15'),
    endDate:   d('2026-10-28'),
    isPublic: true,
    shareToken: 'james-japan-share',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    stops: [
      {
        id: 'stop-jj-tokyo', city: 'Tokyo', country: 'Japan', order: 1,
        startDate: d('2026-10-15'), endDate: d('2026-10-20'),
        notes: 'Capsule hotel in Shinjuku for the full Tokyo experience.',
        activities: [
          { id: 'act-jj-1', title: 'Shibuya Crossing at rush hour', category: 'SIGHTSEEING', date: d('2026-10-15'), startTime: '18:00', endTime: '19:30', cost: 0, location: 'Shibuya' },
          { id: 'act-jj-2', title: 'Tsukiji outer market breakfast', category: 'FOOD_DINING', date: d('2026-10-16'), startTime: '07:00', endTime: '09:00', cost: 25, location: 'Tsukiji' },
          { id: 'act-jj-3', title: 'teamLab Borderless (digital art)', category: 'CULTURE', date: d('2026-10-16'), startTime: '10:00', endTime: '13:00', cost: 32, location: 'Odaiba', duration: 180 },
          { id: 'act-jj-4', title: 'Harajuku & Takeshita Street', category: 'SHOPPING', date: d('2026-10-17'), startTime: '11:00', endTime: '14:00', cost: 50, location: 'Harajuku' },
          { id: 'act-jj-5', title: 'Senso-ji Temple golden hour shoot', category: 'SIGHTSEEING', date: d('2026-10-18'), startTime: '06:00', endTime: '08:00', cost: 0, location: 'Asakusa', notes: 'Best light is 30 mins after sunrise' },
          { id: 'act-jj-6', title: 'Ramen tasting tour', category: 'FOOD_DINING', date: d('2026-10-19'), startTime: '19:00', endTime: '22:00', cost: 40, location: 'Shinjuku' },
        ],
      },
      {
        id: 'stop-jj-kyoto', city: 'Kyoto', country: 'Japan', order: 2,
        startDate: d('2026-10-20'), endDate: d('2026-10-25'),
        notes: 'Traditional ryokan stay for the full cultural immersion.',
        activities: [
          { id: 'act-jj-7',  title: 'Arashiyama Bamboo Grove dawn', category: 'NATURE', date: d('2026-10-20'), startTime: '06:00', endTime: '08:30', cost: 0, location: 'Arashiyama' },
          { id: 'act-jj-8',  title: 'Fushimi Inari-taisha hike', category: 'ADVENTURE', date: d('2026-10-21'), startTime: '07:00', endTime: '11:00', cost: 0, location: 'Fushimi', duration: 240 },
          { id: 'act-jj-9',  title: 'Traditional tea ceremony', category: 'CULTURE', date: d('2026-10-22'), startTime: '14:00', endTime: '15:30', cost: 40, location: 'Higashiyama', duration: 90 },
          { id: 'act-jj-10', title: 'Nishiki Market food walk', category: 'FOOD_DINING', date: d('2026-10-23'), startTime: '10:00', endTime: '12:30', cost: 30, location: 'Nishiki Market' },
          { id: 'act-jj-11', title: 'Gion geisha district evening', category: 'CULTURE', date: d('2026-10-24'), startTime: '18:00', endTime: '21:00', cost: 0, location: 'Gion', notes: 'Respectful photography only' },
        ],
      },
    ],
  })

  // ─── Sofia's Bali Wellness Retreat ───────────────────────────
  await seedTrip({
    id: 'trip-sofia-bali',
    userId: 'user-sofia',
    title: 'Bali Soul Reset 🧘',
    description: 'A 10-day spiritual and wellness journey across the Island of the Gods.',
    status: 'PLANNING',
    startDate: d('2026-12-01'),
    endDate:   d('2026-12-11'),
    isPublic: false,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    stops: [
      {
        id: 'stop-sb-ubud', city: 'Ubud', country: 'Indonesia', state: 'Bali', order: 1,
        startDate: d('2026-12-01'), endDate: d('2026-12-06'),
        notes: 'Yoga retreat villa included in package price.',
        activities: [
          { id: 'act-sb-1', title: 'Morning yoga & meditation', category: 'WELLNESS', date: d('2026-12-01'), startTime: '07:00', endTime: '09:00', cost: 0, location: 'Villa' },
          { id: 'act-sb-2', title: 'Tegallalang Rice Terraces trek', category: 'NATURE', date: d('2026-12-02'), startTime: '08:00', endTime: '11:00', cost: 5, location: 'Tegallalang' },
          { id: 'act-sb-3', title: 'Traditional Balinese cooking class', category: 'FOOD_DINING', date: d('2026-12-03'), startTime: '09:00', endTime: '12:00', cost: 35, location: 'Ubud', duration: 180 },
          { id: 'act-sb-4', title: 'Tirta Empul water temple', category: 'CULTURE', date: d('2026-12-04'), startTime: '08:00', endTime: '10:00', cost: 3, location: 'Tampaksiring', notes: 'Sarong required' },
          { id: 'act-sb-5', title: 'Sound healing ceremony', category: 'WELLNESS', date: d('2026-12-05'), startTime: '17:00', endTime: '19:00', cost: 25, location: 'Ubud', duration: 120 },
        ],
      },
      {
        id: 'stop-sb-seminyak', city: 'Seminyak', country: 'Indonesia', state: 'Bali', order: 2,
        startDate: d('2026-12-06'), endDate: d('2026-12-11'),
        notes: 'Beach villa — Potato Head Beach Club is 5 min walk.',
        activities: [
          { id: 'act-sb-6', title: 'Sunset at Potato Head Beach Club', category: 'ENTERTAINMENT', date: d('2026-12-06'), startTime: '17:30', endTime: '20:00', cost: 0, location: 'Seminyak' },
          { id: 'act-sb-7', title: 'Balinese massage at Jari Menari', category: 'WELLNESS', date: d('2026-12-07'), startTime: '10:00', endTime: '12:00', cost: 45, location: 'Seminyak', duration: 120 },
          { id: 'act-sb-8', title: 'Tanah Lot sea temple at sunset', category: 'CULTURE', date: d('2026-12-09'), startTime: '16:00', endTime: '19:00', cost: 5, location: 'Tabanan' },
          { id: 'act-sb-9', title: 'Final beach day & cocktails', category: 'ENTERTAINMENT', date: d('2026-12-10'), startTime: '11:00', endTime: '20:00', cost: 40, location: 'Seminyak Beach' },
        ],
      },
    ],
  })

  // ─── Alex's Southeast Asia Backpack ─────────────────────────
  await seedTrip({
    id: 'trip-alex-sea',
    userId: 'user-alex',
    title: 'SEA Backpacker Circuit 🎒',
    description: 'Bangkok → Singapore budget backpacking adventure on a shoestring.',
    status: 'ONGOING',
    startDate: d('2026-08-01'),
    endDate:   d('2026-08-22'),
    isPublic: true,
    shareToken: 'alex-sea-share',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
    stops: [
      {
        id: 'stop-as-bangkok', city: 'Bangkok', country: 'Thailand', order: 1,
        startDate: d('2026-08-01'), endDate: d('2026-08-07'),
        notes: 'Khao San Road hostel — $8/night dorm.',
        activities: [
          { id: 'act-as-1', title: 'Grand Palace & Wat Phra Kaew', category: 'SIGHTSEEING', date: d('2026-08-01'), startTime: '09:00', endTime: '13:00', cost: 15, location: 'Na Phra Lan Rd' },
          { id: 'act-as-2', title: 'Khao San Road night market', category: 'FOOD_DINING', date: d('2026-08-01'), startTime: '19:00', endTime: '23:00', cost: 10, location: 'Khao San Road' },
          { id: 'act-as-3', title: 'Floating market day trip', category: 'SHOPPING', date: d('2026-08-03'), startTime: '07:00', endTime: '13:00', cost: 20, location: 'Damnoen Saduak', duration: 360 },
          { id: 'act-as-4', title: 'Muay Thai boxing match', category: 'ENTERTAINMENT', date: d('2026-08-05'), startTime: '18:00', endTime: '22:00', cost: 30, location: 'Rajadamnern Stadium' },
        ],
      },
      {
        id: 'stop-as-singapore', city: 'Singapore', country: 'Singapore', order: 2,
        startDate: d('2026-08-15'), endDate: d('2026-08-22'),
        notes: 'Capsule hotel in Chinatown — MRT is excellent.',
        activities: [
          { id: 'act-as-5', title: 'Gardens by the Bay & Supertrees', category: 'NATURE', date: d('2026-08-15'), startTime: '18:00', endTime: '21:00', cost: 8, location: 'Marina Bay' },
          { id: 'act-as-6', title: 'Maxwell Food Centre hawker lunch', category: 'FOOD_DINING', date: d('2026-08-16'), startTime: '12:00', endTime: '13:30', cost: 6, location: 'Maxwell Road' },
          { id: 'act-as-7', title: 'Chinatown & Little India walk', category: 'CULTURE', date: d('2026-08-17'), startTime: '10:00', endTime: '14:00', cost: 0, location: 'Chinatown' },
          { id: 'act-as-8', title: 'Marina Bay Sands SkyPark', category: 'SIGHTSEEING', date: d('2026-08-18'), startTime: '19:00', endTime: '21:00', cost: 26, location: 'Marina Bay Sands' },
          { id: 'act-as-9', title: 'Sentosa Island day trip', category: 'ADVENTURE', date: d('2026-08-20'), startTime: '10:00', endTime: '18:00', cost: 35, location: 'Sentosa', duration: 480 },
        ],
      },
    ],
  })

  // ─── Amara's African Adventure ───────────────────────────────
  await seedTrip({
    id: 'trip-amara-africa',
    userId: 'user-amara',
    title: 'African Safari & Culture 🦁',
    description: 'Cape Town city break followed by a Kruger National Park safari.',
    status: 'PLANNING',
    startDate: d('2027-01-10'),
    endDate:   d('2027-01-22'),
    isPublic: false,
    coverImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200',
    stops: [
      {
        id: 'stop-aa-capetown', city: 'Cape Town', country: 'South Africa', order: 1,
        startDate: d('2027-01-10'), endDate: d('2027-01-15'),
        notes: 'Airbnb in Green Point — great for V&A Waterfront access.',
        activities: [
          { id: 'act-aa-1', title: 'Table Mountain cable car', category: 'SIGHTSEEING', date: d('2027-01-10'), startTime: '09:00', endTime: '12:00', cost: 32, location: 'Table Mountain Aerial Cableway', notes: 'Book first morning ticket' },
          { id: 'act-aa-2', title: 'Boulders Beach penguins', category: 'NATURE', date: d('2027-01-11'), startTime: '09:00', endTime: '12:00', cost: 8, location: 'Simons Town', duration: 180 },
          { id: 'act-aa-3', title: 'Cape winelands tour', category: 'FOOD_DINING', date: d('2027-01-12'), startTime: '10:00', endTime: '18:00', cost: 75, location: 'Stellenbosch', duration: 480 },
          { id: 'act-aa-4', title: 'Bo-Kaap neighbourhood walk', category: 'CULTURE', date: d('2027-01-14'), startTime: '10:00', endTime: '12:00', cost: 0, location: 'Bo-Kaap' },
        ],
      },
      {
        id: 'stop-aa-kruger', city: 'Kruger National Park', country: 'South Africa', order: 2,
        startDate: d('2027-01-16'), endDate: d('2027-01-22'),
        notes: 'Staying at Skukuza rest camp. All-inclusive safari package.',
        activities: [
          { id: 'act-aa-5', title: 'Big 5 morning game drive', category: 'NATURE', date: d('2027-01-16'), startTime: '05:30', endTime: '09:30', cost: 60, location: 'Kruger National Park', notes: 'Open vehicle — dress warm!' },
          { id: 'act-aa-6', title: 'Guided bush walk', category: 'ADVENTURE', date: d('2027-01-17'), startTime: '06:00', endTime: '09:00', cost: 45, location: 'Kruger NP', duration: 180 },
          { id: 'act-aa-7', title: 'Sunset game drive', category: 'NATURE', date: d('2027-01-18'), startTime: '16:00', endTime: '19:30', cost: 55, location: 'Kruger National Park' },
          { id: 'act-aa-8', title: 'Sundowner drinks at camp', category: 'ENTERTAINMENT', date: d('2027-01-19'), startTime: '18:00', endTime: '20:00', cost: 15, location: 'Skukuza Camp' },
          { id: 'act-aa-9', title: 'Final sunrise game drive', category: 'NATURE', date: d('2027-01-21'), startTime: '05:30', endTime: '10:00', cost: 60, location: 'Kruger National Park' },
        ],
      },
    ],
  })

  // ─── Priya's quick Dubai weekend ─────────────────────────────
  await seedTrip({
    id: 'trip-priya-dubai',
    userId: 'user-priya',
    title: 'Dubai Long Weekend ✨',
    description: 'A quick 4-day luxe escape to the UAE.',
    status: 'COMPLETED',
    startDate: d('2026-03-20'),
    endDate:   d('2026-03-24'),
    isPublic: false,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
    stops: [
      {
        id: 'stop-pd-dubai', city: 'Dubai', country: 'UAE', order: 1,
        startDate: d('2026-03-20'), endDate: d('2026-03-24'),
        notes: 'Staying at JW Marriott, Downtown. Dubai Mall is 10 min walk.',
        activities: [
          { id: 'act-pd-1', title: 'Burj Khalifa At The Top', category: 'SIGHTSEEING', date: d('2026-03-20'), startTime: '18:00', endTime: '20:00', cost: 45, location: 'Burj Khalifa' },
          { id: 'act-pd-2', title: 'Dubai Mall & fountain show', category: 'SHOPPING', date: d('2026-03-21'), startTime: '14:00', endTime: '22:00', cost: 0, location: 'Dubai Mall' },
          { id: 'act-pd-3', title: 'Old Dubai & Gold Souk', category: 'SHOPPING', date: d('2026-03-22'), startTime: '10:00', endTime: '13:00', cost: 0, location: 'Deira' },
          { id: 'act-pd-4', title: 'Desert safari & BBQ dinner', category: 'ADVENTURE', date: d('2026-03-23'), startTime: '15:00', endTime: '22:00', cost: 90, location: 'Dubai Desert Conservation Reserve', duration: 420 },
        ],
      },
    ],
  })

  console.log('  ✅ Trips, stops & activities seeded')
  console.log('')
  console.log('👤 Demo accounts:')
  console.log('   admin@globetrotter.app       → Admin@123  (ADMIN)')
  console.log('   priya.sharma@demo.com        → Travel@123 (2 completed trips)')
  console.log('   james.walker@demo.com        → Travel@123 (upcoming Japan trip)')
  console.log('   sofia.reyes@demo.com         → Travel@123 (planning Bali)')
  console.log('   alex.chen@demo.com           → Travel@123 (ongoing SEA trip)')
  console.log('   amara.osei@demo.com          → Travel@123 (planning African safari)')
  console.log('')
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

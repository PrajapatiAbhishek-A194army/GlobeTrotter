import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlineLocationMarker, HiOutlineCurrencyDollar } from 'react-icons/hi'
import SectionHeader from '../../components/ui/SectionHeader'

const destinations = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1499856374870-7743d2d7b85f?w=600&q=80',
    costIndex: 7.5,
    tags: ['Romance', 'Culture', 'Art'],
    trips: '4.2K trips',
    emoji: '🗼',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    costIndex: 6.5,
    tags: ['Tech', 'Food', 'Culture'],
    trips: '3.8K trips',
    emoji: '🏯',
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    continent: 'N. America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    costIndex: 8.5,
    tags: ['Urban', 'Nightlife', 'Shopping'],
    trips: '5.1K trips',
    emoji: '🗽',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    costIndex: 3.5,
    tags: ['Beach', 'Wellness', 'Nature'],
    trips: '6.0K trips',
    emoji: '🌴',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    costIndex: 6.0,
    tags: ['History', 'Food', 'Architecture'],
    trips: '3.3K trips',
    emoji: '🏛️',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    continent: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    costIndex: 8.0,
    tags: ['Luxury', 'Desert', 'Skyline'],
    trips: '2.9K trips',
    emoji: '🌆',
  },
]

function CostBadge({ index }) {
  const level = index <= 4 ? 'Budget' : index <= 6.5 ? 'Moderate' : 'Premium'
  const colors = {
    Budget:   'bg-green-100 text-green-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Premium:  'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[level]}`}>
      {level}
    </span>
  )
}

export default function DestinationsSection() {
  return (
    <section id="destinations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="Top Destinations"
            title="Where will you go next?"
            subtitle="Explore the world's most popular travel destinations."
            centered={false}
            className="mb-0"
          />
          <Link
            to="/discover/cities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap transition-colors"
          >
            View all destinations
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/discover/cities?q=${dest.name}`}
              className="group relative block rounded-2xl overflow-hidden shadow-card hover:shadow-card-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />

              {/* Tags overlay top right */}
              <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                <CostBadge index={dest.costIndex} />
              </div>

              {/* Content bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{dest.emoji}</span>
                      <h3 className="font-display font-bold text-white text-xl">{dest.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/75">
                      <HiOutlineLocationMarker className="w-3 h-3" />
                      <span>{dest.country}</span>
                      <span>·</span>
                      <span>{dest.continent}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {dest.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="flex items-center gap-1 text-xs text-white/75 mb-1">
                      <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />
                      <span>Cost Index</span>
                    </div>
                    <span className="font-bold text-white text-lg">{dest.costIndex}</span>
                    <p className="text-xs text-white/60">{dest.trips}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

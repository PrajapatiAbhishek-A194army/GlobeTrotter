import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi'

// Shown when API destinations are not available yet
const mockDestinations = [
  { id: '1', name: 'Paris',     country: 'France',    image: 'https://images.unsplash.com/photo-1499856374870-7743d2d7b85f?w=400&q=70', emoji: '🗼', costIndex: 7.5 },
  { id: '2', name: 'Tokyo',     country: 'Japan',     image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=70', emoji: '🏯', costIndex: 6.5 },
  { id: '3', name: 'Bali',      country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=70', emoji: '🌴', costIndex: 3.5 },
  { id: '4', name: 'New York',  country: 'USA',       image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=70', emoji: '🗽', costIndex: 8.5 },
]

export default function PopularDestinations({ destinations = [], loading }) {
  const items = destinations.length ? destinations : mockDestinations

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-neutral-900 text-lg">Popular Destinations</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Trending spots for your next trip</p>
        </div>
        <Link
          to="/discover/cities"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all <HiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-[4/3] bg-neutral-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.slice(0, 4).map((dest) => (
            <Link
              key={dest.id}
              to={`/discover/cities?q=${dest.name}`}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100"
            >
              <img
                src={dest.image || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70`}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{dest.name}</p>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <HiOutlineLocationMarker className="w-2.5 h-2.5" />
                      <span>{dest.country}</span>
                    </div>
                  </div>
                  <span className="text-xl">{dest.emoji}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

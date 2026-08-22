import { Link } from 'react-router-dom'
import {
  HiOutlineMap, HiOutlineLightningBolt, HiOutlineHeart,
  HiOutlineGlobe, HiOutlineCamera, HiOutlineStar,
  HiOutlineSparkles, HiOutlineArrowRight,
} from 'react-icons/hi'
import PublicLayout from '../../layouts/PublicLayout'
import { useAuth } from '../../context/AuthContext'

const ACTIVITY_TYPES = [
  {
    emoji: '🏛️', label: 'Sightseeing', desc: 'Iconic landmarks, monuments, and viewpoints that define a destination.',
    gradient: 'from-amber-400 to-orange-500', tags: ['landmarks', 'museums', 'UNESCO'],
    query: 'SIGHTSEEING',
  },
  {
    emoji: '🧗', label: 'Adventure', desc: 'Hiking, surfing, skydiving — push your limits in the wild.',
    gradient: 'from-orange-500 to-red-500', tags: ['hiking', 'surfing', 'extreme'],
    query: 'ADVENTURE',
  },
  {
    emoji: '🍜', label: 'Food & Dining', desc: 'Street food tours, fine dining, cooking classes, and local markets.',
    gradient: 'from-red-400 to-pink-500', tags: ['street food', 'restaurants', 'cooking'],
    query: 'FOOD_DINING',
  },
  {
    emoji: '🎭', label: 'Culture & Arts', desc: 'Galleries, festivals, performances, and authentic cultural experiences.',
    gradient: 'from-purple-500 to-indigo-500', tags: ['art', 'festivals', 'theatre'],
    query: 'CULTURE',
  },
  {
    emoji: '🛍️', label: 'Shopping', desc: 'Markets, boutiques, malls — find unique souvenirs and local crafts.',
    gradient: 'from-pink-400 to-rose-500', tags: ['markets', 'souvenirs', 'boutiques'],
    query: 'SHOPPING',
  },
  {
    emoji: '🌿', label: 'Nature & Wildlife', desc: 'National parks, safaris, and unspoiled natural wonders.',
    gradient: 'from-emerald-500 to-teal-500', tags: ['safari', 'national parks', 'wildlife'],
    query: 'NATURE',
  },
  {
    emoji: '🏨', label: 'Accommodation', desc: 'Hotels, hostels, glamping, and boutique stays worth booking.',
    gradient: 'from-indigo-400 to-blue-500', tags: ['hotels', 'hostels', 'glamping'],
    query: 'ACCOMMODATION',
  },
  {
    emoji: '🧘', label: 'Wellness', desc: 'Yoga retreats, spas, hot springs — recharge and rejuvenate.',
    gradient: 'from-teal-400 to-cyan-500', tags: ['yoga', 'spa', 'meditation'],
    query: 'WELLNESS',
  },
  {
    emoji: '🎡', label: 'Entertainment', desc: 'Theme parks, nightlife, concerts, and shows.',
    gradient: 'from-cyan-400 to-sky-500', tags: ['nightlife', 'concerts', 'shows'],
    query: 'ENTERTAINMENT',
  },
  {
    emoji: '🚌', label: 'Transport', desc: 'Scenic train journeys, cruises, and iconic transit experiences.',
    gradient: 'from-blue-400 to-primary-500', tags: ['trains', 'cruises', 'scenic'],
    query: 'TRANSPORT',
  },
]

const TRAVEL_TIPS = [
  { icon: HiOutlineLightningBolt, title: 'Book Early', tip: 'Flights and popular attractions book up fast. Plan at least 3 months ahead for peak seasons.' },
  { icon: HiOutlineHeart,         title: 'Stay Flexible', tip: 'Leave buffer days in your itinerary. Some of the best experiences are unplanned.' },
  { icon: HiOutlineCamera,        title: 'Capture Moments', tip: 'Document your trip with photos and journal entries. You\'ll thank yourself later.' },
  { icon: HiOutlineStar,          title: 'Go Local', tip: 'Skip tourist traps. Ask locals for their favourite restaurants, hidden spots, and shortcuts.' },
]

export default function DiscoverActivitiesPage() {
  const { isAuthenticated } = useAuth()

  return (
    <PublicLayout>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <HiOutlineSparkles className="w-3.5 h-3.5" /> Activity Discovery
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Discover <span className="text-purple-400">Activities</span> You'll Love
          </h1>
          <p className="text-neutral-300 text-lg max-w-xl mx-auto mb-8">
            From adrenaline-pumping adventures to serene wellness retreats — find activities that match your travel style.
          </p>
          {isAuthenticated ? (
            <Link to="/trips/new">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold text-base transition-all shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]">
                Start Planning <HiOutlineArrowRight className="w-5 h-5" />
              </button>
            </Link>
          ) : (
            <Link to="/signup">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-purple-900 rounded-2xl font-semibold text-base transition-all shadow-lg hover:bg-purple-50 active:scale-[0.98]">
                Get Started Free <HiOutlineArrowRight className="w-5 h-5" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* ── Activity Categories Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-3">Browse by Category</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Every trip tells a story. What kind of experiences are you after?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ACTIVITY_TYPES.map((type) => (
            <Link
              key={type.query}
              to={isAuthenticated ? `/trips/new` : `/discover/cities`}
              id={`activity-${type.query.toLowerCase()}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-card hover:shadow-card-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${type.gradient}`} />

              <div className="p-5">
                <div className="text-4xl mb-3">{type.emoji}</div>
                <h3 className="font-display font-bold text-neutral-900 text-sm mb-1">{type.label}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{type.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {type.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-medium rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Travel Tips ── */}
      <section className="bg-neutral-50 border-y border-neutral-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-neutral-900 mb-3">Travel Smarter</h2>
            <p className="text-neutral-500">Pro tips to make every trip unforgettable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRAVEL_TIPS.map(({ icon: Icon, title, tip }) => (
              <div key={title} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 hover:shadow-card-md transition-all">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="relative bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="relative">
            <p className="text-5xl mb-4">🗺️</p>
            <h2 className="font-display font-black text-3xl text-white mb-3">Ready to Plan?</h2>
            <p className="text-white/80 text-base mb-7 max-w-md mx-auto">
              Add activities directly to your trips, build a day-by-day itinerary, and never miss a moment.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to={isAuthenticated ? '/trips' : '/signup'}>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 rounded-2xl font-semibold hover:bg-primary-50 transition-all shadow-md active:scale-[0.98]">
                  {isAuthenticated ? 'My Trips' : 'Sign Up Free'}
                  <HiOutlineArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/discover/cities">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
                  <HiOutlineGlobe className="w-4 h-4" />
                  Explore Cities
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

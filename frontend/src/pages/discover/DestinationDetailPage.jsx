import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineLocationMarker, HiOutlineGlobe, HiOutlineCalendar,
  HiOutlineCurrencyDollar, HiOutlineSun, HiOutlineStar,
  HiOutlineArrowLeft, HiOutlinePlus, HiOutlineSparkles,
  HiOutlineEye, HiOutlineCheck,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import PublicLayout from '../../layouts/PublicLayout'
import Button from '../../components/ui/Button'
import * as destService from '../../services/destination.service'
import * as tripService from '../../services/trip.service'
import { useAuth } from '../../context/AuthContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80'

// Curated top highlights & activities for major cities
const HIGHLIGHTS_DATABASE = {
  paris: [
    { title: 'Eiffel Tower & Champ de Mars', category: 'SIGHTSEEING', cost: 28, emoji: '🗼', desc: 'Ascend to the summit for panoramic views of Paris and enjoy a picnic on the lawn.' },
    { title: 'The Louvre Museum', category: 'CULTURE', cost: 22, emoji: '🏛️', desc: 'Explore the world\'s largest art museum, home to the Mona Lisa and Venus de Milo.' },
    { title: 'Montmartre & Sacré-Cœur', category: 'CULTURE', cost: 0, emoji: '🎨', desc: 'Wander the bohemian cobblestone streets and enjoy sunset over Paris from Sacré-Cœur basilica.' },
    { title: 'Seine River Sunset Cruise', category: 'ADVENTURE', cost: 18, emoji: '🚢', desc: 'Glide past Notre-Dame, the Musée d\'Orsay, and illuminated bridges at golden hour.' },
    { title: 'Champs-Élysées & Arc de Triomphe', category: 'SHOPPING', cost: 16, emoji: '🛍️', desc: 'Stroll the world-famous avenue and climb to the rooftop of the Arc de Triomphe.' },
    { title: 'Croissant & Cafe Tasting in Le Marais', category: 'FOOD_DINING', cost: 15, emoji: '🥐', desc: 'Taste artisanal pastries and specialty espresso in Paris’s trendiest historic district.' },
  ],
  tokyo: [
    { title: 'Shibuya Crossing & Hachiko Statue', category: 'SIGHTSEEING', cost: 0, emoji: '🚶', desc: 'Experience the world\'s busiest pedestrian intersection and explore Shibuya\'s neon avenues.' },
    { title: 'Senso-ji Temple in Asakusa', category: 'CULTURE', cost: 0, emoji: '⛩️', desc: 'Tokyo’s oldest temple with vibrant Nakamise shopping street and traditional street foods.' },
    { title: 'TeamLab Planets Digital Art', category: 'ENTERTAINMENT', cost: 32, emoji: '✨', desc: 'Immersive multi-sensory digital art museum walking through water and blooming lights.' },
    { title: 'Tsukiji Outer Market Food Tour', category: 'FOOD_DINING', cost: 25, emoji: '🍣', desc: 'Sample the freshest sushi, wagyu skewers, tamagoyaki, and Japanese street delights.' },
    { title: 'Shinjuku Gyoen National Garden', category: 'NATURE', cost: 5, emoji: '🌸', desc: 'Tranquil oasis blending traditional Japanese, English, and French landscaped gardens.' },
  ],
  'new-york': [
    { title: 'Central Park & Bethesda Terrace', category: 'NATURE', cost: 0, emoji: '🌳', desc: 'Iconic 843-acre urban park with scenic bridges, boat ponds, and relaxing meadows.' },
    { title: 'Top of the Rock or Summit One', category: 'SIGHTSEEING', cost: 42, emoji: '🏙️', desc: 'Panoramic 360-degree views of Manhattan including the Empire State Building.' },
    { title: 'Broadway Theatre Show', category: 'ENTERTAINMENT', cost: 85, emoji: '🎭', desc: 'World-class musical and dramatic theater performances in the heart of Times Square.' },
    { title: 'High Line & Chelsea Market', category: 'CULTURE', cost: 0, emoji: '🌿', desc: 'Elevated railway park transformed into a public walking trail with gourmet food market.' },
  ],
  bali: [
    { title: 'Tegalalang Rice Terraces', category: 'NATURE', cost: 5, emoji: '🌾', desc: 'Scenic valley of terraced green paddies with jungle swings in Ubud.' },
    { title: 'Uluwatu Temple & Kecak Fire Dance', category: 'CULTURE', cost: 15, emoji: '🔥', desc: 'Cliffside temple overlooking the Indian Ocean with mesmerizing sunset fire dance.' },
    { title: 'Seminyak Beach Sunset & Dining', category: 'FOOD_DINING', cost: 20, emoji: '🍹', desc: 'Vibrant beach clubs and tropical seafood dining with breathtaking ocean sunsets.' },
  ],
  rome: [
    { title: 'Colosseum & Roman Forum', category: 'CULTURE', cost: 24, emoji: '🏛️', desc: 'Step back in time at the monumental amphitheater of ancient gladiators and Roman emperors.' },
    { title: 'Vatican Museums & Sistine Chapel', category: 'CULTURE', cost: 27, emoji: '🎨', desc: 'Marvel at Michelangelo\'s ceiling frescoes and world-renowned classical sculptures.' },
    { title: 'Trevi Fountain & Spanish Steps', category: 'SIGHTSEEING', cost: 0, emoji: '⛲', desc: 'Toss a coin into Rome’s most iconic fountain to ensure your return to the Eternal City.' },
  ],
}

export default function DestinationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [dest,         setDest]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [relatedTrips, setRelatedTrips] = useState([])
  const [imgSrc,       setImgSrc]       = useState(null)

  useEffect(() => {
    setLoading(true)
    destService.getDestinationById(id)
      .then(d => {
        setDest(d)
        setImgSrc(d.image || FALLBACK_IMAGE)
      })
      .catch(() => setError('Destination not found'))
      .finally(() => setLoading(false))

    // Also fetch public trips visiting this city
    tripService.getPublicTrips({ search: id })
      .then(res => setRelatedTrips(res.trips || []))
      .catch(() => {})
  }, [id])

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Discovering destination…</p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !dest) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">🗺️</div>
            <h1 className="font-display font-bold text-2xl text-neutral-900 mb-2">Destination Not Found</h1>
            <p className="text-neutral-500 text-sm mb-6">We couldn't find the city you were looking for.</p>
            <Link to="/discover/cities">
              <Button variant="primary">Browse All Destinations</Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const highlights = HIGHLIGHTS_DATABASE[dest.id.toLowerCase()] || HIGHLIGHTS_DATABASE['paris']

  const handlePlanTrip = () => {
    if (!isAuthenticated) {
      toast('Log in to start planning a trip!', { icon: '🔑' })
      navigate('/login')
      return
    }
    navigate('/trips/new')
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-neutral-50 pb-16">

        {/* ── Hero ── */}
        <div className="relative h-[420px] sm:h-[480px] overflow-hidden bg-neutral-900">
          <img
            src={imgSrc}
            alt={dest.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover opacity-60 scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" />

          {/* Top back button */}
          <div className="absolute top-20 left-4 sm:left-8 z-10">
            <Link
              to="/discover/cities"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-semibold hover:bg-black/60 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> All Cities
            </Link>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {dest.continent && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {dest.continent}
                </span>
              )}
              {dest.costIndex && (
                <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-bold text-white">
                  Cost Index: {dest.costIndex}/10
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-2 drop-shadow-md">
              {dest.name}
            </h1>
            <p className="text-white/90 text-lg flex items-center gap-2 font-medium drop-shadow">
              <HiOutlineLocationMarker className="w-5 h-5 text-primary-400" />
              {dest.country}
            </p>
          </div>
        </div>

        {/* ── Main Body ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-8">

          {/* Top Key Facts Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-neutral-400 font-medium">Climate</p>
              <p className="font-display font-bold text-neutral-800 text-base mt-1 flex items-center gap-1.5">
                <HiOutlineSun className="w-4 h-4 text-amber-500" />
                {dest.climate || 'Temperate'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">Best Months</p>
              <p className="font-display font-bold text-neutral-800 text-base mt-1 flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                {Array.isArray(dest.bestMonths) ? dest.bestMonths.slice(0, 2).join(', ') : 'Spring & Autumn'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">Popularity Score</p>
              <p className="font-display font-bold text-neutral-800 text-base mt-1 flex items-center gap-1.5">
                <HiOutlineStar className="w-4 h-4 text-amber-400" />
                {dest.popularity || 95}/100
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">Experience Type</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(dest.tags || ['Culture', 'Romance', 'Food']).slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left 2 Cols — About & Top Highlights */}
            <div className="lg:col-span-2 space-y-8">

              {/* About Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-neutral-100 space-y-3">
                <h2 className="font-display font-bold text-xl text-neutral-900 flex items-center gap-2">
                  <HiOutlineGlobe className="w-5 h-5 text-primary-600" />
                  About {dest.name}
                </h2>
                <p className="text-neutral-600 text-base leading-relaxed">
                  {dest.description || `${dest.name} is one of the world's premier travel destinations, renowned for its rich heritage, iconic landmarks, culinary mastery, and unforgettable cultural experiences.`}
                </p>
                {dest.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {dest.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium capitalize">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Things to Do */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-neutral-100 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-xl text-neutral-900 flex items-center gap-2">
                    <HiOutlineSparkles className="w-5 h-5 text-primary-600" />
                    Top Experiences in {dest.name}
                  </h2>
                  <span className="text-xs font-semibold text-neutral-400">Curated Highlights</span>
                </div>

                <div className="space-y-3">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-100 hover:border-neutral-200 transition-all flex items-start gap-3.5">
                      <span className="text-2xl shrink-0 p-1.5 bg-white rounded-xl shadow-xs">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                          <span className="text-xs font-bold text-emerald-600 shrink-0">
                            {item.cost > 0 ? `$${item.cost}` : 'Free'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column — Plan Trip CTA & Community Trips */}
            <div className="space-y-6">

              {/* Plan Trip Card */}
              <div className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
                  ✈️
                </div>
                <h3 className="font-display font-black text-2xl leading-tight">
                  Ready to explore {dest.name}?
                </h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  Start building your personalized itinerary with day-by-day activities, budget tracking, and real-time stops.
                </p>
                <button
                  id="plan-trip-to-dest-btn"
                  onClick={handlePlanTrip}
                  className="w-full py-3 px-5 bg-white hover:bg-primary-50 text-primary-700 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Plan a Trip to {dest.name}
                </button>
              </div>

              {/* Community Itineraries visiting this city */}
              {relatedTrips.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-card border border-neutral-100 space-y-4">
                  <h3 className="font-display font-bold text-base text-neutral-800 flex items-center gap-2">
                    <HiOutlineEye className="w-4 h-4 text-primary-500" />
                    Community Trips Visiting {dest.name}
                  </h3>
                  <div className="space-y-3">
                    {relatedTrips.slice(0, 3).map(trip => (
                      <Link
                        key={trip.id}
                        to={`/share/${trip.shareToken}`}
                        className="block p-3 rounded-xl bg-neutral-50 hover:bg-primary-50/50 transition-colors border border-neutral-100"
                      >
                        <p className="text-xs font-bold text-neutral-800 line-clamp-1">{trip.title}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">by {trip.user?.firstName} {trip.user?.lastName}</p>
                      </Link>
                    ))}
                  </div>
                  <Link to="/community" className="block text-center text-xs font-semibold text-primary-600 hover:text-primary-700 pt-1">
                    Explore all public itineraries →
                  </Link>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </PublicLayout>
  )
}

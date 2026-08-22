import { Link } from 'react-router-dom'
import { HiOutlinePlus, HiArrowRight } from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function WelcomeCard() {
  const { user } = useAuth()
  const today    = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-7 text-white shadow-lg">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="welcome-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welcome-dots)" />
        </svg>
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👋</span>
            <p className="text-primary-200 text-sm font-medium">{today}</p>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white mb-2">
            {getGreeting()}, {user?.firstName}!
          </h1>
          <p className="text-primary-100 text-sm max-w-sm">
            Ready for your next adventure? Your world is waiting to be explored.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/trips/new">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-primary-50 transition-all duration-150">
              <HiOutlinePlus className="w-4 h-4" />
              New Trip
            </button>
          </Link>
          <Link to="/discover/cities">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-150">
              Discover
              <HiArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

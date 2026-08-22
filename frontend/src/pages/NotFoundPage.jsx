import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineMap, HiOutlineSearch, HiOutlineArrowLeft } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">

        {/* Animated globe */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-emerald-500 flex items-center justify-center shadow-xl text-7xl animate-[float_3s_ease-in-out_infinite]">
            🌍
          </div>
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-5 h-5 bg-white rounded-full shadow-md absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center text-xs">
              ✈️
            </div>
          </div>
        </div>

        <h1 className="font-display font-black text-8xl text-neutral-900 mb-2 leading-none">
          4<span className="text-primary-500">0</span>4
        </h1>
        <h2 className="font-display font-bold text-2xl text-neutral-700 mb-3">Lost in Transit</h2>
        <p className="text-neutral-500 text-base mb-8 leading-relaxed">
          Looks like this page took a detour somewhere. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl font-semibold text-sm hover:bg-white transition-all"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to="/">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all shadow-sm">
              <HiOutlineHome className="w-4 h-4" /> Home
            </button>
          </Link>
          {isAuthenticated ? (
            <Link to="/trips">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-semibold text-sm hover:border-primary-300 transition-all">
                <HiOutlineMap className="w-4 h-4" /> My Trips
              </button>
            </Link>
          ) : (
            <Link to="/discover/cities">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-semibold text-sm hover:border-primary-300 transition-all">
                <HiOutlineSearch className="w-4 h-4" /> Explore Cities
              </button>
            </Link>
          )}
        </div>

        {/* Nav links */}
        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-neutral-400">
          {[
            { to: '/',                  label: 'Home' },
            { to: '/discover/cities',   label: 'Cities' },
            { to: '/discover/activities', label: 'Activities' },
            { to: isAuthenticated ? '/dashboard' : '/login', label: isAuthenticated ? 'Dashboard' : 'Login' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-primary-500 transition-colors">{label}</Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}

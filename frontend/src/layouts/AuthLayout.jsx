import { Link } from 'react-router-dom'
import { HiOutlineGlobeAlt } from 'react-icons/hi'

const features = [
  { emoji: '🗺️', text: 'Build multi-city itineraries in minutes' },
  { emoji: '💰', text: 'Track budgets across all your trips' },
  { emoji: '📅', text: 'Day-wise planning with calendar view' },
  { emoji: '🔗', text: 'Share trips with friends via public link' },
]

/**
 * AuthLayout — split panel: left green branded panel + right white form panel
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — Green Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />

        {/* Decorative dots grid */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-dots)" />
          </svg>
          {/* Blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group mb-auto">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">GlobeTrotter</span>
          </Link>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="text-6xl mb-8 animate-float">🌍</div>

            <h2 className="font-display font-black text-white text-4xl xl:text-5xl leading-tight mb-4">
              Plan trips like<br />
              <span className="text-primary-200">a professional</span>
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed mb-10 max-w-sm">
              Join 18,000+ explorers building beautiful travel itineraries with GlobeTrotter.
            </p>

            {/* Feature list */}
            <ul className="space-y-4">
              {features.map(({ emoji, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg shrink-0 border border-white/20">
                    {emoji}
                  </span>
                  <span className="text-primary-50 text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-5 mt-auto">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-300 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-white/90 text-sm leading-relaxed italic mb-3">
              "GlobeTrotter turned my chaotic spreadsheets into a beautiful itinerary. Best travel tool I've ever used!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700">SC</div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah Chen</p>
                <p className="text-primary-200 text-xs">Solo Travel Blogger</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-neutral-900">GlobeTrotter</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Form header */}
            {(title || subtitle) && (
              <div className="mb-8">
                {title && (
                  <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-neutral-500 text-sm leading-relaxed">{subtitle}</p>
                )}
              </div>
            )}

            {/* Form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

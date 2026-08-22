import { Link } from 'react-router-dom'
import {
  HiArrowRight, HiOutlinePlay,
  HiOutlineMap, HiOutlineCurrencyDollar, HiOutlineUsers,
} from 'react-icons/hi'
import Button from '../../components/ui/Button'

const stats = [
  { value: '50K+',  label: 'Trips Created',    icon: HiOutlineMap },
  { value: '$2.1M', label: 'Budgets Planned',   icon: HiOutlineCurrencyDollar },
  { value: '120+',  label: 'Countries Covered', icon: HiOutlineMap },
  { value: '18K+',  label: 'Happy Travelers',   icon: HiOutlineUsers },
]

// Floating trip card component
const FloatingCard = ({ className, children }) => (
  <div className={`absolute bg-white rounded-2xl shadow-card-xl border border-neutral-100 p-4 ${className}`}>
    {children}
  </div>
)

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-primary-50/40 to-accent-50/30">

      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute top-10 left-1/2 w-64 h-64 bg-primary-100/40 rounded-full blur-2xl" />
        {/* Dot grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#16a34a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text content */}
          <div className="animate-fade-up">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              <span className="text-xs font-semibold text-primary-700 tracking-wide uppercase">
                ✈️ Plan Smarter, Travel Better
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-bold text-neutral-900 text-5xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6">
              Your Perfect{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Journey</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                </svg>
              </span>
              <br />Starts Here
            </h1>

            {/* Subtext */}
            <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-xl">
              Build multi-city itineraries, track budgets, discover hidden gems, and share your adventures — all in one beautiful platform designed for modern explorers.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<HiArrowRight className="w-5 h-5" />}
                  className="shadow-green-glow-md"
                >
                  Start Planning Free
                </Button>
              </Link>
              <button className="inline-flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:text-primary-600 transition-colors group">
                <span className="w-11 h-11 rounded-full border-2 border-neutral-200 flex items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-50 transition-all">
                  <HiOutlinePlay className="w-4 h-4 ml-0.5" />
                </span>
                Watch 2-min Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {['🧑‍💼','👩‍💻','🧑‍🎨','👨‍🚀'].map((emoji, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-xs">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-neutral-500 ml-1">18K+ travelers</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-neutral-500">4.9 / 5.0</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <svg className="w-3.5 h-3.5 text-primary-500 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Main map card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-3xl border border-primary-100 shadow-card-xl overflow-hidden">
              {/* Decorative map-like visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 500 400" className="w-full h-full opacity-10">
                  <path d="M50 200 Q150 100 250 180 Q350 260 450 150" stroke="#22c55e" strokeWidth="3" fill="none" strokeDasharray="8 4"/>
                  <circle cx="50" cy="200" r="8" fill="#22c55e"/>
                  <circle cx="250" cy="180" r="8" fill="#16a34a"/>
                  <circle cx="450" cy="150" r="8" fill="#059669"/>
                </svg>
              </div>

              {/* Globe decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 flex items-center justify-center border border-primary-200/50">
                  <div className="w-52 h-52 rounded-full bg-gradient-to-br from-primary-400/30 to-accent-300/30 flex items-center justify-center border border-primary-200/40">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/40 to-accent-400/40 border border-primary-300/50 flex items-center justify-center">
                      <span className="text-5xl">🌍</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route dots */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-500 rounded-full shadow-green-glow animate-pulse" />
              <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-primary-600 rounded-full shadow-green-glow" />
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-accent-500 rounded-full shadow-green-glow animate-pulse" />
            </div>

            {/* Floating cards */}
            <FloatingCard className="-left-6 top-16 w-52 animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-lg shrink-0">🗼</div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">Paris Trip</p>
                  <p className="text-xs text-neutral-400">5 days · €1,200</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {['Day 1','Day 2','Day 3'].map((d, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-md font-medium">{d}</span>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard className="-right-6 top-28 w-48 animate-float" style={{ animationDelay: '1.5s' }}>
              <p className="text-xs font-semibold text-neutral-700 mb-2">💰 Budget Summary</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Hotels', pct: 65, color: 'bg-primary-500' },
                  { label: 'Food',   pct: 45, color: 'bg-accent-500' },
                  { label: 'Tours',  pct: 30, color: 'bg-primary-300' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-neutral-500 mb-0.5">
                      <span>{label}</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard className="-left-4 bottom-24 w-44 animate-float" style={{ animationDelay: '3s' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✅</span>
                <p className="text-xs font-semibold text-neutral-700">Itinerary Done!</p>
              </div>
              <p className="text-xs text-neutral-400">Tokyo → Kyoto → Osaka</p>
              <div className="mt-2 px-2 py-1 bg-primary-50 rounded-lg text-center">
                <span className="text-xs text-primary-600 font-medium">12 activities planned</span>
              </div>
            </FloatingCard>

            <FloatingCard className="right-2 bottom-16 w-40 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">⭐</div>
                <div>
                  <p className="text-xs font-bold text-neutral-800">4.9 / 5.0</p>
                  <p className="text-xs text-neutral-400">18K+ reviews</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-card p-5 text-center hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <p className="font-display font-bold text-2xl text-neutral-900 mb-0.5">{value}</p>
              <p className="text-xs text-neutral-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 64L1440 64L1440 32C1200 0 720 64 480 32C240 0 0 48 0 32L0 64Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  )
}

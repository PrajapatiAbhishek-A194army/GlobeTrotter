import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineGlobeAlt, HiOutlineMenuAlt3, HiX, HiArrowRight } from 'react-icons/hi'
import { clsx } from 'clsx'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Features',     href: '/#features',     sectionId: 'features' },
  { label: 'Destinations', href: '/#destinations', sectionId: 'destinations' },
  { label: 'How It Works', href: '/#how-it-works', sectionId: 'how-it-works' },
  { label: 'Community',    href: '/community' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // Detect scroll — apply background + shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isLandingPage = location.pathname === '/'

  const handleNavClick = (e, link) => {
    if (link.sectionId) {
      if (isLandingPage) {
        e.preventDefault()
        const el = document.getElementById(link.sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.pushState(null, '', `#${link.sectionId}`)
        }
      } else {
        // Navigating from another page to landing page section
        navigate(`/#${link.sectionId}`)
      }
    }
  }

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`)
    : null

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isLandingPage
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="GlobeTrotter home">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-neutral-900 tracking-tight">
              Globe<span className="text-primary-600">Trotter</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  'text-neutral-600 hover:text-primary-700 hover:bg-primary-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button
                  id="go-to-account-btn"
                  className="flex items-center gap-2.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.firstName?.[0] || 'U'}</span>
                    )}
                  </div>
                  <span>Go to Account</span>
                  <HiArrowRight className="w-4 h-4 text-primary-200" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <HiX className="w-6 h-6" />
              : <HiOutlineMenuAlt3 className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          'md:hidden bg-white border-t border-neutral-100 overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2 mt-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="block">
                <Button variant="primary" size="md" fullWidth className="flex items-center justify-center gap-2">
                  <span>Go to Account</span>
                  <HiArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="ghost" size="md" fullWidth>Sign in</Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button variant="primary" size="md" fullWidth>Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

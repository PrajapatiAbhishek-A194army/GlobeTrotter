import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock,
  HiOutlineCurrencyDollar, HiOutlineMap, HiOutlineGlobe,
  HiOutlineEye, HiOutlineDuplicate, HiOutlineShare, HiOutlineCheck,
  HiOutlineUsers, HiOutlineArrowLeft,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import * as tripService from '../../services/trip.service'

const catEmoji = {
  SIGHTSEEING: '🏛️', ADVENTURE: '🧗', FOOD_DINING: '🍜', CULTURE: '🎭',
  SHOPPING: '🛍️', TRANSPORT: '🚌', ACCOMMODATION: '🏨', ENTERTAINMENT: '🎡',
  WELLNESS: '🧘', NATURE: '🌿', OTHER: '📌',
}

const STATUS_CFG = {
  PLANNING:  { label: 'Planning',   color: 'bg-neutral-100 text-neutral-600' },
  UPCOMING:  { label: 'Upcoming',   color: 'bg-blue-100 text-blue-700' },
  ONGOING:   { label: 'Ongoing',    color: 'bg-emerald-100 text-emerald-700' },
  COMPLETED: { label: 'Completed',  color: 'bg-primary-100 text-primary-700' },
  CANCELLED: { label: 'Cancelled',  color: 'bg-red-100 text-red-600' },
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
const fmtLong = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : null

function groupActivities(activities) {
  const map = {}
  activities.forEach(a => {
    const key = a.date ? a.date.slice(0, 10) : 'unscheduled'
    if (!map[key]) map[key] = []
    map[key].push(a)
  })
  return Object.entries(map).sort(([a], [b]) => {
    if (a === 'unscheduled') return 1
    if (b === 'unscheduled') return -1
    return a.localeCompare(b)
  })
}

export default function SharedTripPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [trip,      setTrip]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [cloning,   setCloning]   = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    tripService.getSharedTrip(token)
      .then(setTrip)
      .catch(err => {
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          setError('private')
        } else {
          setError('not_found')
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedUrl(true)
    toast.success('Share link copied to clipboard! 🔗')
    setTimeout(() => setCopiedUrl(false), 2500)
  }

  const handleCloneTrip = async () => {
    if (!isAuthenticated) {
      toast('Please log in or sign up to copy this trip to your account.', { icon: '🔑' })
      navigate('/login', { state: { from: { pathname: `/share/${token}` } } })
      return
    }
    setCloning(true)
    try {
      const cloned = await tripService.cloneTrip(trip.id)
      toast.success('Trip copied to your account! 🎉')
      navigate(`/trips/${cloned.id}`)
    } catch {
      toast.error('Failed to copy trip.')
    } finally {
      setCloning(false)
    }
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this travel itinerary: ${trip?.title || 'Trip'}`)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${trip?.title || 'Trip'} — ${shareUrl}`)}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading shared itinerary…</p>
        </div>
      </div>
    )
  }

  if (error === 'private') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">🔒</div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-2">Private Itinerary</h1>
          <p className="text-neutral-500 text-sm mb-6">This trip is private or the share link has expired.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/community" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              <HiOutlineUsers className="w-4 h-4" /> Explore Community Trips
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🗺️</p>
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-2">Trip Not Found</h1>
          <p className="text-neutral-500 text-sm mb-6">This share link is invalid or has been removed.</p>
          <Link to="/community" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            Explore Community
          </Link>
        </div>
      </div>
    )
  }

  const status = STATUS_CFG[trip.status] || STATUS_CFG.PLANNING
  const start  = fmtDate(trip.startDate)
  const end    = fmtDate(trip.endDate)
  const allActivities = trip.stops?.flatMap(s => s.activities || []) || []
  const totalCost = allActivities.reduce((s, a) => s + (a.cost || 0), 0)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-neutral-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/community" className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors">
              <HiOutlineArrowLeft className="w-3.5 h-3.5" /> Community
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="font-display font-bold text-sm text-neutral-800 truncate max-w-[200px] sm:max-w-xs">
              {trip.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              title="Copy share link"
            >
              {copiedUrl ? <HiOutlineCheck className="w-3.5 h-3.5 text-emerald-600" /> : <HiOutlineShare className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedUrl ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              id="copy-trip-btn"
              onClick={handleCloneTrip}
              disabled={cloning}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <HiOutlineDuplicate className="w-3.5 h-3.5" />
              <span>{cloning ? 'Copying…' : 'Copy Trip'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-950 overflow-hidden text-white">
        {trip.coverImage && (
          <img
            src={trip.coverImage.startsWith('http') ? trip.coverImage : `http://localhost:5000${trip.coverImage}`}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={clsx('px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', status.color)}>
              {status.label}
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white/90">
              Public Itinerary
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-3 tracking-tight">
            {trip.title}
          </h1>

          {trip.description && (
            <p className="text-white/80 text-base max-w-2xl mb-6 leading-relaxed">
              {trip.description}
            </p>
          )}

          {/* Quick Summary Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/80 bg-white/10 backdrop-blur-md rounded-2xl p-4 w-fit">
            {(start || end) && (
              <span className="flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4 text-primary-300" />
                {start && end ? `${start} – ${end}` : start || end}
              </span>
            )}
            {trip.stops?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <HiOutlineLocationMarker className="w-4 h-4 text-primary-300" />
                {trip.stops.length} {trip.stops.length === 1 ? 'Destination' : 'Destinations'}
              </span>
            )}
            {allActivities.length > 0 && (
              <span className="flex items-center gap-1.5">
                <HiOutlineMap className="w-4 h-4 text-primary-300" />
                {allActivities.length} Activities
              </span>
            )}
            {totalCost > 0 && (
              <span className="flex items-center gap-1.5">
                <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-300" />
                Est. ${totalCost.toLocaleString()}
              </span>
            )}
            {trip.user && (
              <span className="flex items-center gap-1.5 pl-2 border-l border-white/20">
                Created by <strong className="text-white">{trip.user.firstName} {trip.user.lastName}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Social Sharing & Action Bar ── */}
      <div className="bg-white border-b border-neutral-100 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Share this itinerary:</span>
            <button
              onClick={shareToTwitter}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors"
            >
              Twitter / X
            </button>
            <button
              onClick={shareToWhatsApp}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={shareToFacebook}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#4267B2]/10 hover:text-[#4267B2] transition-colors"
            >
              Facebook
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              {copiedUrl ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/community" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
              <HiOutlineGlobe className="w-3.5 h-3.5" /> Browse more trips
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Content: Itinerary Stops ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1 w-full">

        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="bg-white rounded-3xl border border-neutral-100 p-14 text-center shadow-card">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-semibold text-neutral-700 text-lg">No stops added yet</p>
            <p className="text-neutral-400 text-sm mt-1">The creator hasn't published any stops for this trip yet.</p>
          </div>
        ) : (
          trip.stops.map((stop, stopIdx) => {
            const activities = stop.activities || []
            const grouped    = groupActivities(activities)
            const stopCost   = activities.reduce((s, a) => s + (a.cost || 0), 0)

            return (
              <div key={stop.id} className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden transition-all hover:shadow-card-md">
                {/* Stop Header */}
                <div className="bg-gradient-to-r from-primary-50/80 via-emerald-50/50 to-transparent border-b border-neutral-100 px-6 py-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-primary-600 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {stopIdx + 1}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl text-neutral-900">{stop.city}</h2>
                      {stop.country && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1 font-medium mt-0.5">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5 text-primary-500" />
                          {[stop.state, stop.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {(stop.startDate || stop.endDate) && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <HiOutlineCalendar className="w-3.5 h-3.5" />
                          {fmtDate(stop.startDate)}{stop.endDate ? ` – ${fmtDate(stop.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-neutral-400 font-medium">{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</p>
                    {stopCost > 0 && (
                      <p className="text-sm font-bold text-neutral-800 flex items-center gap-0.5 justify-end mt-0.5">
                        <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-600" />${stopCost.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stop Notes */}
                {stop.notes && (
                  <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-100 text-xs text-amber-800 flex items-start gap-2">
                    <span>💡</span>
                    <span className="italic">{stop.notes}</span>
                  </div>
                )}

                {/* Activities List */}
                <div className="p-6">
                  {activities.length === 0 ? (
                    <p className="text-center text-neutral-400 text-sm py-4">No activities scheduled yet for {stop.city}.</p>
                  ) : (
                    <div className="space-y-6">
                      {grouped.map(([dateKey, acts]) => (
                        <div key={dateKey}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                              {dateKey === 'unscheduled' ? 'Unscheduled' : fmtLong(dateKey)}
                            </span>
                            <div className="flex-1 h-px bg-neutral-100" />
                          </div>
                          <div className="space-y-2.5 sm:ml-4">
                            {acts.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map(act => (
                              <div key={act.id} className="flex items-start gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all">
                                <span className="text-2xl shrink-0 p-1 bg-white rounded-xl shadow-xs">{catEmoji[act.category] || '📌'}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-neutral-900">{act.title}</p>
                                    {act.cost > 0 && (
                                      <span className="text-xs font-bold text-emerald-600 shrink-0">
                                        ${act.cost}
                                      </span>
                                    )}
                                  </div>
                                  {act.description && (
                                    <p className="text-xs text-neutral-600 mt-0.5">{act.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                                    {act.startTime && (
                                      <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                                        <HiOutlineClock className="w-3 h-3 text-neutral-400" />
                                        {act.startTime}{act.endTime ? ` – ${act.endTime}` : ''}
                                      </span>
                                    )}
                                    {act.location && (
                                      <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                                        <HiOutlineLocationMarker className="w-3 h-3 text-neutral-400" />
                                        {act.location}
                                      </span>
                                    )}
                                    {act.duration && (
                                      <span className="text-[11px] text-neutral-400 font-medium">⏱️ {act.duration} mins</span>
                                    )}
                                  </div>
                                  {act.notes && (
                                    <p className="text-[11px] text-neutral-500 mt-2 p-2 bg-white rounded-lg border border-neutral-100">
                                      📝 {act.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* ── Call to Action / Copy Trip Card ── */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-center shadow-lg text-white">
          <span className="inline-block text-4xl mb-3">🌍</span>
          <h3 className="font-display font-black text-2xl sm:text-3xl mb-2">Like this itinerary?</h3>
          <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
            Copy this entire trip directly into your GlobeTrotter account. You can customize the dates, activities, budget, and destinations to fit your journey!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCloneTrip}
              disabled={cloning}
              className="px-7 py-3 bg-white text-primary-700 rounded-2xl font-bold text-sm hover:bg-primary-50 shadow-md transition-all active:scale-95"
            >
              {cloning ? 'Copying…' : 'Copy Trip to My Account'}
            </button>
            <Link to="/community">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-sm backdrop-blur-sm transition-all">
                Browse More Trips
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs text-neutral-400 border-t border-neutral-100 bg-white">
        Shared via <Link to="/" className="text-primary-600 font-bold hover:underline">GlobeTrotter</Link> · Built for modern travelers
      </footer>
    </div>
  )
}

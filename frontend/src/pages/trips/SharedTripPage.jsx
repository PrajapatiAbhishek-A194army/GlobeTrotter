import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock,
  HiOutlineCurrencyDollar, HiOutlineMap, HiOutlineGlobe,
  HiOutlineEye, HiOutlineLockClosed,
} from 'react-icons/hi'
import { clsx } from 'clsx'
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
  const [trip,    setTrip]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

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
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            <HiOutlineGlobe className="w-4 h-4" /> Back to GlobeTrotter
          </Link>
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
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            Back to GlobeTrotter
          </Link>
        </div>
      </div>
    )
  }

  const status = STATUS_CFG[trip.status] || STATUS_CFG.PLANNING
  const start  = fmtDate(trip.startDate)
  const end    = fmtDate(trip.endDate)

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-neutral-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-lg text-primary-600 flex items-center gap-2">
            🌍 GlobeTrotter
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <HiOutlineEye className="w-3.5 h-3.5" /> Shared Itinerary
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-neutral-900 to-primary-900 overflow-hidden">
        {trip.coverImage && (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block', status.color)}>
            {status.label}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">{trip.title}</h1>
          {trip.description && (
            <p className="text-white/70 text-base max-w-2xl mb-4">{trip.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
            {(start || end) && (
              <span className="flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4" />
                {start && end ? `${start} – ${end}` : start || end}
              </span>
            )}
            {trip.stops?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <HiOutlineLocationMarker className="w-4 h-4" />
                {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
              </span>
            )}
            {trip.user && (
              <span className="flex items-center gap-1.5">
                <HiOutlineMap className="w-4 h-4" />
                by {trip.user.firstName} {trip.user.lastName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="bg-white rounded-2xl border border-neutral-100 p-14 text-center">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-semibold text-neutral-700">No stops added yet</p>
            <p className="text-neutral-400 text-sm mt-1">The owner hasn't added any destinations to this trip.</p>
          </div>
        ) : (
          trip.stops.map((stop, stopIdx) => {
            const activities = stop.activities || []
            const grouped    = groupActivities(activities)
            const totalCost  = activities.reduce((s, a) => s + (a.cost || 0), 0)

            return (
              <div key={stop.id} className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
                {/* Stop header */}
                <div className="bg-gradient-to-r from-primary-50 to-emerald-50 border-b border-neutral-100 px-6 py-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {stopIdx + 1}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-neutral-900">{stop.city}</h2>
                      {stop.country && (
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                          {[stop.state, stop.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {(stop.startDate || stop.endDate) && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <HiOutlineCalendar className="w-3 h-3" />
                          {fmtDate(stop.startDate)}{stop.endDate ? ` – ${fmtDate(stop.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-neutral-400">{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</p>
                    {totalCost > 0 && (
                      <p className="text-sm font-semibold text-neutral-700 flex items-center gap-0.5 justify-end mt-0.5">
                        <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />{totalCost.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stop notes */}
                {stop.notes && (
                  <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 italic">
                    📝 {stop.notes}
                  </div>
                )}

                {/* Activities */}
                <div className="p-6">
                  {activities.length === 0 ? (
                    <p className="text-center text-neutral-400 text-sm py-6">No activities planned for this stop.</p>
                  ) : (
                    <div className="space-y-6">
                      {grouped.map(([dateKey, acts]) => (
                        <div key={dateKey}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                              {dateKey === 'unscheduled' ? 'Unscheduled' : fmtLong(dateKey)}
                            </span>
                            <div className="flex-1 h-px bg-neutral-100" />
                          </div>
                          <div className="space-y-2 ml-4">
                            {acts.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map(act => (
                              <div key={act.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                <span className="text-lg shrink-0">{catEmoji[act.category] || '📌'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-neutral-900">{act.title}</p>
                                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                    {act.startTime && (
                                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                                        <HiOutlineClock className="w-3 h-3" />
                                        {act.startTime}{act.endTime ? ` – ${act.endTime}` : ''}
                                      </span>
                                    )}
                                    {act.location && (
                                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                                        <HiOutlineLocationMarker className="w-3 h-3" />{act.location}
                                      </span>
                                    )}
                                    {act.cost > 0 && (
                                      <span className="flex items-center gap-0.5 text-xs text-neutral-400">
                                        <HiOutlineCurrencyDollar className="w-3 h-3" />{act.cost}
                                      </span>
                                    )}
                                    {act.duration && (
                                      <span className="text-xs text-neutral-400">{act.duration}min</span>
                                    )}
                                  </div>
                                  {act.notes && <p className="text-xs text-neutral-400 mt-1 italic">{act.notes}</p>}
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

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-8 text-center">
          <p className="text-3xl mb-3">✈️</p>
          <h3 className="font-display font-black text-xl text-white mb-2">Plan Your Own Adventure</h3>
          <p className="text-white/80 text-sm mb-5">GlobeTrotter helps you build beautiful itineraries, track budgets, and share trips with friends.</p>
          <Link to="/signup">
            <button className="px-7 py-3 bg-white text-primary-700 rounded-2xl font-semibold text-sm hover:bg-primary-50 transition-all shadow-md">
              Start for Free
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-neutral-400 border-t border-neutral-100 mt-4">
        Shared via <Link to="/" className="text-primary-500 font-semibold">GlobeTrotter</Link> · Plan your next adventure
      </footer>
    </div>
  )
}

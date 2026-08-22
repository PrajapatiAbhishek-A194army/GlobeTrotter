import { Link } from 'react-router-dom'
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi'
import { clsx } from 'clsx'
import TripStatusBadge from './TripStatusBadge'

const TRIP_EMOJIS = ['🌍', '✈️', '🏖️', '🏔️', '🗺️', '🌿', '🏯', '🚂', '🛳️', '🌸']

function getEmoji(str) {
  // deterministic emoji from title string
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return TRIP_EMOJIS[Math.abs(hash) % TRIP_EMOJIS.length]
}

function formatDateRange(start, end) {
  if (!start) return 'Dates TBD'
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (!end) return s
  const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${s} – ${e}`
}

function calcDays(start, end) {
  if (!start || !end) return null
  const diff = Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

/**
 * TripCard — full-featured card, used on /trips list
 * @param {object} trip
 * @param {'grid'|'list'} layout
 */
export default function TripCard({ trip, layout = 'grid' }) {
  const emoji = getEmoji(trip.title)
  const dateRange = formatDateRange(trip.startDate, trip.endDate)
  const days = calcDays(trip.startDate, trip.endDate)
  const stopCount = trip._count?.stops ?? trip.stops?.length ?? 0
  const budget = trip.budget

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const coverSrc = trip.coverImage
    ? (trip.coverImage.startsWith('http') ? trip.coverImage : `${API_BASE}${trip.coverImage}`)
    : null

  if (layout === 'list') {
    return (
      <Link
        to={`/trips/${trip.id}`}
        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-150"
      >
        <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-150 overflow-hidden">
          {coverSrc ? (
            <img src={coverSrc} alt={trip.title} className="w-full h-full object-cover" />
          ) : (
            <span>{emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 text-sm truncate group-hover:text-primary-700 transition-colors">
            {trip.title}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineCalendar className="w-3 h-3" /> {dateRange}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineLocationMarker className="w-3 h-3" /> {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
            </span>
          </div>
        </div>
        <TripStatusBadge status={trip.status} size="sm" />
      </Link>
    )
  }

  // Grid card
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-card hover:shadow-card-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Cover image / gradient */}
      <div className="relative h-40 overflow-hidden shrink-0">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 via-primary-100 to-emerald-50 flex items-center justify-center text-5xl">
            {emoji}
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <TripStatusBadge status={trip.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-display font-semibold text-neutral-900 text-base truncate group-hover:text-primary-700 transition-colors">
            {trip.title}
          </h3>
          {trip.description && (
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{trip.description}</p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={clsx('flex items-center gap-1 text-xs text-neutral-500')}>
            <HiOutlineCalendar className="w-3.5 h-3.5 shrink-0" /> {dateRange}
          </span>
          {days && (
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <HiOutlineClock className="w-3.5 h-3.5 shrink-0" /> {days}d
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" /> {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
          </span>
        </div>

        {/* Stops chips */}
        {trip.stops?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {trip.stops.slice(0, 3).map((s) => (
              <span key={s.id} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                {s.city}
              </span>
            ))}
            {trip.stops.length > 3 && (
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-400 rounded-full text-xs">
                +{trip.stops.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Budget footer */}
        {budget && budget.totalBudget > 0 && (
          <div className="flex items-center gap-1 text-xs text-neutral-400 border-t border-neutral-50 pt-2 mt-auto">
            <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />
            Budget: {budget.currency} {budget.totalBudget.toLocaleString()}
          </div>
        )}
      </div>
    </Link>
  )
}

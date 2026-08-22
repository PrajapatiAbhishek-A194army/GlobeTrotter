import { Link } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineCalendar, HiArrowRight, HiOutlinePlus } from 'react-icons/hi'
import { clsx } from 'clsx'

const statusConfig = {
  PLANNING:  { label: 'Planning',  color: 'bg-neutral-100 text-neutral-600' },
  UPCOMING:  { label: 'Upcoming',  color: 'bg-blue-100 text-blue-700' },
  ONGOING:   { label: 'Ongoing',   color: 'bg-primary-100 text-primary-700' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
}

const mockTrips = [
  { id: '1', title: 'Japan Adventure', status: 'UPCOMING', startDate: '2026-09-15', endDate: '2026-09-28', _count: { stops: 3 }, emoji: '🏯' },
  { id: '2', title: 'Europe Road Trip', status: 'PLANNING', startDate: null, endDate: null, _count: { stops: 5 }, emoji: '🚗' },
  { id: '3', title: 'Bali Getaway',     status: 'COMPLETED', startDate: '2026-07-01', endDate: '2026-07-10', _count: { stops: 2 }, emoji: '🌴' },
]

function TripCard({ trip }) {
  const cfg  = statusConfig[trip.status] || statusConfig.PLANNING
  const date = trip.startDate
    ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Dates TBD'

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-150"
    >
      {/* Emoji icon */}
      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-150">
        {trip.emoji || '✈️'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 text-sm truncate group-hover:text-primary-700 transition-colors">
          {trip.title}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <HiOutlineCalendar className="w-3 h-3" />
            {date}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <HiOutlineLocationMarker className="w-3 h-3" />
            {trip._count?.stops ?? 0} {trip._count?.stops === 1 ? 'stop' : 'stops'}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0', cfg.color)}>
        {cfg.label}
      </span>
    </Link>
  )
}

export default function UpcomingTrips({ trips = [], loading }) {
  const displayTrips = trips.length ? trips : mockTrips

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-neutral-900 text-lg">My Trips</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Your planned & upcoming adventures</p>
        </div>
        <Link
          to="/trips"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all <HiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-11 h-11 bg-neutral-200 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-neutral-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-neutral-100 rounded animate-pulse w-1/2" />
              </div>
              <div className="w-16 h-5 bg-neutral-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : displayTrips.length === 0 ? (
        /* Empty state */
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">✈️</div>
          <p className="font-semibold text-neutral-700 text-sm mb-1">No trips yet</p>
          <p className="text-neutral-400 text-xs mb-4">Plan your first adventure today!</p>
          <Link to="/trips/new">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
              <HiOutlinePlus className="w-3.5 h-3.5" />
              Create First Trip
            </button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-50">
          {displayTrips.slice(0, 5).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

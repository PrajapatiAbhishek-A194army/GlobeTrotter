import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlinePlus } from 'react-icons/hi'
import TripCard from '../../../components/ui/TripCard'

export default function UpcomingTrips({ trips = [], loading }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-neutral-900 text-lg">My Trips</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Your planned &amp; upcoming adventures</p>
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
      ) : trips.length === 0 ? (
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
          {trips.slice(0, 5).map((trip) => (
            <TripCard key={trip.id} trip={trip} layout="list" />
          ))}
        </div>
      )}
    </div>
  )
}


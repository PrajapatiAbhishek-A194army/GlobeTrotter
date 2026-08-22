import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineMap, HiOutlineCalendar, HiOutlineLocationMarker,
  HiOutlinePlus, HiOutlineArrowRight, HiOutlineClock,
  HiOutlineCurrencyDollar, HiOutlineEye,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import * as tripService from '../../services/trip.service'

export default function GlobalItineraryPage() {
  const [trips,   setTrips]   = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tripService.getTrips({ limit: 50 })
      const fullTrips = await Promise.all(
        (res.trips || []).map(t => tripService.getTripById(t.id).catch(() => t))
      )
      setTrips(fullTrips)
    } catch {
      toast.error('Failed to load itineraries.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
              <span className="p-2 bg-primary-100 text-primary-700 rounded-2xl text-xl">🗺️</span>
              Itinerary Builder & Hub
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Organize multi-city routes, daily schedules, and activity timelines for all your trips.
            </p>
          </div>
          <Link to="/trips/new">
            <Button variant="primary" size="md" leftIcon={<HiOutlinePlus className="w-4 h-4" />}>
              Create New Trip
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 text-center text-neutral-400">Loading your itineraries…</div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-neutral-100 shadow-card text-center">
            <div className="text-5xl mb-3">🌍</div>
            <h3 className="font-display font-bold text-xl text-neutral-800">No itineraries yet</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto mt-1 mb-6">
              Create a trip to begin building your day-by-day itineraries and stops.
            </p>
            <Link to="/trips/new">
              <Button variant="primary">Start Your First Itinerary</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map(trip => {
              const stops = trip.stops || []
              const totalActivities = stops.flatMap(s => s.activities || []).length

              return (
                <div key={trip.id} className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden transition-all hover:shadow-card-md">
                  {/* Trip Header Banner */}
                  <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20">
                          {trip.status}
                        </span>
                        {trip.startDate && (
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            <HiOutlineCalendar className="w-3.5 h-3.5" />
                            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {trip.endDate && ` – ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display font-black text-2xl text-white">{trip.title}</h2>
                      {trip.description && (
                        <p className="text-xs text-white/70 mt-1 line-clamp-1 max-w-xl">{trip.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/trips/${trip.id}/itinerary`}>
                        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                          <HiOutlineMap className="w-4 h-4" />
                          <span>Open Itinerary Builder</span>
                          <HiOutlineArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Stops Sequence */}
                  <div className="p-6">
                    {stops.length === 0 ? (
                      <div className="py-6 text-center text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                        <p className="text-xs font-medium">No stops added to this trip yet.</p>
                        <Link to={`/trips/${trip.id}/itinerary`} className="text-xs font-bold text-primary-600 hover:underline mt-1 inline-block">
                          + Add first city / destination stop
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Route Stops ({stops.length} cities · {totalActivities} activities)
                          </p>
                          <Link to={`/trips/${trip.id}/itinerary`} className="text-xs font-semibold text-primary-600 hover:underline">
                            Edit Timeline →
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stops.map((stop, sIdx) => {
                            const actList = stop.activities || []
                            return (
                              <div key={stop.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                                      {sIdx + 1}
                                    </span>
                                    <span className="text-[11px] font-semibold text-neutral-400">
                                      {actList.length} {actList.length === 1 ? 'activity' : 'activities'}
                                    </span>
                                  </div>
                                  <h4 className="font-display font-bold text-base text-neutral-900">{stop.city}</h4>
                                  <p className="text-xs text-neutral-400">{stop.country || stop.state || 'Destination'}</p>
                                </div>

                                {actList.length > 0 && (
                                  <div className="mt-3 pt-2 border-t border-neutral-200/60 space-y-1">
                                    {actList.slice(0, 2).map((a, aIdx) => (
                                      <p key={aIdx} className="text-[11px] text-neutral-600 truncate flex items-center gap-1">
                                        <span>•</span> {a.title}
                                      </p>
                                    ))}
                                    {actList.length > 2 && (
                                      <p className="text-[10px] text-neutral-400 font-medium">+{actList.length - 2} more</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

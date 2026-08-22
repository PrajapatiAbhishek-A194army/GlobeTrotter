import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlineAdjustments,
  HiOutlineViewGrid, HiOutlineViewList, HiOutlineMap,
} from 'react-icons/hi'
import AppLayout from '../../layouts/AppLayout'
import TripCard from '../../components/ui/TripCard'
import * as tripService from '../../services/trip.service'

const STATUS_TABS = [
  { value: '',          label: 'All Trips' },
  { value: 'PLANNING',  label: 'Planning' },
  { value: 'UPCOMING',  label: 'Upcoming' },
  { value: 'ONGOING',   label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
]

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden animate-pulse">
      <div className="h-40 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-neutral-100 rounded-full" />
          <div className="h-5 w-14 bg-neutral-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function TripsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trips,    setTrips]   = useState([])
  const [total,    setTotal]   = useState(0)
  const [loading,  setLoading] = useState(true)
  const [layout,   setLayout]  = useState('grid') // 'grid' | 'list'

  const status = searchParams.get('status') || ''
  const search = searchParams.get('search') || ''

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (status) params.status = status
      if (search) params.search = search
      const result = await tripService.getTrips(params)
      setTrips(result.trips)
      setTotal(result.total)
    } catch {
      setTrips([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [status, search])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl text-neutral-900">My Trips</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {loading ? 'Loading…' : `${total} ${total === 1 ? 'trip' : 'trips'} total`}
            </p>
          </div>
          <Link to="/trips/new">
            <button
              id="create-trip-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-green-glow active:scale-[0.98]"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Plan New Trip
            </button>
          </Link>
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Status tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                id={`filter-${tab.value || 'all'}`}
                onClick={() => setFilter('status', tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  status === tab.value
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="trip-search"
              type="text"
              placeholder="Search trips…"
              defaultValue={search}
              onChange={(e) => {
                // Debounced via key
                clearTimeout(window._searchTimer)
                window._searchTimer = setTimeout(() => setFilter('search', e.target.value), 350)
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-1 border border-neutral-200 rounded-xl p-1">
            <button
              id="layout-grid"
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-all ${layout === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-700'}`}
              title="Grid view"
            >
              <HiOutlineViewGrid className="w-4 h-4" />
            </button>
            <button
              id="layout-list"
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-all ${layout === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-700'}`}
              title="List view"
            >
              <HiOutlineViewList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Trips Grid / List ── */}
        {loading ? (
          <div className={layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'space-y-3'
          }>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : trips.length === 0 ? (
          /* ── Empty State ── */
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-5xl mb-5">
              <HiOutlineMap className="w-10 h-10 text-primary-300" />
            </div>
            <h2 className="font-display font-bold text-xl text-neutral-800 mb-2">
              {search || status ? 'No trips found' : 'No trips yet'}
            </h2>
            <p className="text-neutral-500 text-sm max-w-xs mb-6">
              {search || status
                ? 'Try adjusting your filters or search term.'
                : 'Start planning your first adventure. The world is waiting!'}
            </p>
            {!search && !status && (
              <Link to="/trips/new">
                <button
                  id="empty-create-trip-btn"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-green-glow"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Plan My First Trip
                </button>
              </Link>
            )}
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card divide-y divide-neutral-50">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} layout="list" />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

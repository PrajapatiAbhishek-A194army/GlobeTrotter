import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlineShare,
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock,
  HiOutlineCurrencyDollar, HiOutlineMap, HiOutlineGlobe, HiOutlineLockClosed,
  HiOutlineChevronRight, HiOutlineClipboardList,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import TripStatusBadge from '../../components/ui/TripStatusBadge'
import Button from '../../components/ui/Button'
import ShareTripModal from '../../components/trips/ShareTripModal'
import * as tripService from '../../services/trip.service'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

function SkeletonHero() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-56 bg-neutral-200 rounded-3xl" />
      <div className="h-6 bg-neutral-200 rounded w-1/2" />
      <div className="h-4 bg-neutral-100 rounded w-1/3" />
    </div>
  )
}

function InfoPill({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1">
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </span>
  )
}

function StopRow({ stop, index }) {
  const actCount = stop.activities?.length ?? 0
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 rounded-xl transition-colors group">
      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-600 shrink-0">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 text-sm truncate">{stop.city}</p>
        {(stop.country || stop.state) && (
          <p className="text-xs text-neutral-400">{[stop.state, stop.country].filter(Boolean).join(', ')}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {stop.startDate && (
          <span className="text-xs text-neutral-400">
            {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
          {actCount} {actCount === 1 ? 'activity' : 'activities'}
        </span>
        <HiOutlineChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-400 transition-colors" />
      </div>
    </div>
  )
}

export default function TripDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [trip,     setTrip]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal,    setShowShareModal]    = useState(false)

  useEffect(() => {
    tripService.getTripById(id)
      .then(setTrip)
      .catch(() => { toast.error('Trip not found.'); navigate('/trips') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await tripService.deleteTrip(id)
      toast.success('Trip deleted.')
      navigate('/trips')
    } catch {
      toast.error('Failed to delete trip.')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const formatDateRange = (start, end) => {
    if (!start) return 'Dates TBD'
    const s = new Date(start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    if (!end) return s
    const e = new Date(end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return `${s} – ${e}`
  }

  const calcDays = (start, end) => {
    if (!start || !end) return null
    return Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
  }

  const coverSrc = trip?.coverImage
    ? (trip.coverImage.startsWith('http') ? trip.coverImage : `${API_BASE}${trip.coverImage}`)
    : null

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back */}
        <button
          id="back-to-trips"
          onClick={() => navigate('/trips')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors group"
        >
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          My Trips
        </button>

        {loading ? (
          <SkeletonHero />
        ) : (
          <>
            {/* ── Hero ── */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-50 to-emerald-50">
              {coverSrc ? (
                <div className="relative h-56 sm:h-72">
                  <img src={coverSrc} alt={trip.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <TripStatusBadge status={trip.status} />
                    <h1 className="font-display font-bold text-3xl text-white mt-2 drop-shadow">{trip.title}</h1>
                    {trip.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">{trip.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <TripStatusBadge status={trip.status} />
                  <h1 className="font-display font-bold text-3xl text-neutral-900 mt-2">{trip.title}</h1>
                  {trip.description && (
                    <p className="text-neutral-500 text-sm mt-2 max-w-xl">{trip.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* ── Action Bar ── */}
            <div className="flex items-center gap-2 flex-wrap justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/trips/${id}/edit`}>
                  <Button id="edit-trip-btn" variant="secondary" size="sm" leftIcon={<HiOutlinePencil className="w-3.5 h-3.5" />}>
                    Edit Trip
                  </Button>
                </Link>
                <Link to={`/trips/${id}/itinerary`}>
                  <Button id="itinerary-btn" variant="ghost" size="sm" leftIcon={<HiOutlineClipboardList className="w-3.5 h-3.5" />}>
                    Itinerary
                  </Button>
                </Link>
                <Link to={`/trips/${id}/budget`}>
                  <Button id="budget-btn" variant="ghost" size="sm" leftIcon={<HiOutlineCurrencyDollar className="w-3.5 h-3.5" />}>
                    Budget
                  </Button>
                </Link>
                <Link to={`/trips/${id}/calendar`}>
                  <Button id="calendar-btn" variant="ghost" size="sm" leftIcon={<HiOutlineCalendar className="w-3.5 h-3.5" />}>
                    Calendar
                  </Button>
                </Link>
                <Button id="share-btn" variant="ghost" size="sm" leftIcon={<HiOutlineShare className="w-3.5 h-3.5" />} onClick={handleShare}>
                  Share
                </Button>
              </div>
              <Button
                id="delete-trip-btn"
                variant="ghost"
                size="sm"
                leftIcon={<HiOutlineTrash className="w-3.5 h-3.5" />}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>

            {/* ── Info pills ── */}
            <div className="flex flex-wrap gap-2">
              <InfoPill icon={HiOutlineCalendar} label={formatDateRange(trip.startDate, trip.endDate)} />
              {calcDays(trip.startDate, trip.endDate) && (
                <InfoPill icon={HiOutlineClock} label={`${calcDays(trip.startDate, trip.endDate)} days`} />
              )}
              <InfoPill
                icon={HiOutlineLocationMarker}
                label={`${trip.stops?.length ?? 0} ${trip.stops?.length === 1 ? 'stop' : 'stops'}`}
              />
              {trip.budget?.totalBudget > 0 && (
                <InfoPill
                  icon={HiOutlineCurrencyDollar}
                  label={`${trip.budget.currency} ${trip.budget.totalBudget.toLocaleString()}`}
                />
              )}
              <InfoPill
                icon={trip.isPublic ? HiOutlineGlobe : HiOutlineLockClosed}
                label={trip.isPublic ? 'Public' : 'Private'}
              />
            </div>

            {/* ── Stops Section ── */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-neutral-900 text-lg flex items-center gap-2">
                  <HiOutlineMap className="w-5 h-5 text-primary-500" />
                  Stops & Destinations
                </h2>
                <Link to={`/trips/${id}/itinerary`}>
                  <button
                    id="add-stops-btn"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    + Add stops
                  </button>
                </Link>
              </div>

              {trip.stops?.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🗺️</div>
                  <p className="font-semibold text-neutral-700 text-sm mb-1">No stops yet</p>
                  <p className="text-neutral-400 text-xs mb-4">Add destinations to build your itinerary.</p>
                  <Link to={`/trips/${id}/itinerary`}>
                    <button
                      id="open-itinerary-builder-btn"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Open Itinerary Builder
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-50">
                  {trip.stops.map((stop, i) => (
                    <StopRow key={stop.id} stop={stop} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Budget Summary ── */}
            {trip.budget && trip.budget.totalBudget > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-neutral-900 text-lg flex items-center gap-2">
                    <HiOutlineCurrencyDollar className="w-5 h-5 text-primary-500" />
                    Budget Summary
                  </h2>
                  <Link to={`/trips/${id}/budget`}>
                    <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                      Manage budget
                    </button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Total Budget', trip.budget.totalBudget],
                    ['Transport',    trip.budget.transport],
                    ['Accommodation',trip.budget.accommodation],
                    ['Meals',        trip.budget.meals],
                    ['Activities',   trip.budget.activities],
                    ['Other',        trip.budget.other],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-xs text-neutral-400 mb-1">{label}</p>
                      <p className="font-bold text-neutral-900 text-base">
                        {trip.budget.currency} {(val || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-2xl">🗑️</div>
            <div className="text-center">
              <h3 className="font-display font-bold text-lg text-neutral-900">Delete this trip?</h3>
              <p className="text-sm text-neutral-500 mt-1">
                This will permanently delete <strong>{trip?.title}</strong> and all its stops, activities, and budget data. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                id="cancel-delete-btn"
                variant="ghost"
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                id="confirm-delete-btn"
                variant="danger"
                fullWidth
                isLoading={deleting}
                onClick={handleDelete}
              >
                Delete Trip
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Modal ── */}
      <ShareTripModal
        trip={trip}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onUpdateTrip={(updated) => setTrip(updated)}
      />
    </AppLayout>
  )
}

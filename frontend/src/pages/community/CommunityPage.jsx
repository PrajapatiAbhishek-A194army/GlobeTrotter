import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineSearch, HiOutlineGlobe, HiOutlineLocationMarker,
  HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineUsers,
  HiOutlineHeart, HiOutlineShare, HiOutlineDuplicate, HiOutlineRefresh,
  HiOutlineEye, HiOutlineMap,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import { useAuth } from '../../context/AuthContext'
import * as tripService from '../../services/trip.service'

const STATUS_COLORS = {
  PLANNING:  'bg-neutral-100 text-neutral-600',
  UPCOMING:  'bg-blue-100 text-blue-700',
  ONGOING:   'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-primary-100 text-primary-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

// ── Social share helpers ───────────────────────────────────────────────────────
function shareToTwitter(url, title) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this trip: ${title}`)}&url=${encodeURIComponent(url)}`, '_blank')
}
function shareToWhatsApp(url, title) {
  window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank')
}
function shareToFacebook(url) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

// ── Trip Card ──────────────────────────────────────────────────────────────────
function PublicTripCard({ trip, onClone }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const shareUrl = `${window.location.origin}/share/${trip.shareToken}`
  const cities = trip.stops?.map(s => s.city).filter(Boolean)
  const [copying, setCopying] = useState(false)

  const handleCopy = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    setCopying(true)
    try {
      await onClone(trip.id)
      toast.success('Trip copied to your account! 🎉')
    } catch { toast.error('Failed to copy trip.') }
    finally { setCopying(false) }
  }

  const handleShareLink = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied!')
  }

  return (
    <Link to={`/share/${trip.shareToken}`} className="group">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden hover:shadow-card-md transition-all duration-300 h-full flex flex-col">
        {/* Cover */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-100 to-emerald-100">
          {trip.coverImage ? (
            <img src={trip.coverImage.startsWith('http') ? trip.coverImage : `http://localhost:5000${trip.coverImage}`}
              alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌍</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Status badge */}
          <span className={clsx('absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', STATUS_COLORS[trip.status])}>
            {trip.status}
          </span>

          {/* Quick actions overlay */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleShareLink} className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-600 transition-colors" title="Copy link">
              <HiOutlineShare className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleCopy} disabled={copying} className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-600 transition-colors" title="Copy trip to my account">
              <HiOutlineDuplicate className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Author + cities */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display font-bold text-white text-base line-clamp-1 drop-shadow">{trip.title}</h3>
            {cities && cities.length > 0 && (
              <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                <HiOutlineLocationMarker className="w-3 h-3 shrink-0" />
                {cities.slice(0, 3).join(' → ')}{cities.length > 3 ? ` +${cities.length - 3}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col">
          {trip.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 mb-3">{trip.description}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400 mt-auto">
            {trip.startDate && (
              <span className="flex items-center gap-1">
                <HiOutlineCalendar className="w-3 h-3" />
                {fmtDate(trip.startDate)}{trip.endDate ? ` – ${fmtDate(trip.endDate)}` : ''}
              </span>
            )}
            {trip._count?.stops > 0 && (
              <span className="flex items-center gap-1">
                <HiOutlineMap className="w-3 h-3" />
                {trip._count.stops} {trip._count.stops === 1 ? 'stop' : 'stops'}
              </span>
            )}
            {trip.budget?.totalBudget > 0 && (
              <span className="flex items-center gap-1">
                <HiOutlineCurrencyDollar className="w-3 h-3" />
                {trip.budget.currency} {trip.budget.totalBudget.toLocaleString()}
              </span>
            )}
          </div>

          {/* Author */}
          {trip.user && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center">
                {trip.user.firstName?.[0]}{trip.user.lastName?.[0]}
              </div>
              <span className="text-xs text-neutral-500">{trip.user.firstName} {trip.user.lastName}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 border-t border-neutral-50 bg-neutral-50/50 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold">
            <HiOutlineEye className="w-3.5 h-3.5" /> View Itinerary
          </span>
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.preventDefault(); shareToTwitter(shareUrl, trip.title) }}
              className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-[#1DA1F2] transition-colors" title="Share on Twitter">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" /></svg>
            </button>
            <button onClick={(e) => { e.preventDefault(); shareToWhatsApp(shareUrl, trip.title) }}
              className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-[#25D366] transition-colors" title="Share on WhatsApp">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </button>
            <button onClick={(e) => { e.preventDefault(); shareToFacebook(shareUrl) }}
              className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-[#4267B2] transition-colors" title="Share on Facebook">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [data,    setData]    = useState(null)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tripService.getPublicTrips({ page, limit: 12, search, status })
      setData(res)
    } catch { toast.error('Failed to load community trips.') }
    finally { setLoading(false) }
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const handleClone = async (tripId) => {
    await tripService.cloneTrip(tripId)
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold mb-4">
            <HiOutlineUsers className="w-3.5 h-3.5" /> Community
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900">
            Explore Shared Itineraries
          </h1>
          <p className="text-neutral-500 text-base mt-2">
            Get inspired by real trips from travelers around the world. Copy any trip to your account and make it your own.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1 min-w-48">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="community-search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search trips, cities, destinations…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            />
          </div>
          <select
            id="community-status-filter"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none bg-white"
          >
            <option value="">All Statuses</option>
            {['PLANNING','UPCOMING','ONGOING','COMPLETED'].map(s => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
          <button onClick={load} className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 transition-colors">
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>

        {/* Results count */}
        {data && (
          <p className="text-xs text-neutral-400 text-center">
            {data.total} public {data.total === 1 ? 'trip' : 'trips'} from the community
          </p>
        )}

        {/* Trip Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-72 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data?.trips?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.trips.map(trip => (
              <PublicTripCard key={trip.id} trip={trip} onClone={handleClone} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="font-display font-bold text-xl text-neutral-700">No public trips yet</h3>
            <p className="text-neutral-400 text-sm mt-2 max-w-sm mx-auto">
              Be the first to share your trip! Make any trip public and it will appear here for the community to explore.
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-4">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={clsx('w-9 h-9 rounded-xl text-sm font-semibold transition-all',
                  p === page ? 'bg-primary-600 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-100'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-8 text-center mt-8">
          <HiOutlineGlobe className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h3 className="font-display font-black text-xl text-white mb-2">Share Your Adventures</h3>
          <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
            Make your trip public to inspire other travelers. Your itinerary, budget, and activities will be visible to the community.
          </p>
          <Link to="/trips">
            <button className="px-7 py-3 bg-white text-primary-700 rounded-2xl font-semibold text-sm hover:bg-primary-50 transition-all shadow-md">
              Go to My Trips
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

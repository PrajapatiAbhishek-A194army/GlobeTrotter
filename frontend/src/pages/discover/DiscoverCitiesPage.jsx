import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  HiOutlineSearch, HiOutlineLocationMarker, HiOutlineGlobe,
  HiOutlineFire, HiOutlineStar, HiOutlineCurrencyDollar,
  HiOutlineSun, HiOutlineCalendar, HiOutlinePlus,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import PublicLayout from '../../layouts/PublicLayout'
import * as destService from '../../services/destination.service'
import { useAuth } from '../../context/AuthContext'

const COST_LABEL = (idx) => {
  if (!idx) return null
  if (idx <= 3.5) return { label: '$', tip: 'Budget-friendly' }
  if (idx <= 6)   return { label: '$$', tip: 'Moderate' }
  if (idx <= 8)   return { label: '$$$', tip: 'Pricey' }
  return { label: '$$$$', tip: 'Luxury' }
}

// Shimmer skeleton
function DestinationSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-2/3" />
        <div className="h-3 bg-neutral-100 rounded w-1/3" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 bg-neutral-100 rounded-full" />
          <div className="h-5 w-14 bg-neutral-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function DestinationCard({ dest }) {
  const { isAuthenticated } = useAuth()
  const cost = COST_LABEL(dest.costIndex)

  return (
    <div className="group bg-white rounded-2xl border border-neutral-100 shadow-card hover:shadow-card-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={dest.image || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=75`}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Continent chip */}
        {dest.continent && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-neutral-700 rounded-full">
              {dest.continent}
            </span>
          </div>
        )}

        {/* Cost badge */}
        {cost && (
          <div className="absolute top-3 right-3" title={cost.tip}>
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-xs font-bold text-white rounded-full">
              {cost.label}
            </span>
          </div>
        )}

        {/* City + country */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display font-bold text-xl text-white drop-shadow">{dest.name}</h3>
          <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
            <HiOutlineLocationMarker className="w-3 h-3" /> {dest.country}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {dest.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{dest.description}</p>
        )}

        {/* Tags */}
        {dest.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dest.tags.slice(0, 4).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-full capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-neutral-50">
          {dest.climate && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineSun className="w-3.5 h-3.5" /> {dest.climate}
            </span>
          )}
          {dest.bestMonths?.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineCalendar className="w-3.5 h-3.5" /> Best: {dest.bestMonths.slice(0,2).join(', ')}
            </span>
          )}
          {dest.popularity > 0 && (
            <span className="flex items-center gap-1 text-xs text-neutral-400 ml-auto">
              <HiOutlineFire className="w-3.5 h-3.5 text-orange-400" /> {dest.popularity}
            </span>
          )}
        </div>

        {/* CTA */}
        {isAuthenticated && (
          <Link
            to={`/trips/new`}
            className="mt-1 flex items-center justify-center gap-1.5 w-full px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <HiOutlinePlus className="w-3.5 h-3.5" /> Plan a Trip Here
          </Link>
        )}
      </div>
    </div>
  )
}

export default function DiscoverCitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [continents,   setContinents]   = useState([])
  const [loading,      setLoading]      = useState(true)

  const search    = searchParams.get('q')         || ''
  const continent = searchParams.get('continent') || ''

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (search)    params.search    = search
      if (continent) params.continent = continent
      const [dests, conts] = await Promise.all([
        destService.getDestinations(params),
        continents.length ? Promise.resolve(continents) : destService.getContinents(),
      ])
      setDestinations(dests || [])
      if (!continents.length) setContinents(conts || [])
    } catch {
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }, [search, continent]) // eslint-disable-line

  useEffect(() => { fetchData() }, [search, continent]) // eslint-disable-line

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else     p.delete(key)
    setSearchParams(p)
  }

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/20 border border-primary-400/30 rounded-full text-primary-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <HiOutlineGlobe className="w-3.5 h-3.5" /> City Discovery
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Where Will You Go <span className="text-primary-400">Next?</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-xl mx-auto mb-8">
            Explore handpicked destinations from around the world and start planning your dream trip.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              id="city-search"
              type="text"
              placeholder="Search cities, countries, or tags…"
              defaultValue={search}
              onChange={e => {
                clearTimeout(window._citySearchTimer)
                window._citySearchTimer = setTimeout(() => setFilter('q', e.target.value), 350)
              }}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Continent filter */}
        {continents.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <button
              id="continent-all"
              onClick={() => setFilter('continent', '')}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                !continent ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
              )}
            >
              🌍 All
            </button>
            {continents.map(c => (
              <button
                key={c}
                id={`continent-${c.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setFilter('continent', c === continent ? '' : c)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  continent === c ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-neutral-500">
            {loading ? 'Searching…' : `${destinations.length} destination${destinations.length !== 1 ? 's' : ''} found`}
          </p>
          {(search || continent) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => <DestinationSkeleton key={i} />)}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl">🌐</div>
            <h2 className="font-display font-bold text-xl text-neutral-800 mb-2">No destinations found</h2>
            <p className="text-neutral-500 text-sm mb-5">Try a different search term or clear the filters.</p>
            <button onClick={() => setSearchParams({})} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              Show all destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {destinations.map(dest => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}

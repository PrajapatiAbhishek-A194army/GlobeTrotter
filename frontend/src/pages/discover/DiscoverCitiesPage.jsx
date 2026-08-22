import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineSearch, HiOutlineLocationMarker, HiOutlineGlobe,
  HiOutlineFire, HiOutlineStar, HiOutlineCurrencyDollar,
  HiOutlineSun, HiOutlineCalendar, HiOutlinePlus, HiOutlineViewGrid,
  HiOutlineMap, HiOutlineSparkles, HiOutlineX, HiOutlineBookOpen,
  HiOutlineArrowRight, HiOutlineInformationCircle,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import PublicLayout from '../../layouts/PublicLayout'
import * as destService from '../../services/destination.service'
import { useAuth } from '../../context/AuthContext'

// Custom Leaflet Green Pin Icon
const createCustomIcon = (name) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        background: #15803d;
        color: white;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        border: 2px solid white;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        <span>📍</span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Highlighted active pin icon
const createActivePinIcon = (name) => {
  return L.divIcon({
    className: 'custom-active-pin',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        background: #7c3aed;
        color: white;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 800;
        box-shadow: 0 6px 20px rgba(124,58,237,0.5);
        border: 2.5px solid white;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        <span>✨</span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Helper hook to programmatically move/fly map to coordinates
function MapFlyTo({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 7, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

// Map Click Listener to discover any place clicked on map
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

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

function DestinationCard({ dest, onSelect }) {
  const cost = COST_LABEL(dest.costIndex)

  return (
    <div className="group bg-white rounded-3xl border border-neutral-100 shadow-card hover:shadow-card-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0 bg-neutral-800">
        <img
          src={dest.image || `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=75`}
          alt={dest.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=75'
          }}
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
            <HiOutlineLocationMarker className="w-3.5 h-3.5" /> {dest.country}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {dest.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{dest.description}</p>
        )}

        {/* Tags */}
        {dest.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dest.tags.slice(0, 4).map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-primary-50 text-primary-600 text-xs font-semibold rounded-full capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-neutral-50 text-xs text-neutral-400">
          {dest.climate && (
            <span className="flex items-center gap-1">
              <HiOutlineSun className="w-3.5 h-3.5" /> {dest.climate}
            </span>
          )}
          {dest.bestMonths?.length > 0 && (
            <span className="flex items-center gap-1">
              <HiOutlineCalendar className="w-3.5 h-3.5" /> Best: {dest.bestMonths.slice(0,2).join(', ')}
            </span>
          )}
          {dest.popularity > 0 && (
            <span className="flex items-center gap-1 ml-auto text-orange-500 font-semibold">
              <HiOutlineFire className="w-3.5 h-3.5" /> {dest.popularity}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onSelect?.(dest)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
          >
            <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-600" /> Real Place Info
          </button>
          <Link
            to={`/destinations/${dest.id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
          >
            Guide & Plan →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DiscoverCitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [continents,   setContinents]   = useState([])
  const [loading,      setLoading]      = useState(true)

  // Leaflet Map & Live Place Intelligence State
  const [viewMode, setViewMode] = useState('split') // 'split' | 'grid' | 'map'
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [mapZoom, setMapZoom] = useState(3)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState(null)
  const [loadingPlaceInfo, setLoadingPlaceInfo] = useState(false)
  const searchInputRef = useRef(null)

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

      // If user typed a search, automatically fetch unique place info for that place!
      if (search && search.trim().length >= 2) {
        fetchRealPlaceInfo(search.trim())
      }
    } catch {
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }, [search, continent]) // eslint-disable-line

  useEffect(() => { fetchData() }, [search, continent]) // eslint-disable-line

  // ── Fetch Real Wikipedia Summary & Real Photo for ANY place on Earth ──
  const fetchRealPlaceInfo = async (placeName, coords = null) => {
    setLoadingPlaceInfo(true)
    try {
      // 1. Fetch Wikipedia Summary REST API
      const formatted = encodeURIComponent(placeName.replace(/\s+/g, '_'))
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formatted}`)
      
      if (res.ok) {
        const data = await res.json()
        const lat = coords?.lat || data.coordinates?.lat || mapCenter[0]
        const lon = coords?.lon || data.coordinates?.lon || mapCenter[1]

        setSelectedPlaceInfo({
          name: data.title || placeName,
          subtitle: data.description || 'Global Destination',
          extract: data.extract || 'Explore this unique destination with rich heritage and culture.',
          realImage: data.originalimage?.source || data.thumbnail?.source || `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80`,
          wikiUrl: data.content_urls?.desktop?.page,
          lat: lat,
          lon: lon,
        })

        if (lat && lon) {
          setMapCenter([lat, lon])
          setMapZoom(9)
        }
      } else {
        // Fallback to OpenStreetMap place
        setSelectedPlaceInfo({
          name: placeName,
          subtitle: 'Global Destination',
          extract: `Discover ${placeName} — explore top attractions, plan daily itineraries, and track your travel budget.`,
          realImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&q=80`,
          lat: coords?.lat || mapCenter[0],
          lon: coords?.lon || mapCenter[1],
        })
      }
    } catch {
      // Silent catch
    } finally {
      setLoadingPlaceInfo(false)
    }
  }

  // Autocomplete place suggestions handler
  const handleSearchInput = async (val) => {
    const term = val.trim().toLowerCase()
    if (!term) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // 1. Matches from local seeded destinations
    const localMatches = destinations
      .filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.country.toLowerCase().includes(term) ||
        (d.tags || []).some(t => t.toLowerCase().includes(term))
      )
      .slice(0, 4)
      .map(d => ({
        id: d.id,
        name: d.name,
        country: d.country,
        image: d.image,
        lat: d.latitude,
        lon: d.longitude,
        type: 'destination',
      }))

    // 2. Query OpenStreetMap Nominatim for live global places
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' },
      })
      const osmPlaces = await res.json()
      const osmMatches = (osmPlaces || []).map(p => ({
        id: p.place_id,
        name: p.display_name.split(',')[0],
        country: p.display_name.split(',').slice(-1)[0]?.trim() || '',
        fullAddress: p.display_name,
        lat: parseFloat(p.lat),
        lon: parseFloat(p.lon),
        type: 'place',
      }))

      const combined = [...localMatches, ...osmMatches.filter(o => !localMatches.some(l => l.name.toLowerCase() === o.name.toLowerCase()))]
      setSuggestions(combined)
      setShowSuggestions(true)
    } catch {
      setSuggestions(localMatches)
      setShowSuggestions(localMatches.length > 0)
    }
  }

  const handleSelectSuggestion = (item) => {
    setFilter('q', item.name)
    setShowSuggestions(false)
    fetchRealPlaceInfo(item.name, { lat: item.lat, lon: item.lon })
  }

  // Reverse geocode when clicking on Leaflet map
  const handleMapClick = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' },
      })
      const data = await res.json()
      const placeName = data.address?.city || data.address?.town || data.address?.state || data.address?.country || 'Selected Location'
      fetchRealPlaceInfo(placeName, { lat, lon: lng })
    } catch {
      // ignore
    }
  }

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else     p.delete(key)
    setSearchParams(p)
  }

  const handlePlanTripWithPlace = (place) => {
    navigate('/trips/new', {
      state: {
        destination: {
          name: place.name,
          country: place.subtitle || '',
          description: place.extract || '',
          image: place.realImage,
        }
      }
    })
  }

  // Destinations with coordinates for Leaflet pins
  const mapMarkers = destinations.filter(d => d.latitude && d.longitude)

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/20 border border-primary-400/30 rounded-full text-primary-300 text-xs font-semibold mb-5 backdrop-blur-sm">
            <HiOutlineGlobe className="w-3.5 h-3.5" /> Place Intelligence & Discovery
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-3 leading-tight">
            Discover Real Places & <span className="text-primary-400">Photos</span>
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto mb-7">
            Search any city, monument, or attraction in the world to get real photographs, historical facts, and live map coordinates.
          </p>

          {/* ── Interactive Search Bar with Live Suggestions ── */}
          <div className="max-w-xl mx-auto relative z-30">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                ref={searchInputRef}
                id="city-search"
                type="text"
                placeholder="Search Ahmedabad, Taj Mahal, Paris, Tokyo, Statue of Liberty..."
                defaultValue={search}
                onChange={e => {
                  const val = e.target.value
                  clearTimeout(window._citySearchTimer)
                  window._citySearchTimer = setTimeout(() => {
                    setFilter('q', val)
                    handleSearchInput(val)
                  }, 300)
                }}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                className="w-full pl-12 pr-10 py-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl text-white placeholder-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all shadow-lg font-medium"
              />
              {search && (
                <button
                  onClick={() => { setFilter('q', ''); setSuggestions([]); setShowSuggestions(false); setSelectedPlaceInfo(null) }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-300 hover:text-white rounded-full"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden text-left z-50 animate-scale-up">
                <div className="p-2.5 bg-neutral-50/80 border-b border-neutral-100 text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-500" />
                  Live Places & Landmark Suggestions
                </div>
                <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-3 hover:bg-primary-50/60 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 text-sm">
                            📍
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-neutral-900 group-hover:text-primary-700 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.fullAddress || item.country}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                        {item.type === 'destination' ? 'Guide' : 'Location'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REAL PLACE SPOTLIGHT & LIVE INFORMATION PANEL ── */}
      {selectedPlaceInfo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 mb-8">
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-card-lg overflow-hidden p-6 sm:p-8 animate-fade-in">
            <div className="flex items-start justify-between gap-4 mb-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-primary-100 text-primary-700 rounded-xl text-lg">🌟</span>
                <div>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900">
                    {selectedPlaceInfo.name}
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    {selectedPlaceInfo.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlaceInfo(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                title="Close Spotlight"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Real Photograph */}
              <div className="lg:col-span-5 relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
                <img
                  src={selectedPlaceInfo.realImage}
                  alt={selectedPlaceInfo.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                  📸 Genuine Place Photograph
                </span>
              </div>

              {/* Unique Place Information & Background */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HiOutlineInformationCircle className="w-4 h-4 text-primary-600" />
                    Place Overview & Facts
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                    {selectedPlaceInfo.extract}
                  </p>
                </div>

                {/* Coords & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
                      Coordinates: {selectedPlaceInfo.lat?.toFixed(4)}, {selectedPlaceInfo.lon?.toFixed(4)}
                    </span>
                    {selectedPlaceInfo.wikiUrl && (
                      <a
                        href={selectedPlaceInfo.wikiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <HiOutlineBookOpen className="w-4 h-4" /> Read on Wikipedia ↗
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlanTripWithPlace(selectedPlaceInfo)}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <span>Plan a Trip to {selectedPlaceInfo.name}</span>
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Filters & Controls Bar ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Continent Filters */}
          {continents.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="continent-all"
                onClick={() => setFilter('continent', '')}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                  !continent ? 'bg-primary-600 text-white shadow-xs' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
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
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                    continent === c ? 'bg-primary-600 text-white shadow-xs' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-neutral-100 p-1 rounded-2xl">
            {[
              { id: 'split', label: 'Map & Cards', icon: HiOutlineMap },
              { id: 'grid',  label: 'Grid Cards',  icon: HiOutlineViewGrid },
              { id: 'map',   label: 'Full Map',    icon: HiOutlineGlobe },
            ].map(m => {
              const Icon = m.icon
              const active = viewMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                    active ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <p>{loading ? 'Searching…' : `${destinations.length} destination${destinations.length !== 1 ? 's' : ''} available`}</p>
        </div>
      </section>

      {/* ── Main Content Area: Leaflet Map & Destinations ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Leaflet Interactive Map View ── */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="mb-8 rounded-3xl overflow-hidden border border-neutral-200 shadow-card bg-neutral-100 relative">
            <div className="p-3.5 bg-white/90 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                <HiOutlineMap className="w-4 h-4 text-primary-600" />
                Interactive Leaflet World Map ({mapMarkers.length} locations pinned)
              </span>
              <span className="text-neutral-400">Click any marker or anywhere on the map to explore real place details</span>
            </div>

            <div className={clsx('w-full relative z-0', viewMode === 'map' ? 'h-[580px]' : 'h-[380px]')}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapFlyTo center={mapCenter} zoom={mapZoom} />
                <MapClickHandler onMapClick={handleMapClick} />

                {/* Active selected place marker */}
                {selectedPlaceInfo && selectedPlaceInfo.lat && selectedPlaceInfo.lon && (
                  <Marker
                    position={[selectedPlaceInfo.lat, selectedPlaceInfo.lon]}
                    icon={createActivePinIcon(selectedPlaceInfo.name)}
                  >
                    <Popup>
                      <div className="w-48 p-1">
                        <img src={selectedPlaceInfo.realImage} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                        <h4 className="font-bold text-xs text-neutral-900">{selectedPlaceInfo.name}</h4>
                        <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1">{selectedPlaceInfo.extract}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Pre-seeded destination markers */}
                {mapMarkers.map(d => (
                  <Marker
                    key={d.id}
                    position={[d.latitude, d.longitude]}
                    icon={createCustomIcon(d.name)}
                  >
                    <Popup className="custom-destination-popup">
                      <div className="w-48 overflow-hidden rounded-xl">
                        <div className="h-24 overflow-hidden relative">
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[10px] font-bold">
                            {d.country}
                          </span>
                        </div>
                        <div className="p-2 space-y-1.5">
                          <h4 className="font-bold text-sm text-neutral-900">{d.name}</h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-2">{d.description}</p>
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              onClick={() => fetchRealPlaceInfo(d.name, { lat: d.latitude, lon: d.longitude })}
                              className="text-[11px] font-bold text-primary-600 hover:underline"
                            >
                              Inspect Details →
                            </button>
                            <Link
                              to={`/destinations/${d.id}`}
                              className="text-[11px] font-semibold text-neutral-600 hover:underline"
                            >
                              Guide
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* ── Cards Grid ── */}
        {viewMode !== 'map' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <DestinationSkeleton key={i} />)}
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-card">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-800 mb-1">No destinations found</h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-5">
                  Try searching for another place, like "Ahmedabad", "Taj Mahal", or "Paris".
                </p>
                <button
                  onClick={() => { setFilter('q', ''); setFilter('continent', '') }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    dest={dest}
                    onSelect={(d) => fetchRealPlaceInfo(d.name, { lat: d.latitude, lon: d.longitude })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </section>
    </PublicLayout>
  )
}

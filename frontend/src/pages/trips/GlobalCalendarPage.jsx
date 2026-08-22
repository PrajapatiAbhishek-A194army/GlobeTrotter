import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyDollar,
  HiOutlineMap, HiOutlinePlus, HiOutlineSparkles, HiOutlineArrowRight,
  HiOutlineFlag, HiOutlineEye,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import * as tripService from '../../services/trip.service'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const PALETTE = [
  {
    bg: 'bg-emerald-600',
    light: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    bg: 'bg-blue-600',
    light: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    badge: 'bg-blue-100 text-blue-800',
    border: 'border-blue-400',
    dot: 'bg-blue-500',
  },
  {
    bg: 'bg-purple-600',
    light: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    badge: 'bg-purple-100 text-purple-800',
    border: 'border-purple-400',
    dot: 'bg-purple-500',
  },
  {
    bg: 'bg-amber-600',
    light: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-400',
    dot: 'bg-amber-500',
  },
  {
    bg: 'bg-rose-600',
    light: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    badge: 'bg-rose-100 text-rose-800',
    border: 'border-rose-400',
    dot: 'bg-rose-500',
  },
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstWeekday(year, month) {
  return new Date(year, month, 1).getDay()
}

// Convert Date to YYYY-MM-DD string
function toDateStr(d) {
  if (!d) return null
  const date = new Date(d)
  if (isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

export default function GlobalCalendarPage() {
  const [trips,        setTrips]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selectedTrip, setSelectedTrip] = useState('ALL')

  const today = new Date()
  const todayStr = toDateStr(today)
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayStr)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tripService.getTrips({ limit: 50 })
      const detailPromises = (res.trips || []).map(t => tripService.getTripById(t.id).catch(() => t))
      const fullTrips = await Promise.all(detailPromises)
      setTrips(fullTrips)
    } catch {
      toast.error('Failed to load trips calendar.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  const jumpToMonth = (dateObj) => {
    if (!dateObj) return
    const d = new Date(dateObj)
    if (!isNaN(d.getTime())) {
      setCurrentYear(d.getFullYear())
      setCurrentMonth(d.getMonth())
      setSelectedDate(toDateStr(d))
    }
  }

  const goToToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(todayStr)
  }

  // Filter trips
  const filteredTrips = selectedTrip === 'ALL'
    ? trips
    : trips.filter(t => t.id === selectedTrip)

  // Map trips with color palettes
  const tripColors = {}
  trips.forEach((t, i) => {
    tripColors[t.id] = PALETTE[i % PALETTE.length]
  })

  // Build Day Events map: dateStr -> { journeys: [], activities: [] }
  const eventsByDate = {}

  // 1. Map trip journey spans across each day in date range
  filteredTrips.forEach(trip => {
    const startStr = toDateStr(trip.startDate)
    const endStr   = toDateStr(trip.endDate) || startStr
    const color    = tripColors[trip.id] || PALETTE[0]

    if (startStr) {
      const cur = new Date(startStr + 'T00:00:00')
      const end = new Date(endStr + 'T00:00:00')

      while (cur <= end) {
        const curStr = toDateStr(cur)
        if (!eventsByDate[curStr]) eventsByDate[curStr] = { journeys: [], activities: [] }

        const isStart = curStr === startStr
        const isEnd   = curStr === endStr
        const stopsList = (trip.stops || []).map(s => s.city).filter(Boolean).join(', ')

        eventsByDate[curStr].journeys.push({
          tripId: trip.id,
          tripTitle: trip.title,
          status: trip.status,
          stopsList,
          color,
          isStart,
          isEnd,
        })

        // Add 1 day
        cur.setDate(cur.getDate() + 1)
      }
    }

    // 2. Map individual scheduled activities
    (trip.stops || []).forEach(stop => {
      (stop.activities || []).forEach(act => {
        const actDate = toDateStr(act.date) || startStr
        if (!actDate) return

        if (!eventsByDate[actDate]) eventsByDate[actDate] = { journeys: [], activities: [] }
        eventsByDate[actDate].activities.push({
          ...act,
          tripId: trip.id,
          tripTitle: trip.title,
          city: stop.city,
          color,
        })
      })
    })
  })

  // Generate calendar day cells
  const daysInMonth  = getDaysInMonth(currentYear, currentMonth)
  const firstWeekday = getFirstWeekday(currentYear, currentMonth)
  const calendarCells = []

  for (let i = 0; i < firstWeekday; i++) {
    calendarCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0')
    const dayStr   = String(d).padStart(2, '0')
    const dateKey  = `${currentYear}-${monthStr}-${dayStr}`
    const cellEvents = eventsByDate[dateKey] || { journeys: [], activities: [] }

    calendarCells.push({
      day: d,
      dateKey,
      journeys:   cellEvents.journeys,
      activities: cellEvents.activities,
      hasEvents:  cellEvents.journeys.length > 0 || cellEvents.activities.length > 0,
    })
  }

  // Next upcoming trips sorted by startDate
  const upcomingTrips = [...trips]
    .filter(t => t.startDate)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  const selectedEvents = selectedDate
    ? (eventsByDate[selectedDate] || { journeys: [], activities: [] })
    : { journeys: [], activities: [] }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
              <span className="p-2 bg-primary-100 text-primary-700 rounded-2xl text-xl">🗓️</span>
              Master Travel Calendar
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track your active journeys, upcoming travel dates, and daily activities across all destinations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedTrip}
              onChange={e => setSelectedTrip(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="ALL">All Journeys ({trips.length})</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>

            <Link to="/trips/new">
              <Button variant="primary" size="sm" leftIcon={<HiOutlinePlus className="w-4 h-4" />}>
                Plan Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Main Layout: Calendar + Upcoming Plans Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left 2 Cols: Interactive Calendar */}
          <div className="lg:col-span-2 space-y-6">

            {/* Calendar Controls */}
            <div className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-card flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-black text-xl text-neutral-800">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
                  title="Previous month"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
                  title="Next month"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/80 text-center py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                {DAYS.map(d => <div key={d}>{d}</div>)}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-neutral-100">
                {calendarCells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="min-h-[110px] bg-neutral-50/20 p-2" />
                  }

                  const isToday = cell.dateKey === todayStr
                  const isSelected = cell.dateKey === selectedDate

                  return (
                    <div
                      key={cell.dateKey}
                      onClick={() => setSelectedDate(cell.dateKey)}
                      className={clsx(
                        'min-h-[110px] p-2 transition-all cursor-pointer flex flex-col justify-between group hover:bg-primary-50/20',
                        isSelected && 'bg-primary-50/60 ring-2 ring-primary-500 ring-inset'
                      )}
                    >
                      {/* Top Day Number + Indicator */}
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                          isToday ? 'bg-primary-600 text-white shadow-xs' : 'text-neutral-700 group-hover:text-primary-600'
                        )}>
                          {cell.day}
                        </span>

                        {cell.hasEvents && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600" />
                          </span>
                        )}
                      </div>

                      {/* Journey and Activity Bars */}
                      <div className="space-y-1 my-1">
                        {/* Journey Spans */}
                        {cell.journeys.slice(0, 2).map((j, jIdx) => (
                          <div
                            key={`j-${jIdx}`}
                            className={clsx(
                              'px-1.5 py-0.5 rounded-lg text-[10px] font-bold truncate border flex items-center gap-1',
                              j.color.light
                            )}
                            title={`${j.tripTitle} (${j.stopsList || 'Journey'})`}
                          >
                            <span>✈️</span>
                            <span className="truncate">{j.tripTitle}</span>
                          </div>
                        ))}

                        {/* Activities on this day */}
                        {cell.activities.slice(0, 1).map((a, aIdx) => (
                          <div
                            key={`a-${aIdx}`}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-neutral-100 text-neutral-600 truncate"
                            title={`${a.tripTitle}: ${a.title}`}
                          >
                            • {a.title}
                          </div>
                        ))}

                        {cell.journeys.length + cell.activities.length > 3 && (
                          <p className="text-[9px] text-neutral-400 font-semibold pl-1">
                            +{cell.journeys.length + cell.activities.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
                      <HiOutlineCalendar className="w-5 h-5 text-primary-600" />
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {selectedEvents.journeys.length} active journey · {selectedEvents.activities.length} activities scheduled
                    </p>
                  </div>
                </div>

                {selectedEvents.journeys.length === 0 && selectedEvents.activities.length === 0 ? (
                  <div className="py-6 text-center text-neutral-400 text-sm">
                    <p>No journey or activities scheduled on this day.</p>
                    <p className="text-xs text-neutral-400 mt-1">Select a highlighted day or plan a new trip!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Active Journeys */}
                    {selectedEvents.journeys.map((j, idx) => (
                      <div key={idx} className={clsx('p-4 rounded-2xl border flex items-center justify-between gap-4', j.color.light)}>
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg', j.color.bg)}>
                            ✈️
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-900">{j.tripTitle}</h4>
                            <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1">
                              <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                              {j.stopsList || 'Multi-city itinerary'}
                            </p>
                          </div>
                        </div>

                        <Link to={`/trips/${j.tripId}`}>
                          <button className="px-3.5 py-1.5 bg-white text-neutral-800 rounded-xl text-xs font-bold shadow-xs hover:bg-neutral-50 flex items-center gap-1">
                            <span>Open Trip</span>
                            <HiOutlineArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    ))}

                    {/* Scheduled Activities */}
                    {selectedEvents.activities.map((act, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">📌</span>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-900">{act.title}</h4>
                            <p className="text-xs text-primary-600 font-medium">{act.tripTitle} · {act.city}</p>
                            <div className="flex flex-wrap gap-3 text-[11px] text-neutral-400 mt-1">
                              {act.startTime && (
                                <span className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3" />{act.startTime}</span>
                              )}
                              {act.location && (
                                <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-3 h-3" />{act.location}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {act.cost > 0 && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            ${act.cost}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Upcoming Journeys & Next Plans */}
          <div className="space-y-6">

            {/* Next Plans Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
                  <HiOutlineSparkles className="w-4 h-4 text-primary-600" />
                  Your Journeys & Next Plans
                </h3>
                <span className="text-xs font-semibold text-neutral-400">{upcomingTrips.length} Total</span>
              </div>

              {upcomingTrips.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4">No trips planned yet.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingTrips.map(trip => {
                    const color = tripColors[trip.id] || PALETTE[0]
                    const s = new Date(trip.startDate)
                    const e = trip.endDate ? new Date(trip.endDate) : null

                    return (
                      <div
                        key={trip.id}
                        className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-100 hover:border-neutral-200 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', color.badge)}>
                              {trip.status}
                            </span>
                            <h4 className="font-display font-bold text-sm text-neutral-900 mt-1">
                              {trip.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => jumpToMonth(trip.startDate)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors shrink-0"
                            title="Jump calendar to this month"
                          >
                            View Month →
                          </button>
                        </div>

                        <p className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
                          <HiOutlineCalendar className="w-3.5 h-3.5 text-primary-500" />
                          {s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {e && ` – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>

                        {trip.stops?.length > 0 && (
                          <p className="text-xs text-neutral-400 flex items-center gap-1">
                            <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                            {trip.stops.map(st => st.city).filter(Boolean).join(' → ')}
                          </p>
                        )}

                        <div className="pt-2 flex items-center justify-between border-t border-neutral-200/60 text-xs">
                          <Link to={`/trips/${trip.id}`} className="font-semibold text-primary-600 hover:underline">
                            Trip Details
                          </Link>
                          <Link to={`/trips/${trip.id}/itinerary`} className="text-neutral-500 hover:text-neutral-800">
                            Itinerary ({trip.stops?.length || 0} stops)
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Plan New Journey CTA */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-700 rounded-3xl p-6 text-white shadow-lg space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                🌍
              </div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Plan Your Next Adventure
              </h3>
              <p className="text-white/80 text-xs leading-relaxed">
                Add departure dates and scheduled activities to see them mapped out automatically on your master calendar.
              </p>
              <Link to="/trips/new" className="block pt-1">
                <button className="w-full py-2.5 bg-white text-primary-700 rounded-xl text-xs font-bold shadow-md hover:bg-primary-50 transition-all">
                  + Add New Journey
                </button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  )
}

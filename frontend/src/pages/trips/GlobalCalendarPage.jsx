import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyDollar,
  HiOutlineMap, HiOutlinePlus, HiOutlineFilter,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import * as tripService from '../../services/trip.service'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const TRIP_COLORS = [
  { bg: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700 border-blue-200' },
  { bg: 'bg-emerald-500',light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { bg: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200' },
  { bg: 'bg-amber-500',  light: 'bg-amber-50 text-amber-700 border-amber-200' },
  { bg: 'bg-rose-500',   light: 'bg-rose-50 text-rose-700 border-rose-200' },
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstWeekday(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function GlobalCalendarPage() {
  const [trips,        setTrips]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selectedTrip, setSelectedTrip] = useState('ALL')
  
  const today = new Date()
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tripService.getTrips({ limit: 50 })
      // Fetch full details of trips with stops and activities
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

  const goToToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(today.toISOString().slice(0, 10))
  }

  // Filter trips
  const filteredTrips = selectedTrip === 'ALL'
    ? trips
    : trips.filter(t => t.id === selectedTrip)

  // Map activities by date "YYYY-MM-DD"
  const activitiesByDate = {}
  const tripColorMap = {}

  trips.forEach((t, i) => {
    tripColorMap[t.id] = TRIP_COLORS[i % TRIP_COLORS.length]
  })

  filteredTrips.forEach(trip => {
    (trip.stops || []).forEach(stop => {
      (stop.activities || []).forEach(act => {
        if (!act.date) return
        const dateKey = act.date.slice(0, 10)
        if (!activitiesByDate[dateKey]) activitiesByDate[dateKey] = []
        activitiesByDate[dateKey].push({
          ...act,
          tripTitle: trip.title,
          tripId: trip.id,
          city: stop.city,
          color: tripColorMap[trip.id],
        })
      })
    })
  })

  // Calendar cells
  const daysInMonth  = getDaysInMonth(currentYear, currentMonth)
  const firstWeekday = getFirstWeekday(currentYear, currentMonth)
  const calendarCells = []

  // Empty leading cells
  for (let i = 0; i < firstWeekday; i++) {
    calendarCells.push(null)
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0')
    const dayStr   = String(d).padStart(2, '0')
    const dateKey  = `${currentYear}-${monthStr}-${dayStr}`
    calendarCells.push({
      day: d,
      dateKey,
      activities: activitiesByDate[dateKey] || [],
    })
  }

  // Selected date activities
  const activeDateEvents = selectedDate ? (activitiesByDate[selectedDate] || []) : []

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-2xl text-xl">🗓️</span>
              Master Travel Calendar
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              View scheduled itineraries, departures, and daily activities across all your trips.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedTrip}
              onChange={e => setSelectedTrip(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="ALL">All Trips ({trips.length})</option>
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

        {/* ── Calendar Controls Bar ── */}
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

        {/* ── Calendar Grid ── */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/70 text-center py-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
            {DAYS.map(d => <div key={d}>{d}</div>)}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-neutral-100">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="min-h-[100px] bg-neutral-50/30 p-2" />
              }

              const isToday = cell.dateKey === today.toISOString().slice(0, 10)
              const isSelected = cell.dateKey === selectedDate
              const hasEvents = cell.activities.length > 0

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => setSelectedDate(cell.dateKey)}
                  className={clsx(
                    'min-h-[110px] p-2 transition-all cursor-pointer flex flex-col justify-between group hover:bg-primary-50/30',
                    isSelected && 'bg-primary-50/60 ring-2 ring-primary-500 ring-inset'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      isToday ? 'bg-primary-600 text-white shadow-xs' : 'text-neutral-700 group-hover:text-primary-600'
                    )}>
                      {cell.day}
                    </span>
                    {hasEvents && (
                      <span className="text-[10px] font-semibold text-neutral-400">
                        {cell.activities.length} {cell.activities.length === 1 ? 'act' : 'acts'}
                      </span>
                    )}
                  </div>

                  {/* Activity preview tags */}
                  <div className="space-y-1 my-1">
                    {cell.activities.slice(0, 2).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className={clsx(
                          'px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border',
                          act.color.light
                        )}
                        title={`${act.tripTitle}: ${act.title}`}
                      >
                        {act.title}
                      </div>
                    ))}
                    {cell.activities.length > 2 && (
                      <p className="text-[9px] text-neutral-400 font-medium pl-1">
                        +{cell.activities.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Selected Date Details Section ── */}
        {selectedDate && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
                  <HiOutlineCalendar className="w-5 h-5 text-primary-600" />
                  Scheduled on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <p className="text-xs text-neutral-400">{activeDateEvents.length} activities scheduled</p>
              </div>
            </div>

            {activeDateEvents.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4">No activities planned for this day.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {activeDateEvents.map((act, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
                    <div className={clsx('w-2 h-10 rounded-full shrink-0', act.color.bg)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">{act.title}</h4>
                        {act.cost > 0 && (
                          <span className="text-xs font-bold text-emerald-600">${act.cost}</span>
                        )}
                      </div>
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
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

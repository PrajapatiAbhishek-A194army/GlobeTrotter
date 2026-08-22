import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineLocationMarker,
  HiOutlineCalendar, HiOutlineViewList, HiOutlineViewGrid,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import * as tripService from '../../services/trip.service'

// ── Category config (same as ItineraryPage) ───────────────────────────────────
const catEmoji = {
  SIGHTSEEING: '🏛️', ADVENTURE: '🧗', FOOD_DINING: '🍜', CULTURE: '🎭',
  SHOPPING: '🛍️', TRANSPORT: '🚌', ACCOMMODATION: '🏨', ENTERTAINMENT: '🎡',
  WELLNESS: '🧘', NATURE: '🌿', OTHER: '📌',
}
const catColor = {
  SIGHTSEEING: 'bg-amber-500', ADVENTURE: 'bg-orange-500', FOOD_DINING: 'bg-red-500',
  CULTURE: 'bg-purple-500', SHOPPING: 'bg-pink-500', TRANSPORT: 'bg-blue-500',
  ACCOMMODATION: 'bg-indigo-500', ENTERTAINMENT: 'bg-cyan-500', WELLNESS: 'bg-teal-500',
  NATURE: 'bg-emerald-500', OTHER: 'bg-neutral-400',
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstWeekday(year, month) {
  return new Date(year, month, 1).getDay()
}

// Build flat list of all activities across all stops
function extractActivities(trip) {
  const acts = []
  ;(trip.stops || []).forEach(stop => {
    ;(stop.activities || []).forEach(act => {
      acts.push({ ...act, city: stop.city })
    })
  })
  return acts
}

// Group activities by date string "YYYY-MM-DD"
function groupByDate(activities) {
  const map = {}
  activities.forEach(a => {
    const key = a.date ? a.date.slice(0, 10) : null
    if (!key) return
    if (!map[key]) map[key] = []
    map[key].push(a)
  })
  return map
}

// ── Activity pill ─────────────────────────────────────────────────────────────
function ActivityPill({ act, compact = false }) {
  if (compact) {
    return (
      <div
        title={act.title}
        className={clsx('w-2 h-2 rounded-full shrink-0', catColor[act.category] || catColor.OTHER)}
      />
    )
  }
  return (
    <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all group">
      <span className="text-lg shrink-0">{catEmoji[act.category] || '📌'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{act.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
          {act.startTime && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineClock className="w-3 h-3" />{act.startTime}{act.endTime ? ` – ${act.endTime}` : ''}
            </span>
          )}
          {act.city && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <HiOutlineLocationMarker className="w-3 h-3" />{act.city}
            </span>
          )}
          {act.cost > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-neutral-400">
              <HiOutlineCurrencyDollar className="w-3 h-3" />{act.cost}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Calendar Grid ─────────────────────────────────────────────────────────────
function CalendarGrid({ year, month, actsByDate, selectedDate, onSelectDate }) {
  const daysInMonth   = getDaysInMonth(year, month)
  const firstWeekday  = getFirstWeekday(year, month)
  const today         = new Date()

  const cells = []
  // Blank cells before 1st
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-neutral-400 py-1">{d}</div>
        ))}
      </div>
      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`blank-${idx}`} className="aspect-square" />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const acts = actsByDate[key] || []
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
          const isSelected = selectedDate === key
          const hasActs = acts.length > 0

          return (
            <button
              key={key}
              onClick={() => onSelectDate(isSelected ? null : key)}
              className={clsx(
                'aspect-square flex flex-col items-center justify-start p-1 rounded-xl transition-all text-xs relative',
                isSelected && 'bg-primary-600 text-white shadow-sm',
                !isSelected && isToday && 'ring-2 ring-primary-400 bg-primary-50',
                !isSelected && !isToday && hasActs && 'bg-white border border-neutral-200 hover:border-primary-300',
                !isSelected && !isToday && !hasActs && 'hover:bg-neutral-100 text-neutral-400',
              )}
            >
              <span className={clsx(
                'font-semibold leading-none',
                isSelected ? 'text-white' : isToday ? 'text-primary-700' : 'text-neutral-700'
              )}>
                {day}
              </span>
              {/* Activity dots */}
              {acts.length > 0 && (
                <div className="flex items-center gap-0.5 mt-1 flex-wrap justify-center">
                  {acts.slice(0, 3).map((a, i) => (
                    <ActivityPill key={i} act={a} compact />
                  ))}
                  {acts.length > 3 && (
                    <span className={clsx('text-[9px] font-bold', isSelected ? 'text-white/80' : 'text-neutral-400')}>
                      +{acts.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { id: tripId } = useParams()
  const navigate = useNavigate()

  const [trip,         setTrip]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [view,         setView]         = useState('calendar') // 'calendar' | 'list'
  const [year,         setYear]         = useState(new Date().getFullYear())
  const [month,        setMonth]        = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    tripService.getTripById(tripId)
      .then(t => {
        setTrip(t)
        // Auto-jump to month of first dated activity
        const allActs = extractActivities(t).filter(a => a.date)
        if (allActs.length > 0) {
          allActs.sort((a, b) => a.date.localeCompare(b.date))
          const first = new Date(allActs[0].date)
          setYear(first.getFullYear())
          setMonth(first.getMonth())
        } else if (t.startDate) {
          const s = new Date(t.startDate)
          setYear(s.getFullYear())
          setMonth(s.getMonth())
        }
      })
      .catch(() => { toast.error('Trip not found.'); navigate(`/trips/${tripId}`) })
      .finally(() => setLoading(false))
  }, [tripId, navigate])

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  const allActivities = trip ? extractActivities(trip) : []
  const actsByDate    = groupByDate(allActivities)
  const datedActs     = allActivities.filter(a => a.date).sort((a, b) => {
    const dc = a.date.localeCompare(b.date)
    if (dc !== 0) return dc
    return (a.startTime || '').localeCompare(b.startTime || '')
  })
  const undatedActs = allActivities.filter(a => !a.date)

  const selectedActs = selectedDate ? (actsByDate[selectedDate] || []).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')) : null

  const fmtSelected = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : null

  // Group list-view by date
  const listByDate = {}
  datedActs.forEach(a => {
    const key = a.date.slice(0, 10)
    if (!listByDate[key]) listByDate[key] = []
    listByDate[key].push(a)
  })

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/trips/${tripId}`)}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors group"
            >
              <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div>
              <h1 className="font-display font-bold text-xl text-neutral-900 flex items-center gap-2">
                <HiOutlineCalendar className="w-5 h-5 text-primary-500" />
                {trip?.title || 'Calendar'}
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                {allActivities.length} activities across {trip?.stops?.length || 0} stops
              </p>
            </div>
          </div>

          {/* View toggle + add activity shortcut */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-neutral-200 rounded-xl p-1 gap-1">
              <button
                id="view-calendar"
                onClick={() => setView('calendar')}
                className={clsx('p-1.5 rounded-lg transition-all', view === 'calendar' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-700')}
                title="Calendar view"
              >
                <HiOutlineViewGrid className="w-4 h-4" />
              </button>
              <button
                id="view-list"
                onClick={() => setView('list')}
                className={clsx('p-1.5 rounded-lg transition-all', view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-700')}
                title="List view"
              >
                <HiOutlineViewList className="w-4 h-4" />
              </button>
            </div>
            <Link to={`/trips/${tripId}/itinerary`}>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-xl transition-colors">
                + Add Activities
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="h-96 bg-neutral-100 rounded-2xl animate-pulse" />
        ) : view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Calendar panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-card p-5">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-5">
                <button
                  id="prev-month"
                  onClick={prevMonth}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  {MONTHS[month]} {year}
                </h2>
                <button
                  id="next-month"
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>

              <CalendarGrid
                year={year}
                month={month}
                actsByDate={actsByDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="w-2 h-2 rounded-full bg-primary-500" /> Has activities
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="w-2 h-2 rounded-full border-2 border-primary-400" /> Today
                </div>
              </div>
            </div>

            {/* Day detail panel */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 flex flex-col">
              {selectedActs ? (
                <>
                  <h3 className="font-semibold text-neutral-800 text-sm mb-4 leading-tight">{fmtSelected}</h3>
                  {selectedActs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                      <p className="text-3xl mb-2">📅</p>
                      <p className="text-sm text-neutral-500">No activities planned for this day.</p>
                      <Link to={`/trips/${tripId}/itinerary`} className="mt-3 text-xs text-primary-600 font-semibold hover:text-primary-700">
                        + Add activities →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {selectedActs.map(act => <ActivityPill key={act.id} act={act} />)}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <p className="text-4xl mb-3">🗓️</p>
                  <p className="font-semibold text-neutral-700 text-sm mb-1">Select a date</p>
                  <p className="text-xs text-neutral-400">Click a day to see scheduled activities.</p>
                </div>
              )}

              {/* Unscheduled */}
              {undatedActs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-50">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Unscheduled ({undatedActs.length})</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {undatedActs.map(act => (
                      <div key={act.id} className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{catEmoji[act.category] || '📌'}</span>
                        <span className="truncate">{act.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── List View ── */
          <div className="space-y-6">
            {Object.keys(listByDate).length === 0 && undatedActs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-100 p-16 text-center">
                <p className="text-4xl mb-3">📅</p>
                <p className="font-semibold text-neutral-700 mb-2">No scheduled activities yet</p>
                <p className="text-neutral-400 text-sm mb-5">Add activities with dates in the Itinerary Builder.</p>
                <Link to={`/trips/${tripId}/itinerary`}>
                  <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                    Open Itinerary Builder
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {Object.entries(listByDate).map(([dateKey, acts]) => (
                  <div key={dateKey}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                      <span className="text-sm font-semibold text-neutral-700">
                        {new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="flex-1 h-px bg-neutral-100" />
                      <span className="text-xs text-neutral-400">{acts.length} {acts.length === 1 ? 'activity' : 'activities'}</span>
                    </div>
                    <div className="space-y-2 ml-4">
                      {acts.map(act => <ActivityPill key={act.id} act={act} />)}
                    </div>
                  </div>
                ))}
                {undatedActs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-2 h-2 rounded-full bg-neutral-300 shrink-0" />
                      <span className="text-sm font-semibold text-neutral-400">Unscheduled</span>
                      <div className="flex-1 h-px bg-neutral-100" />
                    </div>
                    <div className="space-y-2 ml-4">
                      {undatedActs.map(act => <ActivityPill key={act.id} act={act} />)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

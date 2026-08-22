import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil,
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock,
  HiOutlineCurrencyDollar, HiOutlineLink, HiOutlineChevronUp,
  HiOutlineChevronDown, HiOutlineX, HiOutlineCheck, HiOutlineMap,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import * as itineraryService from '../../services/itinerary.service'
import * as tripService from '../../services/trip.service'

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'SIGHTSEEING',   label: 'Sightseeing',   emoji: '🏛️', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { value: 'ADVENTURE',     label: 'Adventure',     emoji: '🧗', color: 'bg-orange-50 text-orange-700 ring-orange-200' },
  { value: 'FOOD_DINING',   label: 'Food & Dining', emoji: '🍜', color: 'bg-red-50 text-red-700 ring-red-200' },
  { value: 'CULTURE',       label: 'Culture',       emoji: '🎭', color: 'bg-purple-50 text-purple-700 ring-purple-200' },
  { value: 'SHOPPING',      label: 'Shopping',      emoji: '🛍️', color: 'bg-pink-50 text-pink-700 ring-pink-200' },
  { value: 'TRANSPORT',     label: 'Transport',     emoji: '🚌', color: 'bg-blue-50 text-blue-700 ring-blue-200' },
  { value: 'ACCOMMODATION', label: 'Accommodation', emoji: '🏨', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', emoji: '🎡', color: 'bg-cyan-50 text-cyan-700 ring-cyan-200' },
  { value: 'WELLNESS',      label: 'Wellness',      emoji: '🧘', color: 'bg-teal-50 text-teal-700 ring-teal-200' },
  { value: 'NATURE',        label: 'Nature',        emoji: '🌿', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { value: 'OTHER',         label: 'Other',         emoji: '📌', color: 'bg-neutral-50 text-neutral-700 ring-neutral-200' },
]
const catMap = Object.fromEntries(CATEGORIES.map(c => [c.value, c]))

// ── Helper ────────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null
const fmtLongDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : null
const groupByDate = (activities) => {
  const groups = {}
  activities.forEach(a => {
    const key = a.date ? a.date.slice(0, 10) : 'unscheduled'
    if (!groups[key]) groups[key] = []
    groups[key].push(a)
  })
  return Object.entries(groups).sort(([a], [b]) => {
    if (a === 'unscheduled') return 1
    if (b === 'unscheduled') return -1
    return a.localeCompare(b)
  })
}

// ── Add Stop Modal ────────────────────────────────────────────────────────────
function AddStopModal({ tripId, onClose, onCreated, editStop }) {
  const [form, setForm] = useState({
    city:      editStop?.city      || '',
    country:   editStop?.country   || '',
    state:     editStop?.state     || '',
    startDate: editStop?.startDate ? editStop.startDate.slice(0,10) : '',
    endDate:   editStop?.endDate   ? editStop.endDate.slice(0,10)   : '',
    notes:     editStop?.notes     || '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.city.trim()) { toast.error('City is required.'); return }
    setSubmitting(true)
    try {
      const payload = {
        city:      form.city.trim(),
        country:   form.country.trim()   || null,
        state:     form.state.trim()     || null,
        startDate: form.startDate || null,
        endDate:   form.endDate   || null,
        notes:     form.notes.trim()     || null,
      }
      let stop
      if (editStop) {
        stop = await itineraryService.updateStop(tripId, editStop.id, payload)
        toast.success('Stop updated!')
      } else {
        stop = await itineraryService.createStop(tripId, payload)
        toast.success('Stop added!')
      }
      onCreated(stop)
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save stop.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-neutral-900">
            {editStop ? 'Edit Stop' : 'Add a Stop'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">City *</label>
              <input
                autoFocus
                value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="e.g. Tokyo"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Country</label>
              <input
                value={form.country}
                onChange={e => set('country', e.target.value)}
                placeholder="Japan"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">State / Region</label>
              <input
                value={form.state}
                onChange={e => set('state', e.target.value)}
                placeholder="Kanto"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Arrival Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Departure Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
                min={form.startDate || undefined}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Accommodation, transit notes…"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm text-neutral-600 font-medium border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm text-white font-semibold bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : editStop ? 'Save Changes' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add Activity Modal ────────────────────────────────────────────────────────
function ActivityModal({ tripId, stop, onClose, onSaved, editActivity }) {
  const [form, setForm] = useState({
    title:       editActivity?.title       || '',
    description: editActivity?.description || '',
    category:    editActivity?.category    || 'SIGHTSEEING',
    cost:        editActivity?.cost        != null ? String(editActivity.cost) : '',
    duration:    editActivity?.duration    != null ? String(editActivity.duration) : '',
    date:        editActivity?.date        ? editActivity.date.slice(0, 10) : (stop.startDate ? stop.startDate.slice(0, 10) : ''),
    startTime:   editActivity?.startTime   || '',
    endTime:     editActivity?.endTime     || '',
    location:    editActivity?.location    || '',
    notes:       editActivity?.notes       || '',
    bookingUrl:  editActivity?.bookingUrl  || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required.'); return }
    setSubmitting(true)
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim() || null,
        category:    form.category,
        cost:        form.cost     ? parseFloat(form.cost)    : 0,
        duration:    form.duration ? parseInt(form.duration)  : null,
        date:        form.date     || null,
        startTime:   form.startTime || null,
        endTime:     form.endTime   || null,
        location:    form.location.trim()   || null,
        notes:       form.notes.trim()      || null,
        bookingUrl:  form.bookingUrl.trim() || null,
      }
      let act
      if (editActivity) {
        act = await itineraryService.updateActivity(tripId, stop.id, editActivity.id, payload)
        toast.success('Activity updated!')
      } else {
        act = await itineraryService.createActivity(tripId, stop.id, payload)
        toast.success('Activity added!')
      }
      onSaved(act)
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save activity.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-neutral-100">
          <h3 className="font-display font-bold text-lg text-neutral-900">
            {editActivity ? 'Edit Activity' : `Add Activity — ${stop.city}`}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Activity Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Visit Senso-ji Temple"
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => set('category', cat.value)}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl border text-center transition-all',
                    form.category === cat.value
                      ? 'border-primary-400 bg-primary-50 shadow-sm'
                      : 'border-neutral-100 hover:border-neutral-300'
                  )}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-[10px] font-medium text-neutral-600 leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-xs font-medium text-neutral-600 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => set('endTime', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Cost + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={e => set('cost', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                placeholder="60"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Location / Venue</label>
            <input
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="Senso-ji Temple, Asakusa"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Booking details, tips, reminders…"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            />
          </div>

          {/* Booking URL */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Booking Link</label>
            <input
              type="url"
              value={form.bookingUrl}
              onChange={e => set('bookingUrl', e.target.value)}
              placeholder="https://…"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm text-neutral-600 font-medium border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm text-white font-semibold bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : editActivity ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Activity Card ─────────────────────────────────────────────────────────────
function ActivityCard({ activity, tripId, stopId, onUpdated, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [editing,  setEditing]  = useState(false)
  const cat = catMap[activity.category] || catMap.OTHER

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${activity.title}"?`)) return
    setDeleting(true)
    try {
      await itineraryService.deleteActivity(tripId, stopId, activity.id)
      onDeleted(activity.id)
      toast.success('Activity deleted.')
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all">
        {/* Category emoji */}
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg ring-1', cat.color)}>
          {cat.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm text-neutral-900 leading-tight">{activity.title}</p>
            {/* Actions — appear on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="p-1 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <HiOutlinePencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            {(activity.startTime || activity.endTime) && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <HiOutlineClock className="w-3 h-3" />
                {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ''}
              </span>
            )}
            {activity.duration && (
              <span className="text-xs text-neutral-400">{activity.duration}min</span>
            )}
            {activity.cost > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-neutral-400">
                <HiOutlineCurrencyDollar className="w-3 h-3" />{activity.cost}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1 text-xs text-neutral-400 truncate max-w-[120px]">
                <HiOutlineLocationMarker className="w-3 h-3 shrink-0" />{activity.location}
              </span>
            )}
            {activity.bookingUrl && (
              <a
                href={activity.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700"
              >
                <HiOutlineLink className="w-3 h-3" /> Booking
              </a>
            )}
          </div>

          {activity.notes && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{activity.notes}</p>
          )}
        </div>
      </div>

      {editing && (
        <ActivityModal
          tripId={tripId}
          stop={{ id: stopId }}
          editActivity={activity}
          onClose={() => setEditing(false)}
          onSaved={(updated) => { onUpdated(updated); setEditing(false) }}
        />
      )}
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const { id: tripId } = useParams()
  const navigate = useNavigate()

  const [trip,           setTrip]           = useState(null)
  const [stops,          setStops]          = useState([])
  const [selectedStop,   setSelectedStop]   = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [showAddStop,    setShowAddStop]    = useState(false)
  const [editStop,       setEditStop]       = useState(null)
  const [showAddAct,     setShowAddAct]     = useState(false)

  // Load trip + stops
  const loadData = useCallback(async () => {
    try {
      const [t, s] = await Promise.all([
        tripService.getTripById(tripId),
        itineraryService.getStops(tripId),
      ])
      setTrip(t)
      setStops(s)
      if (s.length > 0 && !selectedStop) setSelectedStop(s[0])
    } catch {
      toast.error('Failed to load itinerary.')
      navigate(`/trips/${tripId}`)
    } finally {
      setLoading(false)
    }
  }, [tripId, navigate, selectedStop])

  useEffect(() => { loadData() }, [tripId]) // eslint-disable-line

  // ── Stop actions ──
  const handleStopCreated = (stop) => {
    setStops(prev => {
      const exists = prev.find(s => s.id === stop.id)
      if (exists) return prev.map(s => s.id === stop.id ? stop : s)
      const next = [...prev, stop]
      if (!selectedStop) setSelectedStop(stop)
      return next
    })
  }

  const handleDeleteStop = async (stop) => {
    if (!window.confirm(`Delete "${stop.city}" and all its activities?`)) return
    try {
      await itineraryService.deleteStop(tripId, stop.id)
      setStops(prev => {
        const next = prev.filter(s => s.id !== stop.id)
        if (selectedStop?.id === stop.id) setSelectedStop(next[0] || null)
        return next
      })
      toast.success('Stop deleted.')
    } catch {
      toast.error('Failed to delete stop.')
    }
  }

  const handleMoveStop = async (index, dir) => {
    const next = [...stops]
    const swapIdx = index + dir
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    setStops(next)
    try {
      await itineraryService.reorderStops(tripId, next.map(s => s.id))
    } catch {
      toast.error('Failed to reorder.')
      setStops(stops) // revert
    }
  }

  // ── Activity actions ──
  const handleActivitySaved = (act) => {
    setStops(prev => prev.map(s => {
      if (s.id !== selectedStop?.id) return s
      const acts = s.activities || []
      const exists = acts.find(a => a.id === act.id)
      return {
        ...s,
        activities: exists
          ? acts.map(a => a.id === act.id ? act : a)
          : [...acts, act],
      }
    }))
    if (selectedStop?.id) {
      setSelectedStop(prev => {
        if (!prev) return prev
        const acts = prev.activities || []
        const exists = acts.find(a => a.id === act.id)
        return {
          ...prev,
          activities: exists
            ? acts.map(a => a.id === act.id ? act : a)
            : [...acts, act],
        }
      })
    }
  }

  const handleActivityDeleted = (actId) => {
    const patch = (s) => ({ ...s, activities: (s.activities || []).filter(a => a.id !== actId) })
    setStops(prev => prev.map(s => s.id === selectedStop?.id ? patch(s) : s))
    setSelectedStop(prev => prev ? patch(prev) : prev)
  }

  const handleActivityUpdated = (act) => handleActivitySaved(act)

  // Sync selectedStop with stops state
  const syncedSelected = stops.find(s => s.id === selectedStop?.id) || selectedStop

  // ── Render ──
  const dateRange = (stop) => {
    if (!stop.startDate && !stop.endDate) return null
    const s = fmtDate(stop.startDate)
    const e = fmtDate(stop.endDate)
    return s && e ? `${s} – ${e}` : s || e
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">

        {/* ── Page Header ── */}
        <div className="bg-white border-b border-neutral-100 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <Link
            to={`/trips/${tripId}`}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Trip</span>
          </Link>

          <div className="flex-1 min-w-0">
            {trip && (
              <h1 className="font-display font-bold text-lg text-neutral-900 truncate">
                {trip.title} — Itinerary
              </h1>
            )}
          </div>

          <button
            id="add-stop-btn"
            onClick={() => { setEditStop(null); setShowAddStop(true) }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Stop
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-neutral-500">Loading itinerary…</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">

            {/* ── Left Sidebar — Stops ── */}
            <aside className={clsx(
              'bg-white border-r border-neutral-100 flex flex-col shrink-0',
              stops.length === 0 ? 'w-full' : 'w-72 hidden md:flex'
            )}>
              <div className="px-4 py-3 border-b border-neutral-50 flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  Stops ({stops.length})
                </p>
              </div>

              {stops.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center text-4xl mb-4">🗺️</div>
                  <p className="font-semibold text-neutral-700 mb-1">No stops yet</p>
                  <p className="text-sm text-neutral-400 mb-5">Add your first destination to start building your itinerary.</p>
                  <button
                    onClick={() => setShowAddStop(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <HiOutlinePlus className="w-4 h-4" /> Add First Stop
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
                  {stops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className={clsx(
                        'group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all',
                        syncedSelected?.id === stop.id
                          ? 'bg-primary-50 border border-primary-100'
                          : 'hover:bg-neutral-50 border border-transparent'
                      )}
                      onClick={() => setSelectedStop(stop)}
                    >
                      {/* Order badge */}
                      <div className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        syncedSelected?.id === stop.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-500'
                      )}>
                        {idx + 1}
                      </div>

                      {/* Stop info */}
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          'text-sm font-semibold truncate',
                          syncedSelected?.id === stop.id ? 'text-primary-700' : 'text-neutral-900'
                        )}>
                          {stop.city}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {stop.country && (
                            <span className="text-xs text-neutral-400 truncate">{stop.country}</span>
                          )}
                          {dateRange(stop) && (
                            <span className="text-xs text-neutral-400">{dateRange(stop)}</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {stop.activities?.length || 0} activities
                        </p>
                      </div>

                      {/* Reorder + actions */}
                      <div className="flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); handleMoveStop(idx, -1) }}
                          disabled={idx === 0}
                          className="p-0.5 rounded hover:bg-neutral-200 text-neutral-400 disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <HiOutlineChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleMoveStop(idx, 1) }}
                          disabled={idx === stops.length - 1}
                          className="p-0.5 rounded hover:bg-neutral-200 text-neutral-400 disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <HiOutlineChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); setEditStop(stop); setShowAddStop(true) }}
                          className="p-1 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <HiOutlinePencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteStop(stop) }}
                          className="p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <HiOutlineTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            {/* ── Right Panel — Activities ── */}
            {stops.length > 0 && (
              <main className="flex-1 overflow-y-auto bg-surface-secondary">

                {/* Mobile stop selector */}
                <div className="md:hidden bg-white border-b border-neutral-100 px-4 py-2 overflow-x-auto flex gap-2">
                  {stops.map((stop, idx) => (
                    <button
                      key={stop.id}
                      onClick={() => setSelectedStop(stop)}
                      className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                        syncedSelected?.id === stop.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-neutral-200 text-neutral-600'
                      )}
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{idx + 1}</span>
                      {stop.city}
                    </button>
                  ))}
                </div>

                {syncedSelected ? (
                  <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

                    {/* Stop header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 flex items-center gap-2">
                          <HiOutlineMap className="w-6 h-6 text-primary-500" />
                          {syncedSelected.city}
                        </h2>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {syncedSelected.country && (
                            <span className="text-sm text-neutral-500 flex items-center gap-1">
                              <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                              {[syncedSelected.state, syncedSelected.country].filter(Boolean).join(', ')}
                            </span>
                          )}
                          {dateRange(syncedSelected) && (
                            <span className="text-sm text-neutral-500 flex items-center gap-1">
                              <HiOutlineCalendar className="w-3.5 h-3.5" />
                              {dateRange(syncedSelected)}
                            </span>
                          )}
                        </div>
                        {syncedSelected.notes && (
                          <p className="text-sm text-neutral-400 mt-1 italic">{syncedSelected.notes}</p>
                        )}
                      </div>

                      <button
                        id="add-activity-btn"
                        onClick={() => setShowAddAct(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                        Add Activity
                      </button>
                    </div>

                    {/* Activities by date */}
                    {(!syncedSelected.activities || syncedSelected.activities.length === 0) ? (
                      <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">✨</div>
                        <p className="font-semibold text-neutral-700 text-sm mb-1">No activities yet</p>
                        <p className="text-neutral-400 text-xs mb-4">Add activities to plan your day in {syncedSelected.city}.</p>
                        <button
                          onClick={() => setShowAddAct(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
                        >
                          <HiOutlinePlus className="w-3.5 h-3.5" /> Add First Activity
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {groupByDate(syncedSelected.activities).map(([dateKey, acts]) => (
                          <div key={dateKey}>
                            {/* Date header */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                                <span className="text-sm font-semibold text-neutral-700">
                                  {dateKey === 'unscheduled'
                                    ? 'Unscheduled'
                                    : fmtLongDate(dateKey)}
                                </span>
                              </div>
                              <div className="flex-1 h-px bg-neutral-100" />
                              <span className="text-xs text-neutral-400">{acts.length} {acts.length === 1 ? 'activity' : 'activities'}</span>
                            </div>

                            {/* Activity cards */}
                            <div className="space-y-2">
                              {acts.map(act => (
                                <ActivityCard
                                  key={act.id}
                                  activity={act}
                                  tripId={tripId}
                                  stopId={syncedSelected.id}
                                  onUpdated={handleActivityUpdated}
                                  onDeleted={handleActivityDeleted}
                                />
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Total cost summary */}
                        {syncedSelected.activities.some(a => a.cost > 0) && (
                          <div className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center justify-between">
                            <span className="text-sm text-neutral-500">Total activities cost</span>
                            <span className="font-bold text-neutral-900">
                              ${syncedSelected.activities.reduce((s, a) => s + (a.cost || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center h-full text-neutral-400">
                    <p className="text-sm">Select a stop to view activities</p>
                  </div>
                )}
              </main>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showAddStop && (
        <AddStopModal
          tripId={tripId}
          editStop={editStop}
          onClose={() => { setShowAddStop(false); setEditStop(null) }}
          onCreated={handleStopCreated}
        />
      )}

      {showAddAct && syncedSelected && (
        <ActivityModal
          tripId={tripId}
          stop={syncedSelected}
          onClose={() => setShowAddAct(false)}
          onSaved={handleActivitySaved}
        />
      )}
    </AppLayout>
  )
}

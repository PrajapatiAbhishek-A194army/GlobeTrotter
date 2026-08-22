import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineCurrencyDollar, HiOutlinePlus, HiOutlinePencil,
  HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineExclamation,
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineMap,
  HiOutlineArrowRight, HiOutlineX, HiOutlineCheck, HiOutlineSparkles,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import * as tripService from '../../services/trip.service'
import * as budgetService from '../../services/budget.service'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CHF']

const fmt = (val, currency = 'USD') => {
  const num = parseFloat(val) || 0
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(num)
}

// ── Quick Budget Edit Modal ──────────────────────────────────────────────────
function QuickEditBudgetModal({ trip, isOpen, onClose, onSaved }) {
  const [currency, setCurrency] = useState(trip?.budget?.currency || 'USD')
  const [total, setTotal]       = useState(trip?.budget?.totalBudget || 0)
  const [transport, setTransport] = useState(trip?.budget?.transport || 0)
  const [accommodation, setAccommodation] = useState(trip?.budget?.accommodation || 0)
  const [meals, setMeals]       = useState(trip?.budget?.meals || 0)
  const [activities, setActivities] = useState(trip?.budget?.activities || 0)
  const [other, setOther]       = useState(trip?.budget?.other || 0)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    if (trip?.budget) {
      setCurrency(trip.budget.currency || 'USD')
      setTotal(trip.budget.totalBudget || 0)
      setTransport(trip.budget.transport || 0)
      setAccommodation(trip.budget.accommodation || 0)
      setMeals(trip.budget.meals || 0)
      setActivities(trip.budget.activities || 0)
      setOther(trip.budget.other || 0)
    }
  }, [trip])

  if (!isOpen || !trip) return null

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await budgetService.updateBudget(trip.id, {
        totalBudget:   parseFloat(total) || 0,
        transport:     parseFloat(transport) || 0,
        accommodation: parseFloat(accommodation) || 0,
        meals:         parseFloat(meals) || 0,
        activities:    parseFloat(activities) || 0,
        other:         parseFloat(other) || 0,
        currency,
      })
      toast.success('Budget updated! 💰')
      onSaved()
      onClose()
    } catch {
      toast.error('Failed to update budget.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-100 animate-scale-up">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">Set Trip Budget</h3>
            <p className="text-xs text-neutral-500 truncate max-w-xs">{trip.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Total Target</label>
              <input
                type="number"
                min="0"
                value={total}
                onChange={e => setTotal(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Category Allocations</p>
            {[
              { label: 'Transport 🚌',     val: transport,     set: setTransport },
              { label: 'Accommodation 🏨', val: accommodation, set: setAccommodation },
              { label: 'Meals 🍜',         val: meals,         set: setMeals },
              { label: 'Activities 🎡',    val: activities,    set: setActivities },
              { label: 'Other 📌',         val: other,         set: setOther },
            ].map(cat => (
              <div key={cat.label} className="flex items-center justify-between text-xs">
                <span className="text-neutral-600 font-medium">{cat.label}</span>
                <input
                  type="number"
                  min="0"
                  value={cat.val}
                  onChange={e => cat.set(e.target.value)}
                  className="w-24 px-2.5 py-1 text-right border border-neutral-200 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Global Budget Page ────────────────────────────────────────────────────────
export default function GlobalBudgetPage() {
  const navigate = useNavigate()
  const [trips, setTrips]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTrip, setActiveTrip] = useState(null)
  const [showModal, setShowModal]   = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tripService.getTrips({ limit: 50 })
      setTrips(res.trips || [])
    } catch {
      toast.error('Failed to load trips.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Compute aggregated stats
  const totalAllocated = trips.reduce((s, t) => s + (t.budget?.totalBudget || 0), 0)
  const totalSpent     = trips.reduce((s, t) => {
    const actSum = (t.stops || []).flatMap(stop => stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0)
    return s + actSum
  }, 0)
  const totalRemaining = Math.max(0, totalAllocated - totalSpent)
  const overallPct     = totalAllocated > 0 ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100)) : 0

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-2xl text-xl">💰</span>
              Trip Budget Planner
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track, allocate, and manage expenses across all your travel itineraries in one place.
            </p>
          </div>
          <Link to="/trips/new">
            <Button variant="primary" size="md" leftIcon={<HiOutlinePlus className="w-4 h-4" />}>
              New Trip
            </Button>
          </Link>
        </div>

        {/* ── Summary Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shrink-0">
              💵
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Allocated</p>
              <p className="font-display font-black text-2xl text-neutral-900 mt-0.5">
                ${totalAllocated.toLocaleString()}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{trips.length} total trips</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
              📊
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Expenses</p>
              <p className="font-display font-black text-2xl text-amber-600 mt-0.5">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{overallPct}% of allocated budget</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
              ✨
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Remaining Balance</p>
              <p className="font-display font-black text-2xl text-emerald-600 mt-0.5">
                ${totalRemaining.toLocaleString()}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Available for new activities</p>
            </div>
          </div>
        </div>

        {/* ── Trips Budget Table / List ── */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-neutral-900">Trip Budgets & Allocations</h2>
              <p className="text-xs text-neutral-500">Manage individual limits and view real-time expense ratios</p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-neutral-400">Loading trip budgets…</div>
          ) : trips.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-3">✈️</div>
              <h3 className="font-display font-bold text-lg text-neutral-800">No trips created yet</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1 mb-5">
                Create your first trip to start setting budgets and tracking travel expenses.
              </p>
              <Link to="/trips/new">
                <Button variant="primary" size="sm">Create Trip</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {trips.map(trip => {
                const totalBgt = trip.budget?.totalBudget || 0
                const curr     = trip.budget?.currency || 'USD'
                const spent    = (trip.stops || []).flatMap(s => s.activities || []).reduce((a, act) => a + (act.cost || 0), 0)
                const pct      = totalBgt > 0 ? Math.min(100, Math.round((spent / totalBgt) * 100)) : 0
                const isOver   = totalBgt > 0 && spent > totalBgt

                return (
                  <div key={trip.id} className="p-6 hover:bg-neutral-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Trip Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 overflow-hidden shrink-0 shadow-xs">
                        {trip.coverImage ? (
                          <img
                            src={trip.coverImage.startsWith('http') ? trip.coverImage : `http://localhost:5000${trip.coverImage}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🌍</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link to={`/trips/${trip.id}`} className="font-display font-bold text-base text-neutral-900 hover:text-primary-600 truncate">
                            {trip.title}
                          </Link>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600 uppercase">
                            {trip.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                          <span>{trip.stops?.length || 0} stops</span>
                          <span>·</span>
                          <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Dates TBD'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Financial Figures */}
                    <div className="w-full md:w-64 space-y-1.5 shrink-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-800">
                          {fmt(spent, curr)} <span className="text-neutral-400 font-normal">spent</span>
                        </span>
                        <span className="text-neutral-500 font-medium">
                          of {totalBgt > 0 ? fmt(totalBgt, curr) : 'No Budget Set'}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full transition-all',
                            isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-primary-500'
                          )}
                          style={{ width: `${totalBgt > 0 ? pct : 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={clsx('font-semibold', isOver ? 'text-red-500' : 'text-neutral-400')}>
                          {isOver ? '⚠️ Over Budget' : `${pct}% used`}
                        </span>
                        <span className="text-neutral-400">
                          {totalBgt > spent ? `${fmt(totalBgt - spent, curr)} remaining` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setActiveTrip(trip); setShowModal(true) }}
                        className="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                      >
                        <HiOutlinePencil className="w-3.5 h-3.5 text-neutral-500" />
                        Set Budget
                      </button>
                      <Link to={`/trips/${trip.id}/budget`}>
                        <button className="px-3.5 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-semibold transition-colors flex items-center gap-1">
                          <span>Details</span>
                          <HiOutlineArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Edit Budget Modal */}
      <QuickEditBudgetModal
        trip={activeTrip}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setActiveTrip(null) }}
        onSaved={loadData}
      />
    </AppLayout>
  )
}

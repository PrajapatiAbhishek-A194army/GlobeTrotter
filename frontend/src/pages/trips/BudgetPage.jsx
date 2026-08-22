import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft, HiOutlineCurrencyDollar, HiOutlineCheck,
  HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineExclamation,
  HiOutlineInformationCircle,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import * as budgetService from '../../services/budget.service'
import * as tripService from '../../services/trip.service'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CHF']

const CATEGORIES = [
  { key: 'transport',     label: 'Transport',     emoji: '🚌', color: 'text-blue-600',   bg: 'bg-blue-50',    bar: 'bg-blue-500' },
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨', color: 'text-indigo-600', bg: 'bg-indigo-50',  bar: 'bg-indigo-500' },
  { key: 'meals',         label: 'Meals',         emoji: '🍜', color: 'text-red-600',    bg: 'bg-red-50',     bar: 'bg-red-500' },
  { key: 'activities',    label: 'Activities',    emoji: '🎡', color: 'text-amber-600',  bg: 'bg-amber-50',   bar: 'bg-amber-500' },
  { key: 'other',         label: 'Other',         emoji: '📌', color: 'text-neutral-600',bg: 'bg-neutral-50', bar: 'bg-neutral-400' },
]

const fmt = (val, currency = 'USD') => {
  const num = parseFloat(val) || 0
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(num)
}

// ── Donut chart SVG ────────────────────────────────────────────────────────────
function DonutChart({ slices, total, currency }) {
  if (!total || total === 0) {
    return (
      <div className="w-44 h-44 rounded-full border-[14px] border-neutral-100 flex items-center justify-center shrink-0">
        <p className="text-xs text-neutral-400 text-center">No<br/>allocation</p>
      </div>
    )
  }

  const colors = ['#3b82f6','#6366f1','#ef4444','#f59e0b','#9ca3af']
  let offset = 0
  const r = 60, cx = 80, cy = 80, circumference = 2 * Math.PI * r

  return (
    <svg width="160" height="160" className="shrink-0 -rotate-90">
      {slices.map((slice, i) => {
        const pct = slice.val / total
        const dash = pct * circumference
        const gap  = circumference - dash
        const el = (
          <circle
            key={slice.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth="20"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circumference}
            style={{ transition: 'stroke-dasharray 0.4s ease' }}
          />
        )
        offset += pct
        return el
      })}
    </svg>
  )
}

// ── Budget Category Row ────────────────────────────────────────────────────────
function CategoryRow({ cat, value, total, currency, onChange }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-base w-6 shrink-0">{cat.emoji}</span>
        <label className="text-sm font-medium text-neutral-700 flex-1">{cat.label}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''}
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={value || ''}
            onChange={e => onChange(cat.key, e.target.value)}
            placeholder="0"
            className="w-28 pl-6 pr-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-right"
          />
        </div>
        <span className="text-xs text-neutral-400 w-10 text-right">
          {pct > 0 ? `${pct.toFixed(0)}%` : '—'}
        </span>
      </div>
      {/* Progress bar */}
      <div className="ml-8 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', cat.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BudgetPage() {
  const { id: tripId } = useParams()
  const navigate = useNavigate()

  const [trip,      setTrip]      = useState(null)
  const [budget,    setBudget]    = useState(null)
  const [form,      setForm]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [dirty,     setDirty]     = useState(false)

  useEffect(() => {
    Promise.all([tripService.getTripById(tripId), budgetService.getBudget(tripId)])
      .then(([t, b]) => {
        setTrip(t)
        setBudget(b)
        setForm({
          totalBudget:    String(b.totalBudget    || ''),
          transport:      String(b.transport      || ''),
          accommodation:  String(b.accommodation  || ''),
          meals:          String(b.meals          || ''),
          activities:     String(b.activities     || ''),
          other:          String(b.other          || ''),
          currency:       b.currency || 'USD',
          alertThreshold: String(b.alertThreshold || ''),
        })
      })
      .catch(() => { toast.error('Failed to load budget.'); navigate(`/trips/${tripId}`) })
      .finally(() => setLoading(false))
  }, [tripId, navigate])

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        totalBudget:    parseFloat(form.totalBudget)    || 0,
        transport:      parseFloat(form.transport)      || 0,
        accommodation:  parseFloat(form.accommodation)  || 0,
        meals:          parseFloat(form.meals)          || 0,
        activities:     parseFloat(form.activities)     || 0,
        other:          parseFloat(form.other)          || 0,
        currency:       form.currency,
        alertThreshold: form.alertThreshold ? parseFloat(form.alertThreshold) : null,
      }
      const updated = await budgetService.updateBudget(tripId, payload)
      setBudget(updated)
      setDirty(false)
      toast.success('Budget saved! 💰')
    } catch {
      toast.error('Failed to save budget.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-2xl" />)}
        </div>
      </AppLayout>
    )
  }

  const total     = parseFloat(form.totalBudget) || 0
  const allocated = CATEGORIES.reduce((s, c) => s + (parseFloat(form[c.key]) || 0), 0)
  const unallocated = total - allocated
  const actualSpend = budget.actualSpend || 0
  const spendPct = total > 0 ? Math.min(100, (actualSpend / total) * 100) : 0
  const overBudget = actualSpend > total && total > 0
  const alertLevel = form.alertThreshold
    ? actualSpend / total * 100 >= parseFloat(form.alertThreshold)
    : false

  const donutSlices = CATEGORIES.map(c => ({ key: c.key, val: parseFloat(form[c.key]) || 0 })).filter(s => s.val > 0)

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/trips/${tripId}`)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {trip?.title || 'Back to Trip'}
          </button>
          {dirty && (
            <button
              id="save-budget-btn"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Budget'}
            </button>
          )}
        </div>

        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 flex items-center gap-2">
            <HiOutlineCurrencyDollar className="w-6 h-6 text-primary-500" />
            Budget Planner
          </h1>
          {trip && <p className="text-sm text-neutral-500 mt-1">{trip.title}</p>}
        </div>

        {/* ── Alert Banner ── */}
        {alertLevel && !overBudget && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <HiOutlineExclamation className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Budget alert!</p>
              <p className="text-xs text-amber-600 mt-0.5">
                You've spent {spendPct.toFixed(0)}% of your budget — nearing your {form.alertThreshold}% alert threshold.
              </p>
            </div>
          </div>
        )}
        {overBudget && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <HiOutlineTrendingDown className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Over budget!</p>
              <p className="text-xs text-red-600 mt-0.5">
                Activity spend ({fmt(actualSpend, form.currency)}) exceeds your total budget ({fmt(total, form.currency)}).
              </p>
            </div>
          </div>
        )}

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Budget',   val: fmt(total, form.currency),       icon: HiOutlineCurrencyDollar, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Activity Spend', val: fmt(actualSpend, form.currency), icon: HiOutlineTrendingUp,     color: overBudget ? 'text-red-600' : 'text-emerald-600', bg: overBudget ? 'bg-red-50' : 'bg-emerald-50' },
            { label: 'Remaining',      val: fmt(Math.max(0, total - actualSpend), form.currency), icon: HiOutlineCheck, color: 'text-neutral-600', bg: 'bg-neutral-50' },
          ].map(({ label, val, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-4">
              <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon className={clsx('w-4 h-4', color)} />
              </div>
              <p className="font-bold text-neutral-900 text-lg leading-tight">{val}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Spend progress bar ── */}
        {total > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-neutral-700">Spending Progress</p>
              <p className={clsx('text-sm font-bold', overBudget ? 'text-red-600' : 'text-neutral-900')}>
                {spendPct.toFixed(1)}%
              </p>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', overBudget ? 'bg-red-500' : 'bg-primary-500')}
                style={{ width: `${spendPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-neutral-400">Activity costs: {fmt(actualSpend, form.currency)}</span>
              <span className="text-xs text-neutral-400">Budget: {fmt(total, form.currency)}</span>
            </div>
          </div>
        )}

        {/* ── Budget Form + Donut ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">

            {/* Form left */}
            <div className="flex-1 space-y-5 w-full">
              {/* Currency + Total */}
              <div className="flex items-end gap-3">
                <div className="w-28">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Currency</label>
                  <select
                    id="budget-currency"
                    value={form.currency}
                    onChange={e => set('currency', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Total Budget</label>
                  <input
                    id="total-budget"
                    type="number"
                    min="0"
                    step="1"
                    value={form.totalBudget}
                    onChange={e => set('totalBudget', e.target.value)}
                    placeholder="e.g. 3000"
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Category allocations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-neutral-700">Category Allocations</p>
                  {total > 0 && (
                    <p className={clsx('text-xs font-medium', unallocated < 0 ? 'text-red-500' : 'text-neutral-400')}>
                      {unallocated >= 0 ? `${fmt(unallocated, form.currency)} unallocated` : `${fmt(-unallocated, form.currency)} over-allocated`}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  {CATEGORIES.map(cat => (
                    <CategoryRow
                      key={cat.key}
                      cat={cat}
                      value={parseFloat(form[cat.key]) || 0}
                      total={total}
                      currency={form.currency}
                      onChange={(k, v) => set(k, v)}
                    />
                  ))}
                </div>
              </div>

              {/* Alert threshold */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-50">
                <HiOutlineInformationCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Alert me at (% of budget)</label>
                  <input
                    id="alert-threshold"
                    type="number"
                    min="1"
                    max="100"
                    value={form.alertThreshold}
                    onChange={e => set('alertThreshold', e.target.value)}
                    placeholder="e.g. 80"
                    className="w-24 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>
            </div>

            {/* Donut chart right */}
            <div className="flex flex-col items-center gap-4 shrink-0 sm:pt-8">
              <DonutChart slices={donutSlices} total={allocated} currency={form.currency} />
              {/* Legend */}
              <div className="space-y-1.5">
                {CATEGORIES.filter(c => (parseFloat(form[c.key]) || 0) > 0).map((cat, i) => (
                  <div key={cat.key} className="flex items-center gap-2 text-xs text-neutral-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ['#3b82f6','#6366f1','#ef4444','#f59e0b','#9ca3af'][i] }} />
                    {cat.label}: {fmt(form[cat.key], form.currency)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <div className="flex justify-end gap-3">
          <Link to={`/trips/${tripId}`}>
            <button className="px-5 py-2.5 text-sm text-neutral-600 font-medium border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              Back to Trip
            </button>
          </Link>
          <button
            id="save-budget-bottom"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60 active:scale-[0.98]"
          >
            <HiOutlineCheck className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Budget'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

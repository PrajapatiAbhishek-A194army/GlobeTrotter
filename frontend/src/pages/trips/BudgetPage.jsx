import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineArrowLeft, HiOutlineCurrencyDollar, HiOutlineCheck,
  HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineExclamation,
  HiOutlineInformationCircle, HiOutlineSparkles, HiOutlineRefresh,
  HiOutlineChartPie, HiOutlineTag,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import * as budgetService from '../../services/budget.service'
import * as tripService from '../../services/trip.service'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'CHF']

const CATEGORIES = [
  { key: 'transport',     label: 'Transport',     emoji: '🚌', color: 'text-blue-600',   bg: 'bg-blue-50',    bar: 'bg-blue-500',   hex: '#3b82f6' },
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨', color: 'text-indigo-600', bg: 'bg-indigo-50',  bar: 'bg-indigo-500', hex: '#6366f1' },
  { key: 'meals',         label: 'Meals',         emoji: '🍜', color: 'text-red-600',    bg: 'bg-red-50',     bar: 'bg-red-500',    hex: '#ef4444' },
  { key: 'activities',    label: 'Activities',    emoji: '🎡', color: 'text-amber-600',  bg: 'bg-amber-50',   bar: 'bg-amber-500',  hex: '#f59e0b' },
  { key: 'other',         label: 'Other',         emoji: '📌', color: 'text-neutral-600',bg: 'bg-neutral-50', bar: 'bg-neutral-400',  hex: '#9ca3af' },
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

  let offset = 0
  const r = 60, cx = 80, cy = 80, circumference = 2 * Math.PI * r

  return (
    <svg width="160" height="160" className="shrink-0 -rotate-90">
      {slices.map((slice) => {
        const cat = CATEGORIES.find(c => c.key === slice.key) || CATEGORIES[4]
        const pct = slice.val / total
        const dash = pct * circumference
        const gap  = circumference - dash
        const el = (
          <circle
            key={slice.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={cat.hex}
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

// ── Budget Category Row with Spend vs Allocated ───────────────────────────────
function CategoryRow({ cat, allocatedVal, spentVal, total, currency, onChange }) {
  const pctOfTotal = total > 0 ? Math.min(100, (allocatedVal / total) * 100) : 0
  const spentPct   = allocatedVal > 0 ? Math.min(100, (spentVal / allocatedVal) * 100) : 0
  const isOver     = spentVal > allocatedVal && allocatedVal > 0

  return (
    <div className="p-3.5 bg-neutral-50/70 hover:bg-neutral-50 rounded-2xl border border-neutral-100/80 space-y-2 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-lg w-7 shrink-0">{cat.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800">{cat.label}</label>
            <span className="text-[11px] text-neutral-500 font-medium">
              {pctOfTotal > 0 ? `${pctOfTotal.toFixed(0)}% of budget` : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5">
            <span>Spent: <strong className={clsx(isOver ? 'text-red-600' : 'text-neutral-700')}>{fmt(spentVal, currency)}</strong></span>
            {allocatedVal > 0 && (
              <span>Remaining: <strong className="text-emerald-700">{fmt(Math.max(0, allocatedVal - spentVal), currency)}</strong></span>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="relative shrink-0 ml-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''}
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={allocatedVal || ''}
            onChange={e => onChange(cat.key, e.target.value)}
            placeholder="0"
            className="w-28 pl-6 pr-3 py-1.5 text-xs font-bold border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-right bg-white"
          />
        </div>
      </div>

      {/* Visual Bars: Allocation & Spend */}
      <div className="space-y-1">
        {/* Category Budget Share Bar */}
        <div className="h-1.5 bg-neutral-200/60 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', cat.bar)}
            style={{ width: `${pctOfTotal}%` }}
            title={`${cat.label} allocation: ${pctOfTotal.toFixed(1)}%`}
          />
        </div>

        {/* Spent Progress against this Category */}
        {allocatedVal > 0 && spentVal > 0 && (
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
            <span className={clsx('font-semibold', isOver ? 'text-red-500' : 'text-primary-600')}>
              {isOver ? '⚠️ Over category allocation' : `${spentPct.toFixed(1)}% used`}
            </span>
          </div>
        )}
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

  // Calculate sum of category allocations
  const allocated = form
    ? CATEGORIES.reduce((s, c) => s + (parseFloat(form[c.key]) || 0), 0)
    : 0

  // Effective total budget
  const total = form
    ? (parseFloat(form.totalBudget) > 0 ? parseFloat(form.totalBudget) : allocated)
    : 0

  const handleSyncCategories = () => {
    set('totalBudget', String(allocated))
    toast.success(`Total Budget set to sum: ${fmt(allocated, form?.currency || 'USD')}! 💡`)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const finalTotal = parseFloat(form.totalBudget) > 0 ? parseFloat(form.totalBudget) : allocated

      const payload = {
        totalBudget:    finalTotal,
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
      setForm(prev => ({
        ...prev,
        totalBudget: String(updated.totalBudget || finalTotal || ''),
      }))
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
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-3xl" />)}
        </div>
      </AppLayout>
    )
  }

  const unallocated = total - allocated
  const actualSpend = budget.actualSpend || 0
  const spendPct = total > 0 ? Math.min(100, (actualSpend / total) * 100) : 0
  const overBudget = actualSpend > total && total > 0
  const alertLevel = form.alertThreshold && total > 0
    ? actualSpend / total * 100 >= parseFloat(form.alertThreshold)
    : false

  const donutSlices = CATEGORIES.map(c => ({ key: c.key, val: parseFloat(form[c.key]) || 0 })).filter(s => s.val > 0)
  const categorySpends = budget.spendByCategory || {}

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back + Header */}
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
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-2xl text-xl">💰</span>
            Budget Planner & Expense Tracker
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

        {/* ── Summary Cards (Accurate Real-Time Figures) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Budget',   val: fmt(total, form.currency),       sub: `${allocated > 0 ? fmt(allocated, form.currency) + ' allocated' : 'No allocations'}`, icon: HiOutlineCurrencyDollar, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Activity Spend', val: fmt(actualSpend, form.currency), sub: `${spendPct.toFixed(1)}% of total budget`, icon: HiOutlineTrendingUp,     color: overBudget ? 'text-red-600' : 'text-emerald-600', bg: overBudget ? 'bg-red-50' : 'bg-emerald-50' },
            { label: 'Remaining',      val: fmt(Math.max(0, total - actualSpend), form.currency), sub: 'Available to spend', icon: HiOutlineCheck, color: 'text-neutral-600', bg: 'bg-neutral-50' },
          ].map(({ label, val, sub, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-3xl border border-neutral-100 shadow-card p-5">
              <div className={clsx('w-9 h-9 rounded-2xl flex items-center justify-center mb-3 text-lg', bg)}>
                <Icon className={clsx('w-5 h-5', color)} />
              </div>
              <p className="font-display font-black text-neutral-900 text-2xl leading-tight">{val}</p>
              <p className="text-xs font-bold text-neutral-500 mt-0.5">{label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Enhanced Visual Multi-Segment Spending & Allocation Progress Bar ── */}
        {total > 0 && (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
                  <span>📊</span>
                  Budget Allocation & Spending Progress
                </h3>
                <p className="text-xs text-neutral-400">
                  {fmt(actualSpend, form.currency)} spent of {fmt(total, form.currency)} budget
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={clsx(
                  'px-3 py-1 rounded-xl text-xs font-extrabold',
                  overBudget ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                )}>
                  {spendPct.toFixed(1)}% Spent
                </span>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold">
                  {fmt(Math.max(0, total - actualSpend), form.currency)} Left
                </span>
              </div>
            </div>

            {/* 1. Multi-colored Category Allocation Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                <span>Category Distribution Breakdown</span>
                <span>{allocated > 0 ? `${Math.min(100, Math.round((allocated / total) * 100))}% allocated` : ''}</span>
              </div>

              <div className="h-4 bg-neutral-100 rounded-full overflow-hidden flex shadow-inner">
                {CATEGORIES.map(cat => {
                  const val = parseFloat(form[cat.key]) || 0
                  if (val <= 0) return null
                  const widthPct = (val / total) * 100

                  return (
                    <div
                      key={cat.key}
                      style={{ width: `${widthPct}%` }}
                      className={clsx('h-full transition-all relative group', cat.bar)}
                      title={`${cat.label}: ${fmt(val, form.currency)} (${widthPct.toFixed(1)}%)`}
                    />
                  )
                })}
              </div>
            </div>

            {/* 2. Actual Spend Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                <span>Actual Activity Spending</span>
                <span className={clsx(overBudget ? 'text-red-500' : 'text-emerald-600')}>
                  {fmt(actualSpend, form.currency)} ({spendPct.toFixed(1)}%)
                </span>
              </div>

              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    overBudget ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-primary-600'
                  )}
                  style={{ width: `${spendPct}%` }}
                />
              </div>
            </div>

            {/* Category Color Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 text-xs">
              {CATEGORIES.map(cat => {
                const val = parseFloat(form[cat.key]) || 0
                if (val <= 0) return null

                return (
                  <div key={cat.key} className="flex items-center gap-1.5">
                    <span className={clsx('w-2.5 h-2.5 rounded-full', cat.bar)} />
                    <span className="text-neutral-600 font-medium">{cat.label}:</span>
                    <span className="font-bold text-neutral-900">{fmt(val, form.currency)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Budget Form + Donut Chart ── */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6">
          <div className="flex items-start justify-between gap-8 flex-col lg:flex-row">

            {/* Form left */}
            <div className="flex-1 space-y-5 w-full">
              {/* Currency + Total */}
              <div className="space-y-1.5">
                <div className="flex items-end gap-3">
                  <div className="w-32">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Currency</label>
                    <select
                      id="budget-currency"
                      value={form.currency}
                      onChange={e => set('currency', e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white font-semibold"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700">Total Budget</label>
                      {allocated > 0 && (!form.totalBudget || parseFloat(form.totalBudget) !== allocated) && (
                        <button
                          type="button"
                          onClick={handleSyncCategories}
                          className="text-[11px] font-bold text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <HiOutlineSparkles className="w-3.5 h-3.5" />
                          <span>Set to Sum ({fmt(allocated, form.currency)})</span>
                        </button>
                      )}
                    </div>
                    <input
                      id="total-budget"
                      type="number"
                      min="0"
                      step="1"
                      value={form.totalBudget}
                      onChange={e => set('totalBudget', e.target.value)}
                      placeholder={allocated > 0 ? `Sum: ${allocated}` : "e.g. 3000"}
                      className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 font-bold text-neutral-900"
                    />
                  </div>
                </div>

                {allocated > 0 && !form.totalBudget && (
                  <p className="text-[11px] text-primary-600 font-medium">
                    ✨ Automatically computed from categories: {fmt(allocated, form.currency)}
                  </p>
                )}
              </div>

              {/* Category allocations with Spent Tracker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-neutral-800">Category Allocations & Spent</p>
                    <p className="text-xs text-neutral-400">Set budget limits and view activity spending</p>
                  </div>
                  {total > 0 && (
                    <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-lg', unallocated < 0 ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-600')}>
                      {unallocated >= 0 ? `${fmt(unallocated, form.currency)} unallocated` : `${fmt(-unallocated, form.currency)} over-allocated`}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <CategoryRow
                      key={cat.key}
                      cat={cat}
                      allocatedVal={parseFloat(form[cat.key]) || 0}
                      spentVal={categorySpends[cat.key] || 0}
                      total={total}
                      currency={form.currency}
                      onChange={(k, v) => set(k, v)}
                    />
                  ))}
                </div>
              </div>

              {/* Alert threshold */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
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
                    className="w-24 px-3 py-1.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Bottom save button */}
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <HiOutlineCheck className="w-4 h-4" />
                  <span>{saving ? 'Saving Budget…' : 'Save Budget & Allocations'}</span>
                </button>
              </div>

            </div>

            {/* Donut right */}
            <div className="flex flex-col items-center gap-4 pt-2 shrink-0 self-center lg:self-start bg-neutral-50 p-6 rounded-3xl border border-neutral-100 w-full lg:w-64">
              <DonutChart slices={donutSlices} total={total} currency={form.currency} />
              <div className="space-y-1.5 text-xs w-full">
                {donutSlices.map((s) => {
                  const cat = CATEGORIES.find(c => c.key === s.key) || CATEGORIES[4]
                  return (
                    <div key={s.key} className="flex items-center justify-between gap-2 text-neutral-700">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={clsx('w-2.5 h-2.5 rounded-full shrink-0', cat.bar)} />
                        <span className="truncate">{cat.label}:</span>
                      </div>
                      <span className="font-bold text-neutral-900 shrink-0">{fmt(s.val, form.currency)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  )
}

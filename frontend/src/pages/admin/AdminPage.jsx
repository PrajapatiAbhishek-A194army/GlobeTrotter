import { useState, useEffect, useCallback } from 'react'
import {
  HiOutlineUsers, HiOutlineGlobe, HiOutlineMap, HiOutlineChartBar,
  HiOutlineTrash, HiOutlinePencil, HiOutlineSearch, HiOutlineCheck,
  HiOutlineX, HiOutlineRefresh, HiOutlinePlus, HiOutlineShieldCheck,
  HiOutlineTrendingUp, HiOutlineLocationMarker, HiOutlineBriefcase,
  HiOutlineStar, HiOutlineEye,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import * as adminService from '../../services/admin.service'

const TABS = [
  { id: 'overview',      label: 'Overview',     icon: HiOutlineChartBar },
  { id: 'users',         label: 'Users',        icon: HiOutlineUsers },
  { id: 'destinations',  label: 'Destinations', icon: HiOutlineGlobe },
  { id: 'trips',         label: 'Trips',        icon: HiOutlineMap },
]

const STATUS_COLORS = {
  PLANNING:  'bg-neutral-100 text-neutral-600',
  UPCOMING:  'bg-blue-100 text-blue-700',
  ONGOING:   'bg-primary-100 text-primary-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'bg-primary-50 text-primary-600' }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-black text-2xl text-neutral-900">{value ?? '—'}</p>
      <p className="text-sm font-medium text-neutral-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats }) {
  if (!stats) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-36 bg-neutral-100 rounded-2xl animate-pulse" />)}</div>

  const statusItems = Object.entries(stats.trips.byStatus || {}).sort(([,a],[,b]) => b - a)
  const maxStatus = Math.max(...statusItems.map(([,v]) => v), 1)

  return (
    <div className="space-y-6">
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineUsers}     label="Total Users"        value={stats.users.total}        sub={`+${stats.users.newThisWeek} this week`} color="bg-blue-50 text-blue-600" />
        <StatCard icon={HiOutlineMap}       label="Total Trips"        value={stats.trips.total}        color="bg-primary-50 text-primary-600" />
        <StatCard icon={HiOutlineGlobe}     label="Destinations"       value={stats.destinations}       color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={HiOutlineBriefcase} label="Activities"         value={stats.activities}         sub={`${stats.stops} stops`} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Trip status breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
        <h3 className="font-semibold text-neutral-800 mb-5 flex items-center gap-2">
          <HiOutlineTrendingUp className="w-4 h-4 text-primary-500" />
          Trips by Status
        </h3>
        <div className="space-y-3">
          {statusItems.map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold w-24 text-center', STATUS_COLORS[status])}>
                {status}
              </span>
              <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${(count / maxStatus) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-neutral-700 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [data,    setData]    = useState(null)
  const [search,  setSearch]  = useState('')
  const [role,    setRole]    = useState('')
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.getUsers({ page, limit: 15, search, role })
      setData(res)
    } catch { toast.error('Failed to load users.') }
    finally { setLoading(false) }
  }, [page, search, role])

  useEffect(() => { load() }, [load])

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!window.confirm(`Change role to ${newRole}?`)) return
    try {
      const updated = await adminService.updateUserRole(userId, newRole)
      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? { ...u, role: updated.role } : u),
      }))
      toast.success(`Role updated to ${newRole}.`)
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Permanently delete this user and all their data?')) return
    try {
      await adminService.deleteUser(userId)
      setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId), total: prev.total - 1 }))
      toast.success('User deleted.')
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="user-search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          id="user-role-filter"
          value={role}
          onChange={e => { setRole(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none bg-white"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button onClick={load} className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 transition-colors">
          <HiOutlineRefresh className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['User', 'Email', 'Country', 'Trips', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {(data?.users || []).map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="font-medium text-neutral-900 whitespace-nowrap">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 truncate max-w-[180px]">{user.email}</td>
                    <td className="px-4 py-3 text-neutral-400 text-xs">{user.country || '—'}</td>
                    <td className="px-4 py-3 text-center font-semibold text-neutral-700">{user._count.trips}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold',
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role)}
                          title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <HiOutlineShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.users?.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-neutral-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, data.total)} of {data.total} users
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={clsx('w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                    p === page ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Destination Form Modal ─────────────────────────────────────────────────────
function DestModal({ dest, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:        dest?.name        || '',
    country:     dest?.country     || '',
    continent:   dest?.continent   || '',
    description: dest?.description || '',
    image:       dest?.image       || '',
    costIndex:   dest?.costIndex   != null ? String(dest.costIndex) : '',
    popularity:  dest?.popularity  != null ? String(dest.popularity) : '',
    tags:        dest?.tags?.join(', ')       || '',
    climate:     dest?.climate     || '',
    bestMonths:  dest?.bestMonths?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.country.trim()) { toast.error('Name and country required.'); return }
    setSaving(true)
    try {
      const payload = { ...form,
        costIndex:  form.costIndex  ? parseFloat(form.costIndex)  : null,
        popularity: form.popularity ? parseInt(form.popularity)   : 0,
        tags:       form.tags.split(',').map(t => t.trim()).filter(Boolean),
        bestMonths: form.bestMonths.split(',').map(m => m.trim()).filter(Boolean),
      }
      const saved = dest
        ? await adminService.updateDest(dest.id, payload)
        : await adminService.createDest(payload)
      onSaved(saved, !!dest)
      toast.success(dest ? 'Destination updated.' : 'Destination created.')
      onClose()
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
    finally { setSaving(false) }
  }

  const fields = [
    { k:'name', label:'Name *', span:1 }, { k:'country', label:'Country *', span:1 },
    { k:'continent', label:'Continent', span:1 }, { k:'climate', label:'Climate', span:1 },
    { k:'costIndex', label:'Cost Index (1–10)', span:1 }, { k:'popularity', label:'Popularity (0–100)', span:1 },
    { k:'tags', label:'Tags (comma-separated)', span:2 },
    { k:'bestMonths', label:'Best Months (comma-separated)', span:2 },
    { k:'image', label:'Image URL', span:2 },
    { k:'description', label:'Description', span:2, textarea:true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg">{dest ? 'Edit Destination' : 'Add Destination'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><HiOutlineX className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          {fields.map(({ k, label, span, textarea }) => (
            <div key={k} className={span === 2 ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
              {textarea ? (
                <textarea rows={2} value={form[k]} onChange={e => set(k, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
              ) : (
                <input value={form[k]} onChange={e => set(k, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              )}
            </div>
          ))}
          <div className="col-span-2 flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 font-semibold">
              {saving ? 'Saving…' : dest ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Destinations Tab ──────────────────────────────────────────────────────────
function DestinationsTab() {
  const [dests,   setDests]   = useState(null)
  const [modal,   setModal]   = useState(null) // null | 'create' | dest-object

  useEffect(() => {
    adminService.getDestinations().then(setDests).catch(() => toast.error('Failed to load.'))
  }, [])

  const handleSaved = (saved, isEdit) => {
    setDests(prev => isEdit
      ? prev.map(d => d.id === saved.id ? saved : d)
      : [...(prev || []), saved]
    )
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will not affect existing trips.`)) return
    try {
      await adminService.deleteDest(id)
      setDests(prev => prev.filter(d => d.id !== id))
      toast.success('Destination deleted.')
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          id="add-destination-btn"
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dests === null ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-neutral-100 rounded-2xl animate-pulse" />)
        ) : dests.map(dest => (
          <div key={dest.id} className="group bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden hover:shadow-card-md transition-all">
            <div className="relative h-32 overflow-hidden">
              <img
                src={dest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs">{dest.country}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(dest)} className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 transition-colors">
                    <HiOutlinePencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(dest.id, dest.name)} className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/70 transition-colors">
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {dest.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-primary-50 text-primary-600 text-[10px] rounded-md">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <HiOutlineStar className="w-3.5 h-3.5" />
                {dest.popularity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <DestModal
          dest={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

// ── Trips Tab ─────────────────────────────────────────────────────────────────
function TripsTab() {
  const [data,    setData]    = useState(null)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.getTrips({ page, limit: 15, search, status })
      setData(res)
    } catch { toast.error('Failed to load trips.') }
    finally { setLoading(false) }
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete trip "${title}" and all its data?`)) return
    try {
      await adminService.deleteTrip(id)
      setData(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id), total: prev.total - 1 }))
      toast.success('Trip deleted.')
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="trip-search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search trips…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          id="trip-status-filter"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none bg-white"
        >
          <option value="">All Statuses</option>
          {['PLANNING','UPCOMING','ONGOING','COMPLETED','CANCELLED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={load} className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 transition-colors">
          <HiOutlineRefresh className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Trip', 'Owner', 'Status', 'Stops', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {(data?.trips || []).map(trip => (
                  <tr key={trip.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="font-medium text-neutral-900 truncate">{trip.title}</p>
                      {trip.isPublic && <span className="text-xs text-primary-500">Public</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-neutral-700 font-medium">{trip.user.firstName} {trip.user.lastName}</p>
                      <p className="text-xs text-neutral-400 truncate">{trip.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[trip.status])}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-neutral-600">{trip._count.stops}</td>
                    <td className="px-4 py-3 text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(trip.id, trip.title)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.trips?.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-neutral-400">No trips found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, data.total)} of {data.total} trips
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                    p === page ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                  )}
                >{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats,     setStats]     = useState(null)

  useEffect(() => {
    adminService.getStats().then(setStats).catch(() => {})
  }, [])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-neutral-900 flex items-center gap-2">
              <HiOutlineShieldCheck className="w-6 h-6 text-primary-500" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">Manage users, destinations, and platform data.</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl w-fit flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`admin-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                activeTab === id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'overview' && stats && (
                <span className="ml-1 text-xs text-neutral-400">({stats.users.total}u · {stats.trips.total}t)</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview'     && <OverviewTab     stats={stats} />}
        {activeTab === 'users'        && <UsersTab />}
        {activeTab === 'destinations' && <DestinationsTab />}
        {activeTab === 'trips'        && <TripsTab />}
      </div>
    </AppLayout>
  )
}

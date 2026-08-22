import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUsers, HiOutlineGlobe, HiOutlineMap, HiOutlineChartBar,
  HiOutlineTrash, HiOutlinePencil, HiOutlineSearch, HiOutlineCheck,
  HiOutlineX, HiOutlineRefresh, HiOutlinePlus, HiOutlineShieldCheck,
  HiOutlineTrendingUp, HiOutlineLocationMarker, HiOutlineBriefcase,
  HiOutlineStar, HiOutlineEye, HiOutlineCurrencyDollar, HiOutlineSparkles,
  HiOutlineUserGroup, HiOutlineCalendar,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import AppLayout from '../../layouts/AppLayout'
import Button from '../../components/ui/Button'
import * as adminService from '../../services/admin.service'

const TABS = [
  { id: 'overview',      label: 'Analytics & Trends', icon: HiOutlineChartBar },
  { id: 'users',         label: 'User Management',   icon: HiOutlineUsers },
  { id: 'destinations',  label: 'Destinations',       icon: HiOutlineGlobe },
  { id: 'trips',         label: 'All Trips',          icon: HiOutlineMap },
]

const STATUS_COLORS = {
  PLANNING:  'bg-neutral-100 text-neutral-600',
  UPCOMING:  'bg-blue-100 text-blue-700',
  ONGOING:   'bg-primary-100 text-primary-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const CATEGORY_EMOJIS = {
  SIGHTSEEING: '🏛️', ADVENTURE: '🧗', FOOD_DINING: '🍜', CULTURE: '🎭',
  SHOPPING: '🛍️', TRANSPORT: '🚌', ACCOMMODATION: '🏨', ENTERTAINMENT: '🎡',
  WELLNESS: '🧘', NATURE: '🌿', OTHER: '📌',
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'bg-primary-50 text-primary-600' }) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-5">
      <div className={clsx('w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-lg', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display font-black text-2xl text-neutral-900">{value ?? '—'}</p>
      <p className="text-xs font-bold text-neutral-600 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Overview & Analytics Tab ──────────────────────────────────────────────────
function OverviewTab({ stats }) {
  if (!stats) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-36 bg-neutral-100 rounded-3xl animate-pulse" />)}</div>

  const statusItems = Object.entries(stats.trips.byStatus || {}).sort(([,a],[,b]) => b - a)
  const maxStatus = Math.max(...statusItems.map(([,v]) => v), 1)

  const topCities = stats.topCities || []
  const maxCityCount = Math.max(...topCities.map(c => c.stopsCount), 1)

  const categories = stats.categoriesBreakdown || []
  const maxCatCount = Math.max(...categories.map(c => c.count), 1)

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineUsers}
          label="Total Users"
          value={stats.users.total}
          sub={`+${stats.users.newThisWeek} this week · avg ${stats.users.avgTripsPerUser} trips/user`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={HiOutlineMap}
          label="Total Itineraries"
          value={stats.trips.total}
          sub={`${stats.stops} stops · ${stats.activities} activities`}
          color="bg-primary-50 text-primary-600"
        />
        <StatCard
          icon={HiOutlineGlobe}
          label="Active Destinations"
          value={stats.destinations}
          sub="Global travel catalog"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Tracked Budgets"
          value={`$${(stats.totalBudgetTracked || 0).toLocaleString()}`}
          sub="Platform-wide trip budgets"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Grid: Popular Cities + Activity Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Top Popular Cities */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary-600" />
                Most Popular Cities & Destinations
              </h3>
              <p className="text-xs text-neutral-400">Ranked by frequency in user itineraries & stops</p>
            </div>
          </div>

          {topCities.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No city data available yet.</p>
          ) : (
            <div className="space-y-3 pt-1">
              {topCities.map((item, idx) => (
                <div key={item.city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      <span>{item.city}</span>
                    </span>
                    <span className="font-semibold text-primary-600">{item.stopsCount} stops</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${(item.stopsCount / maxCityCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Top Activity Categories */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-amber-500" />
                Popular Activity Types & Categories
              </h3>
              <p className="text-xs text-neutral-400">Breakdown of scheduled traveler experiences</p>
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No activity data yet.</p>
          ) : (
            <div className="space-y-3 pt-1">
              {categories.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <span>{CATEGORY_EMOJIS[cat.category] || '📌'}</span>
                      <span className="capitalize">{cat.category.toLowerCase().replace('_', ' ')}</span>
                    </span>
                    <span className="text-neutral-500 font-medium">
                      <strong>{cat.count}</strong> events · ${cat.totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid: Trip Status Lifecycle & Recent User Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Trips Status Funnel */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
            <HiOutlineTrendingUp className="w-5 h-5 text-primary-500" />
            Trip Lifecycle & Status
          </h3>
          <div className="space-y-3">
            {statusItems.map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-bold w-28 text-center', STATUS_COLORS[status])}>
                  {status}
                </span>
                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-neutral-800 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 flex items-center gap-2">
            <HiOutlineUserGroup className="w-5 h-5 text-blue-500" />
            Recent User Signups
          </h3>
          <div className="divide-y divide-neutral-100">
            {(stats.recentUsers || []).map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                    {u.avatar ? (
                      <img src={u.avatar.startsWith('http') ? u.avatar : `http://localhost:5000${u.avatar}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{u.firstName?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-900 truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-neutral-400 text-[11px] truncate">{u.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                    {u._count.trips} trips
                  </span>
                </div>
              </div>
            ))}
          </div>
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

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await adminService.updateUserRole(user.id, newRole)
      toast.success(`Updated ${user.firstName}'s role to ${newRole}!`)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update role.')
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}" (${user.email})?`)) return
    try {
      await adminService.deleteUser(user.id)
      toast.success('User deleted.')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user.')
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden space-y-4">
      {/* Search & Filter Header */}
      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-neutral-900">User Management</h3>
          <p className="text-xs text-neutral-400">View registered accounts, change roles, and manage permissions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <select
            value={role}
            onChange={e => { setRole(e.target.value); setPage(1) }}
            className="px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white font-medium"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100">
            <tr>
              <th className="py-3.5 px-6">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Trips Created</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">Loading users…</td></tr>
            ) : !data?.users?.length ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">No users found.</td></tr>
            ) : (
              data.users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar.startsWith('http') ? u.avatar : `http://localhost:5000${u.avatar}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{u.firstName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{u.firstName} {u.lastName}</p>
                        <p className="text-neutral-400 text-[11px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={clsx(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold',
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-700">
                    {u._count.trips}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-700"
                      title="Toggle between User and Admin"
                    >
                      {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Destinations Tab ──────────────────────────────────────────────────────────
function DestinationsTab() {
  const [destinations, setDestinations] = useState([])
  const [search,       setSearch]       = useState('')
  const [loading,      setLoading]      = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await adminService.getAllDestinations()
      setDestinations(list || [])
    } catch { toast.error('Failed to load destinations.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete destination "${d.name}"?`)) return
    try {
      await adminService.deleteDestination(d.id)
      toast.success('Destination deleted.')
      load()
    } catch { toast.error('Failed to delete destination.') }
  }

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase()) ||
    d.continent.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden space-y-4">
      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-neutral-900">Destination Directory</h3>
          <p className="text-xs text-neutral-400">{destinations.length} global cities cataloged</p>
        </div>

        <div className="w-64 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search city, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100">
            <tr>
              <th className="py-3.5 px-6">Destination</th>
              <th className="py-3.5 px-4">Continent</th>
              <th className="py-3.5 px-4">Popularity</th>
              <th className="py-3.5 px-4">Cost Index</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">Loading destinations…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">No destinations match your search.</td></tr>
            ) : (
              filtered.map(d => (
                <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                        <img
                          src={d.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' }}
                        />
                      </div>
                      <div>
                        <Link to={`/destinations/${d.id}`} className="font-bold text-neutral-900 hover:text-primary-600">
                          {d.name}
                        </Link>
                        <p className="text-neutral-400 text-[11px]">{d.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 font-medium">{d.continent}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-amber-600">★ {d.popularity}/100</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-700">{d.costIndex}/10</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDelete(d)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Destination"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      const res = await adminService.getAllTrips({ page, limit: 15, search, status })
      setData(res)
    } catch { toast.error('Failed to load trips.') }
    finally { setLoading(false) }
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const handleDelete = async (trip) => {
    if (!window.confirm(`Delete trip "${trip.title}"?`)) return
    try {
      await adminService.deleteTrip(trip.id)
      toast.success('Trip deleted.')
      load()
    } catch { toast.error('Failed to delete trip.') }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-card overflow-hidden space-y-4">
      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-neutral-900">All Platform Itineraries</h3>
          <p className="text-xs text-neutral-400">Inspect user itineraries, privacy flags, and stops</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search trip title…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100">
            <tr>
              <th className="py-3.5 px-6">Trip</th>
              <th className="py-3.5 px-4">Owner</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Stops</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">Loading trips…</td></tr>
            ) : !data?.trips?.length ? (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400">No trips found.</td></tr>
            ) : (
              data.trips.map(trip => (
                <tr key={trip.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                        {trip.coverImage ? (
                          <img
                            src={trip.coverImage.startsWith('http') ? trip.coverImage : `http://localhost:5000${trip.coverImage}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">🌍</div>
                        )}
                      </div>
                      <div>
                        <Link to={`/trips/${trip.id}`} className="font-bold text-neutral-900 hover:text-primary-600">
                          {trip.title}
                        </Link>
                        <p className="text-neutral-400 text-[11px]">
                          {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Dates TBD'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-neutral-800">{trip.user.firstName} {trip.user.lastName}</p>
                    <p className="text-neutral-400 text-[11px]">{trip.user.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={clsx('px-2.5 py-0.5 rounded-full text-[10px] font-bold', STATUS_COLORS[trip.status])}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-700">
                    {trip._count.stops} stops
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <Link to={`/trips/${trip.id}`}>
                      <button className="px-2.5 py-1 text-[11px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg">
                        Inspect
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(trip)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Trip"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Admin Root Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(true)

  const loadStats = useCallback(async () => {
    try {
      const s = await adminService.getPlatformStats()
      setStats(s)
    } catch { toast.error('Failed to load admin stats.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2.5">
              <span className="p-2 bg-purple-100 text-purple-700 rounded-2xl text-xl">🛡️</span>
              Admin Intelligence & Control Center
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Track platform adoption, popular cities, user engagement trends, and manage platform data.
            </p>
          </div>

          <button
            onClick={loadStats}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <HiOutlineRefresh className="w-3.5 h-3.5 text-neutral-500" />
            Refresh Analytics
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                  active
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview'     && <OverviewTab stats={stats} />}
        {activeTab === 'users'        && <UsersTab />}
        {activeTab === 'destinations' && <DestinationsTab />}
        {activeTab === 'trips'        && <TripsTab />}

      </div>
    </AppLayout>
  )
}

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineGlobeAlt, HiOutlineHome, HiOutlineMap,
  HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineSearch,
  HiOutlineUsers, HiOutlineUser, HiOutlineChartBar,
  HiOutlineLogout, HiOutlineMenuAlt2, HiX, HiOutlinePlus,
  HiOutlineBell, HiChevronLeft, HiChevronRight,
} from 'react-icons/hi'
import { clsx } from 'clsx'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navGroups = [
  {
    label: 'Main',
    items: [
      { icon: HiOutlineHome,           label: 'Dashboard',    href: '/dashboard' },
      { icon: HiOutlineMap,            label: 'My Trips',     href: '/trips' },
      { icon: HiOutlineCalendar,       label: 'Itinerary',    href: '/itinerary' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { icon: HiOutlineSearch,         label: 'Discover',     href: '/discover/cities' },
      { icon: HiOutlineCurrencyDollar, label: 'Budget',       href: '/budget' },
      { icon: HiOutlineCalendar,       label: 'Calendar',     href: '/calendar' },
    ],
  },
  {
    label: 'Community',
    items: [
      { icon: HiOutlineUsers,          label: 'Community',    href: '/community' },
      { icon: HiOutlineUser,           label: 'Profile',      href: '/profile' },
    ],
  },
]

const adminNav = {
  label: 'Admin',
  items: [
    { icon: HiOutlineChartBar, label: 'Admin Panel', href: '/admin' },
  ],
}

// Sidebar link item
function NavItem({ item, collapsed, active }) {
  return (
    <Link
      to={item.href}
      title={collapsed ? item.label : undefined}
      className={clsx(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative',
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      )}
    >
      <item.icon className={clsx('w-5 h-5 shrink-0', active ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
      {!collapsed && (
        <span className="truncate flex-1">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary-100 text-primary-600 rounded-md">{item.badge}</span>
      )}
      {/* Active indicator dot */}
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-500" />
      )}
    </Link>
  )
}

export default function AppLayout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()

  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  // Close mobile drawer on navigation
  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    toast.success('Logged out. See you on your next adventure! ✈️')
    navigate('/')
  }

  const allGroups = isAdmin ? [...navGroups, adminNav] : navGroups

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 px-4 py-5 border-b border-neutral-100', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
          <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-neutral-900 text-lg tracking-tight">
            Globe<span className="text-primary-600">Trotter</span>
          </span>
        )}
      </div>

      {/* Quick action */}
      {!collapsed && (
        <div className="px-3 py-3">
          <Link to="/trips/new">
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm hover:shadow-green-glow">
              <HiOutlinePlus className="w-4 h-4" />
              Plan New Trip
            </button>
          </Link>
        </div>
      )}
      {collapsed && (
        <div className="px-2 py-3">
          <Link to="/trips/new" title="Plan New Trip">
            <button className="w-full flex items-center justify-center p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </Link>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-5 scrollbar-thin">
        {allGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  active={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className={clsx('border-t border-neutral-100 p-3', collapsed && 'px-2')}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center text-sm font-bold text-primary-700 hover:ring-2 hover:ring-primary-400 transition-all">
                {user?.avatar ? (
                  <img
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to="/profile" className="hover:underline">
                <p className="text-sm font-semibold text-neutral-800 truncate">{user?.firstName} {user?.lastName}</p>
              </Link>
              <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link to="/profile" title={`${user?.firstName} ${user?.lastName}`}>
              <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center text-sm font-bold text-primary-700 hover:ring-2 hover:ring-primary-400 transition-all">
                {user?.avatar ? (
                  <img
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                )}
              </div>
            </Link>
            <button onClick={handleLogout} title="Logout" className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">

      {/* ── Desktop Sidebar ── */}
      <aside className={clsx(
        'hidden lg:flex flex-col bg-white border-r border-neutral-100 shadow-sm transition-all duration-300 relative shrink-0',
        collapsed ? 'w-[72px]' : 'w-64'
      )}>
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:border-primary-300 transition-all z-10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <HiChevronRight className="w-3.5 h-3.5" /> : <HiChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top Header ── */}
        <header className="bg-white border-b border-neutral-100 shrink-0">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenuAlt2 className="w-5 h-5" />}
            </button>

            {/* Page breadcrumb — desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-500">
              <HiOutlineGlobeAlt className="w-4 h-4 text-primary-500" />
              <span className="text-neutral-300">/</span>
              <span className="font-medium text-neutral-700 capitalize">
                {location.pathname.split('/')[1] || 'dashboard'}
              </span>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
              </button>

              {/* User avatar */}
              <Link to="/profile" className="flex items-center gap-2.5 pl-2 group">
                <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center text-sm font-bold text-primary-700 group-hover:ring-2 group-hover:ring-primary-300 transition-all">
                  {user?.avatar ? (
                    <img
                      src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  )}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-neutral-800 leading-tight">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-neutral-400 leading-tight capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}

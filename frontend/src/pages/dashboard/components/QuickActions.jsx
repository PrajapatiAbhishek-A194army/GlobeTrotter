import { Link } from 'react-router-dom'
import { HiOutlinePlus, HiArrowRight, HiOutlineMap, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineSearch } from 'react-icons/hi'

const actions = [
  {
    icon:     HiOutlinePlus,
    label:    'New Trip',
    sublabel: 'Start planning',
    href:     '/trips/new',
    color:    'bg-primary-50 text-primary-600 hover:bg-primary-100',
    ring:     'ring-primary-100',
  },
  {
    icon:     HiOutlineSearch,
    label:    'Discover',
    sublabel: 'Find destinations',
    href:     '/discover/cities',
    color:    'bg-blue-50 text-blue-600 hover:bg-blue-100',
    ring:     'ring-blue-100',
  },
  {
    icon:     HiOutlineCurrencyDollar,
    label:    'Budget',
    sublabel: 'Track spending',
    href:     '/trips',
    color:    'bg-amber-50 text-amber-600 hover:bg-amber-100',
    ring:     'ring-amber-100',
  },
  {
    icon:     HiOutlineCalendar,
    label:    'Calendar',
    sublabel: 'Day planner',
    href:     '/trips',
    color:    'bg-purple-50 text-purple-600 hover:bg-purple-100',
    ring:     'ring-purple-100',
  },
  {
    icon:     HiOutlineMap,
    label:    'My Trips',
    sublabel: 'All adventures',
    href:     '/trips',
    color:    'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    ring:     'ring-emerald-100',
  },
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-semibold text-neutral-900 text-lg">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {actions.map(({ icon: Icon, label, sublabel, href, color, ring }) => (
          <Link key={label} to={href} className="group flex flex-col items-center text-center gap-2 p-3 rounded-xl hover:-translate-y-0.5 transition-all duration-150">
            <div className={`w-12 h-12 rounded-2xl ring-1 ${ring} ${color} flex items-center justify-center transition-colors duration-150`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors leading-tight">{label}</p>
              <p className="text-xs text-neutral-400 leading-tight hidden sm:block">{sublabel}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

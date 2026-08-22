import { clsx } from 'clsx'

const statConfigs = [
  {
    key:     'total',
    label:   'Total Trips',
    emoji:   '🗺️',
    color:   'bg-primary-50 text-primary-600 ring-primary-100',
    gradient: 'from-primary-50',
  },
  {
    key:     'upcoming',
    label:   'Upcoming',
    emoji:   '✈️',
    color:   'bg-blue-50 text-blue-600 ring-blue-100',
    gradient: 'from-blue-50',
  },
  {
    key:     'countries',
    label:   'Countries',
    emoji:   '🌍',
    color:   'bg-amber-50 text-amber-600 ring-amber-100',
    gradient: 'from-amber-50',
  },
  {
    key:     'completed',
    label:   'Completed',
    emoji:   '✅',
    color:   'bg-emerald-50 text-emerald-600 ring-emerald-100',
    gradient: 'from-emerald-50',
  },
]

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {statConfigs.map(({ key, label, emoji, color, gradient }) => (
        <div
          key={key}
          className={clsx(
            'relative overflow-hidden bg-white rounded-2xl border border-neutral-100 shadow-card p-5',
            'hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200'
          )}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-white opacity-50`} />

          <div className="relative flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ring-1 ${color} flex items-center justify-center text-lg`}>
              {emoji}
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <div className="h-8 w-16 bg-neutral-200 rounded-lg animate-pulse mb-1" />
            ) : (
              <p className="font-display font-black text-3xl text-neutral-900 mb-0.5">
                {stats?.[key] ?? 0}
              </p>
            )}
            <p className="text-sm text-neutral-500 font-medium">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

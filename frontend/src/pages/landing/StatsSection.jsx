const stats = [
  { value: '50,000+', label: 'Trips Created',      sublabel: 'and counting every day',   emoji: '🗺️' },
  { value: '120+',    label: 'Countries Covered',   sublabel: 'across 6 continents',      emoji: '🌏' },
  { value: '$2.1M',   label: 'Budgets Managed',     sublabel: 'in travel spending tracked', emoji: '💰' },
  { value: '18,000+', label: 'Happy Travelers',     sublabel: '4.9★ average rating',      emoji: '⭐' },
]

export default function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stats-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-white text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            Trusted by travelers worldwide
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Join a growing community of explorers who plan smarter with GlobeTrotter.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, sublabel, emoji }) => (
            <div
              key={label}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-7 text-center hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <p className="font-display font-black text-white text-4xl md:text-5xl mb-1.5">{value}</p>
              <p className="font-semibold text-white text-sm mb-1">{label}</p>
              <p className="text-primary-200 text-xs">{sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

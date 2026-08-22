const steps = [
  {
    number: '01',
    emoji: '✏️',
    title: 'Create Your Trip',
    description: 'Name your adventure, set your dates, and choose your travel style. GlobeTrotter handles the rest.',
    color: 'from-primary-50 to-white',
    borderColor: 'border-primary-100',
  },
  {
    number: '02',
    emoji: '📍',
    title: 'Add Destinations',
    description: 'Search and add cities from our global database. Reorder stops, assign travel dates, and explore the map.',
    color: 'from-blue-50 to-white',
    borderColor: 'border-blue-100',
  },
  {
    number: '03',
    emoji: '🗓️',
    title: 'Build Your Itinerary',
    description: 'Fill each day with activities, restaurants, and experiences. Use our discovery engine to find hidden gems.',
    color: 'from-amber-50 to-white',
    borderColor: 'border-amber-100',
  },
  {
    number: '04',
    emoji: '✈️',
    title: 'Travel & Share',
    description: 'Export, share via public link, or invite your travel buddies. Track budgets in real-time as you go.',
    color: 'from-purple-50 to-white',
    borderColor: 'border-purple-100',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">How It Works</span>
          </div>
          <h2 className="font-display font-bold text-neutral-900 text-3xl md:text-4xl lg:text-5xl tracking-tight">
            Trip planning in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Go from blank canvas to fully-planned adventure in minutes, not hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ number, emoji, title, description, color, borderColor }, idx) => (
            <div key={number} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] right-[-50%] h-px border-t-2 border-dashed border-primary-200 z-10" />
              )}

              <div className={`bg-gradient-to-b ${color} rounded-2xl border ${borderColor} p-7 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 h-full`}>
                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                  <span className="font-display font-black text-4xl text-neutral-100 select-none">
                    {number}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2.5">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

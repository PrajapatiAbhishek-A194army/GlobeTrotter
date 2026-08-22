import SectionHeader from '../../components/ui/SectionHeader'

const features = [
  {
    icon: '🗺️',
    title: 'Multi-City Trip Builder',
    description: 'Plan seamless journeys across multiple cities with drag-and-drop stop reordering, date assignment, and interactive maps.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
    badge: 'Core Feature',
  },
  {
    icon: '📅',
    title: 'Day-wise Itinerary',
    description: 'Build hour-by-hour schedules for every day of your trip. Add activities, restaurants, and experiences with a calendar view.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    badge: 'Popular',
  },
  {
    icon: '💰',
    title: 'Smart Budget Planner',
    description: 'Track every expense — transport, hotels, meals, activities. Visual charts and smart alerts keep you on budget.',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    badge: 'Essential',
  },
  {
    icon: '🔍',
    title: 'City & Activity Discovery',
    description: 'Explore thousands of destinations and activities. Filter by category, cost, duration, and popularity using live search.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    badge: 'Explorer',
  },
  {
    icon: '🌐',
    title: 'Interactive Maps',
    description: 'Visualize your route with Leaflet-powered maps. See all stops, activities, and nearby places on a live interactive map.',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
    badge: 'Maps',
  },
  {
    icon: '🔗',
    title: 'Share & Collaborate',
    description: 'Share your itinerary via public link, invite travel buddies, and inspire others. Copy any public trip as your own template.',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100',
    badge: 'Social',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Everything You Need"
          title="Features built for real travelers"
          subtitle="From solo backpackers to luxury jet-setters, GlobeTrotter adapts to every kind of adventure."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, description, color, iconBg, badge }) => (
            <div
              key={title}
              className={`group relative bg-white rounded-2xl border p-7 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 cursor-default ${color} bg-white`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl shadow-sm`}>
                  {icon}
                </div>
                <span className="px-2.5 py-0.5 bg-white rounded-full text-xs font-semibold text-neutral-500 border border-neutral-200 shadow-sm">
                  {badge}
                </span>
              </div>

              <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2.5 group-hover:text-primary-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>

              {/* Hover arrow */}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

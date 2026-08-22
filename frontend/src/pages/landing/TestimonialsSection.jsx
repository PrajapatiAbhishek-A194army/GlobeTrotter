const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Solo Travel Blogger',
    location: 'San Francisco, CA',
    avatar: 'SC',
    avatarColor: 'bg-pink-100 text-pink-700',
    rating: 5,
    text: "GlobeTrotter completely transformed how I plan my trips. I used to spend hours on spreadsheets — now I have a beautiful itinerary in 20 minutes. The budget tracker alone saved me $400 on my Japan trip!",
    trip: 'Japan 3-Week Adventure',
    tripEmoji: '🏯',
  },
  {
    id: 2,
    name: 'Marco Rossi',
    role: 'Family Travel Enthusiast',
    location: 'Milan, Italy',
    avatar: 'MR',
    avatarColor: 'bg-blue-100 text-blue-700',
    rating: 5,
    text: "Planning a family trip with four kids sounds impossible, but GlobeTrotter made it manageable. The day-wise itinerary builder is genius — I could assign activities for each family member and track costs in real time.",
    trip: 'Europe Family Tour',
    tripEmoji: '🚂',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Digital Nomad',
    location: 'Bengaluru, India',
    avatar: 'PS',
    avatarColor: 'bg-purple-100 text-purple-700',
    rating: 5,
    text: "As someone who works while traveling, having a clear itinerary is crucial. The shared trips feature is my favorite — I share my plans with family so they always know where I am. The maps integration is stunning!",
    trip: 'Southeast Asia Circuit',
    tripEmoji: '🌴',
  },
  {
    id: 4,
    name: 'James O\'Brien',
    role: 'Adventure Photographer',
    location: 'Dublin, Ireland',
    avatar: 'JO',
    avatarColor: 'bg-amber-100 text-amber-700',
    rating: 5,
    text: "The destination discovery feature opened my eyes to places I'd never considered. Found three hidden gem locations in Patagonia that turned into the best shots of my career. GlobeTrotter thinks like a traveler.",
    trip: 'Patagonia Photography Tour',
    tripEmoji: '📸',
  },
  {
    id: 5,
    name: 'Yuki Tanaka',
    role: 'Honeymoon Couple',
    location: 'Osaka, Japan',
    avatar: 'YT',
    avatarColor: 'bg-rose-100 text-rose-700',
    rating: 5,
    text: "We planned our entire honeymoon on GlobeTrotter. The budget planner helped us stay within limits without sacrificing experiences. The interface is so beautiful it made planning feel like part of the adventure.",
    trip: 'European Honeymoon',
    tripEmoji: '💑',
  },
  {
    id: 6,
    name: 'Alex Thompson',
    role: 'Corporate Travel Manager',
    location: 'London, UK',
    avatar: 'AT',
    avatarColor: 'bg-teal-100 text-teal-700',
    rating: 5,
    text: "I use GlobeTrotter to plan executive team retreats. The ability to create detailed day-by-day schedules and share them with 20+ people via link has saved us countless coordination hours and confused email chains.",
    trip: 'Q4 Leadership Retreat',
    tripEmoji: '💼',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">Testimonials</span>
          </div>
          <h2 className="font-display font-bold text-neutral-900 text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            Loved by explorers everywhere
          </h2>
          <div className="flex items-center justify-center gap-2 text-neutral-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-neutral-700">4.9 out of 5</span>
            <span>· Based on 18,000+ reviews</span>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-neutral-100 shadow-card p-7 hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-neutral-600 leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Trip badge */}
              <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-primary-50 rounded-xl">
                <span>{t.tripEmoji}</span>
                <span className="text-xs font-medium text-primary-700">{t.trip}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

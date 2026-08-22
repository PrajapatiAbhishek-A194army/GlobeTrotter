import { useState } from 'react'
import { HiPlus, HiMinus } from 'react-icons/hi'

const faqs = [
  {
    q: 'Is GlobeTrotter free to use?',
    a: 'Yes! GlobeTrotter offers a generous free plan that lets you create unlimited trips, build itineraries, and use all core features. Premium plans unlock advanced features like collaborative planning, AI suggestions, and priority support.',
  },
  {
    q: 'Can I plan trips with my travel group?',
    a: 'Absolutely. You can share any trip via a public link for read-only viewing, or invite collaborators by email. Everyone can view the itinerary in real-time, and premium users can co-edit together.',
  },
  {
    q: 'Does GlobeTrotter work offline?',
    a: 'Your trip details are synced to the cloud and accessible from any device. We\'re working on offline mode for our mobile apps, which will be available in an upcoming release.',
  },
  {
    q: 'How does the budget tracker work?',
    a: 'Each trip has a dedicated budget module where you set a total budget and allocate amounts to categories (transport, accommodation, meals, activities). As you add activities with costs, the system tracks spending in real-time and alerts you when approaching limits.',
  },
  {
    q: 'Can I import existing itineraries or bookings?',
    a: 'You can manually add any booking details, and we support copying any public GlobeTrotter itinerary as a template. CSV import and booking platform integrations are on our roadmap for later this year.',
  },
  {
    q: 'What maps and location data does GlobeTrotter use?',
    a: 'GlobeTrotter uses Leaflet with OpenStreetMap for interactive maps, giving you beautiful location visualization without any API costs. You get destination markers, route visualization, and nearby place suggestions for every stop.',
  },
  {
    q: 'Is my travel data secure and private?',
    a: 'Your data is encrypted in transit and at rest. Private trips are never accessible to other users. We never sell your data. You can delete your account and all associated data at any time from your profile settings.',
  },
  {
    q: 'Can I export my itinerary as a PDF?',
    a: 'PDF export is available on all plans. You can generate a beautifully formatted travel document with your full itinerary, maps, budget summary, and packing list — perfect for printing or sharing offline.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`rounded-xl border transition-all duration-200 ${open ? 'border-primary-200 bg-primary-50/50 shadow-sm' : 'border-neutral-200 bg-white hover:border-primary-100'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-neutral-900 text-sm leading-snug">{q}</span>
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${open ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
          {open ? <HiMinus className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-64' : 'max-h-0'}`}>
        <p className="px-6 pb-5 text-sm text-neutral-500 leading-relaxed border-t border-primary-100 pt-4">
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section className="py-24 bg-surface-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">FAQ</span>
          </div>
          <h2 className="font-display font-bold text-neutral-900 text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-neutral-500">
            Can't find what you're looking for?{' '}
            <a href="mailto:support@globetrotter.app" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our support team.
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

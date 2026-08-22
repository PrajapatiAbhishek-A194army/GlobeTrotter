import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlineCheckCircle } from 'react-icons/hi'
import Button from '../../components/ui/Button'

const perks = [
  'No credit card required',
  'Unlimited trips on free plan',
  'Cancel anytime',
  'Data export included',
]

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 md:p-16 text-center shadow-2xl">

          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-dots)" />
            </svg>
          </div>

          {/* Globe emoji */}
          <div className="relative text-6xl mb-6 animate-float">🌍</div>

          {/* Headline */}
          <div className="relative">
            <h2 className="font-display font-black text-white text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-5">
              Ready to start your<br />
              <span className="text-primary-200">next adventure?</span>
            </h2>
            <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 18,000+ travelers who plan smarter with GlobeTrotter. Your dream trip is just a few clicks away.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-sm text-primary-100">
                  <HiOutlineCheckCircle className="w-4 h-4 text-primary-300 shrink-0" />
                  {perk}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button
                  variant="white"
                  size="xl"
                  rightIcon={<HiArrowRight className="w-5 h-5" />}
                  className="font-bold shadow-xl"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/discover/cities">
                <Button
                  size="xl"
                  className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 font-semibold rounded-xl px-8 py-4 text-lg transition-all duration-200"
                >
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

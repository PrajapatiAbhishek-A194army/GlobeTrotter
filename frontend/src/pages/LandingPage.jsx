import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import HeroSection        from './landing/HeroSection'
import FeaturesSection    from './landing/FeaturesSection'
import DestinationsSection from './landing/DestinationsSection'
import HowItWorksSection  from './landing/HowItWorksSection'
import StatsSection       from './landing/StatsSection'
import TestimonialsSection from './landing/TestimonialsSection'
import FAQSection         from './landing/FAQSection'
import CTASection         from './landing/CTASection'

export default function LandingPage() {
  const location = useLocation()

  // Handle smooth scroll when navigating to sections with hash or query
  useEffect(() => {
    const hash = location.hash || (new URLSearchParams(location.search).get('section') ? `#${new URLSearchParams(location.search).get('section')}` : '')
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DestinationsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </PublicLayout>
  )
}

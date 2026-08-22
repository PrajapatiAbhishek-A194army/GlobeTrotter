import { useEffect } from 'react'
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
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

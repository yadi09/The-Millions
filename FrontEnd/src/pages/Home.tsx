import { HeroSection, type HeroContent } from "../components/HeroSection"
import { ServicesGrid, type ServicesContent } from "../components/ServicesGrid"
import { AboutSection, type AboutContent } from "../components/about-section"
import { WhyChooseUs, type WhyChooseUsContent } from "../components/why-choose-us"
import { TestimonialsPreview, type TestimonialsContent } from "../components/testimonials-preview"
import { ContactSection, type ContactContent } from "../components/contact-section"
import { useGetPageQuery } from "../features/api/apiSlice"
import { Loader2 } from "lucide-react"

const Home = () => {
  const { data, isLoading, error } = useGetPageQuery('home')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading page content. Please try again later.
      </div>
    )
  }

  const sections = data?.sections || []

  const heroSection = sections.find((s: any) => s.type === 'hero')
  const servicesSection = sections.find((s: any) => s.type === 'services')
  const aboutSection = sections.find((s: any) => s.type === 'about')
  const statsSection = sections.find((s: any) => s.type === 'stats')
  const whySection = sections.find((s: any) => s.type === 'why-choose-us')
  const testimonialsSection = sections.find((s: any) => s.type === 'testimonials')
  const ctaSection = sections.find((s: any) => s.type === 'cta')

  return (
    <main className="min-h-screen">
      <HeroSection content={heroSection?.content as HeroContent} />
      <ServicesGrid content={servicesSection?.content as ServicesContent} />
      <AboutSection
        content={aboutSection?.content as AboutContent}
        stats={statsSection?.content?.items}
      />
      <WhyChooseUs content={whySection?.content as WhyChooseUsContent} />
      <TestimonialsPreview content={testimonialsSection?.content as TestimonialsContent} />
      <ContactSection content={ctaSection?.content as ContactContent} />
    </main>
  )
}

export default Home
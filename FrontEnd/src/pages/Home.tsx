import { HeroSection } from "../components/HeroSection"
import { ServicesGrid } from "../components/ServicesGrid"
import { AboutSection } from "../components/about-section"
import { WhyChooseUs } from "../components/why-choose-us"
import { TestimonialsPreview } from "../components/testimonials-preview"
import { ContactSection } from "../components/contact-section"

const Home = () => {
  return (
<main className="min-h-screen">
      <HeroSection />
      <ServicesGrid />
      <AboutSection />
      <WhyChooseUs />
      <TestimonialsPreview />
      <ContactSection />
    </main>  )
}

export default Home
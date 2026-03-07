import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

// Fallback placeholder for missing images
const PLACEHOLDER_IMAGE = "/placeholder.svg"

// Types matching backend seed data structure
interface TestimonialData {
  clientName: string
  company: string
  role: string
  text: string
  imageUrl?: string
  rating: number
}

interface TestimonialStats {
  satisfaction: string
  relationship: string
  clients: string
}

export interface TestimonialsContent {
  title?: string
  subtitle?: string
  stats?: TestimonialStats
  testimonials?: TestimonialData[]
}

interface TestimonialsPreviewProps {
  content?: TestimonialsContent
}

// Static fallback data — only used if backend data is unavailable
const fallbackTestimonials: TestimonialData[] = [
  {
    clientName: "Yadamzer Terefe",
    role: "CEO & Founder",
    company: "Yadamzer Business Group",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 5,
    text: "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
  },
  {
    clientName: "Mark Zuckerberg",
    role: "CEO & Founder",
    company: "Meta Platforms Inc.",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 5,
    text: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
  },
  {
    clientName: "Elon Musk",
    role: "CEO & Founder",
    company: "Tesla Inc.",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 5,
    text: "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
  },
  {
    clientName: "Jack Ma",
    role: "CEO & Founder",
    company: "Alibaba Group",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 5,
    text: "The Millions implemented a cloud-based system that handles everything seamlessly. They are the best accountants in the world. I highly recommend them.",
  },
]

const fallbackStats = [
  { label: "Client Satisfaction", value: "98%" },
  { label: "Average Relationship", value: "5+ Years" },
  { label: "Businesses Served", value: "500+" },
]

export function TestimonialsPreview({ content }: TestimonialsPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use backend data if available, otherwise fall back to static data
  const testimonials = content?.testimonials && content.testimonials.length > 0
    ? content.testimonials
    : fallbackTestimonials

  const quickStats = content?.stats
    ? [
      { label: "Client Satisfaction", value: content.stats.satisfaction },
      { label: "Average Relationship", value: content.stats.relationship },
      { label: "Businesses Served", value: content.stats.clients },
    ]
    : fallbackStats

  const sectionTitle = content?.title || "What Our Clients Say"
  const sectionSubtitle = content?.subtitle || "Don't just take our word for it. Here's what our satisfied clients have to say about working with us."

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  // Helper to get image src with fallback
  const getImageSrc = (imageUrl?: string) => {
    return imageUrl && imageUrl.trim() !== "" ? imageUrl : PLACEHOLDER_IMAGE
  }

  // Handle broken image by replacing with placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    if (target.src !== PLACEHOLDER_IMAGE) {
      target.src = PLACEHOLDER_IMAGE
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{sectionTitle}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {sectionSubtitle}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Client Info Side */}
                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={getImageSrc(currentTestimonial.imageUrl)}
                      alt={currentTestimonial.clientName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white"
                      onError={handleImageError}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{currentTestimonial.clientName}</h3>
                      <p className="text-blue-200 text-sm">{currentTestimonial.role}</p>
                      <p className="text-blue-200 text-xs">{currentTestimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Verified Client
                    </Badge>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="md:w-2/3 p-8">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">"{currentTestimonial.text}"</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{currentTestimonial.company}</span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevTestimonial}
                        className="h-8 w-8 bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-500 px-2">
                        {currentIndex + 1} of {testimonials.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextTestimonial}
                        className="h-8 w-8 bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Dots/Thumbnails */}
        <div className="flex justify-center gap-4 mb-12">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative group ${index === currentIndex ? "ring-2 ring-blue-600 ring-offset-2" : ""
                } rounded-lg overflow-hidden transition-all`}
            >
              <img
                src={getImageSrc(testimonial.imageUrl)}
                alt={testimonial.clientName}
                className="w-12 h-12 object-cover rounded-lg"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>

        {/* Quick Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={getImageSrc(testimonial.imageUrl)}
                    alt={testimonial.clientName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.clientName}</h4>
                    <p className="text-xs text-gray-600">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-3">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Join hundreds of satisfied clients who trust us with their financial success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/testimonials">
                View All Testimonials {" >>>"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent">
              Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

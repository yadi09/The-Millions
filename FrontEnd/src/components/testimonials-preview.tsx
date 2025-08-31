import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react"
import {Link} from "react-router-dom"

const featuredTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Property Portfolio Owner",
    company: "Johnson Properties Ltd",
    image: "/placeholder.svg?height=60&width=60&text=SJ",
    rating: 5,
    category: "Property Accounting",
    content:
      "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
    results: "£15,000+ tax savings",
    videoTestimonial: false,
    location: "Manchester",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CEO & Founder",
    company: "TechFlow Solutions",
    image: "/placeholder.svg?height=60&width=60&text=MC",
    rating: 5,
    category: "Business Advisory",
    content:
      "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
    results: "£500K funding secured",
    videoTestimonial: true,
    location: "London",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Freelance Marketing Consultant",
    company: "Williams Digital Marketing",
    image: "/placeholder.svg?height=60&width=60&text=EW",
    rating: 5,
    category: "Self Assessment",
    content:
      "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
    results: "Stress-free tax compliance",
    videoTestimonial: false,
    location: "Birmingham",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Restaurant Owner",
    company: "Thompson's Bistro Chain",
    image: "/placeholder.svg?height=60&width=60&text=DT",
    rating: 5,
    category: "Payroll & Bookkeeping",
    content:
      "Managing payroll for three restaurant locations was becoming a nightmare. The Millions implemented a cloud-based system that handles everything seamlessly.",
    results: "3 locations streamlined",
    videoTestimonial: true,
    location: "Leeds",
  },
]

const quickStats = [
  { label: "Client Satisfaction", value: "98%" },
  { label: "Average Relationship", value: "5+ Years" },
  { label: "Businesses Served", value: "500+" },
]

export function TestimonialsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
  }

  const currentTestimonial = featuredTestimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
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
                      src={currentTestimonial.image || "/placeholder.svg"}
                      alt={currentTestimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{currentTestimonial.name}</h3>
                      <p className="text-blue-200 text-sm">{currentTestimonial.role}</p>
                      <p className="text-blue-200 text-xs">{currentTestimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {currentTestimonial.category}
                    </Badge>
                    {currentTestimonial.videoTestimonial && (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        <span>Video</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="md:w-2/3 p-8">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">"{currentTestimonial.content}"</p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-800 mb-1">Results Achieved:</h4>
                    <p className="text-green-700">{currentTestimonial.results}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{currentTestimonial.location}</span>

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
                        {currentIndex + 1} of {featuredTestimonials.length}
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
          {featuredTestimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative group ${
                index === currentIndex ? "ring-2 ring-blue-600 ring-offset-2" : ""
              } rounded-lg overflow-hidden transition-all`}
            >
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              {testimonial.videoTestimonial && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredTestimonials.slice(0, 3).map((testimonial, _index) => (
            <Card key={testimonial.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-600">{testimonial.company}</p>
                  </div>
                  {testimonial.videoTestimonial && (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-3">"{testimonial.content}"</p>

                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <p className="text-xs font-medium text-green-800">{testimonial.results}</p>
                </div>
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

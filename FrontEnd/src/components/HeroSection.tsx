import { Button } from "./ui/button"
import { Calendar, MessageCircle, ArrowRight } from "lucide-react"

interface HeroContent {
  badge: string;
  headlineBlack: string;
  headlineBlue: string;
  description: string;
  features: string[];
  ctas: { label: string; action: string }[];
}

interface HeroSectionProps {
  content?: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  if (!content) return null; // Or return skeleton/static fallback

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            {content.badge}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {content.headlineBlack}
            <br />
            <span className="text-blue-600">{content.headlineBlue}</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-5 h-5 mr-2" />
              {content.ctas?.[0]?.label || "Book Free Consultation"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-5 h-5 mr-2" />
              {content.ctas?.[1]?.label || "WhatsApp Us Instantly"}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
            {content.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

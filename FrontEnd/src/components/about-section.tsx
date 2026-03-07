import { Button } from "../components/ui/button"
import { Award, Users, Clock, ArrowRight } from "lucide-react"

export interface AboutContent {
  title: string
  description: string[]
  action?: { label: string; link: string }
  backgroundImageUrl?: string
}

export interface StatItem {
  label: string
  value: string
}

interface AboutSectionProps {
  content?: AboutContent
  stats?: StatItem[]
}

export function AboutSection({ content, stats }: AboutSectionProps) {
  if (!content) return null

  // Use backend Cloudinary URL if available, fall back to local image
  const teamImageSrc = content.backgroundImageUrl || "/image.png"

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{content.title}</h2>

            {content.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-600 mb-6">
                {paragraph}
              </p>
            ))}

            {stats && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => {
                  let Icon = Award
                  if (stat.label.toLowerCase().includes("client")) Icon = Users
                  if (stat.label.toLowerCase().includes("year")) Icon = Clock

                  return (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {content.action && (
              <Button size="lg">
                {content.action.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl overflow-hidden">
              <img
                src={teamImageSrc}
                alt="The Millions Accountants Team"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  if (target.src !== "/placeholder.svg") {
                    target.src = "/placeholder.svg"
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Available for consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

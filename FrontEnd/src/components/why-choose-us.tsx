import { Shield, Cloud, DollarSign, Heart, Check } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Fully Qualified ACCA",
    description: "Chartered Certified Accountants with proven expertise and professional standards you can trust.",
  },
  {
    icon: Cloud,
    title: "Cloud-Based Accounting",
    description: "Real-time financial insights through cutting-edge cloud solutions for modern businesses.",
  },
  {
    icon: DollarSign,
    title: "Fixed Fees, No Surprises",
    description: "Transparent, predictable pricing with clear advice and no hidden costs or surprise bills.",
  },
  {
    icon: Heart,
    title: "Friendly & Jargon-Free",
    description: "Responsive service in plain English, making complex financial matters simple and accessible.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Millions?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine professional expertise with personal service to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Support Across All Stages\
              Start-up to Scale-up",
              "Same-Day Response Guarantee",
              "Dedicated Account Manager",
              "Free Initial Consultation",
              "Real-time Financial Insights",
              "Proactive Tax Planning",
            ].map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from "../components/ui/button"
import { Award, Users, Clock, ArrowRight } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-600 mb-6">
              The Millions Chartered Certified Accountants is a client-first, future-focused accountancy firm dedicated
              to helping individuals and businesses navigate the complexities of finance with confidence. Based in the
              UK, we serve a wide range of clients, from early-stage entrepreneurs to property investors and community
              organisations.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We blend the rigour of traditional accountancy with the efficiency of modern tools, delivering insights,
              not just reports. Our mission is to deliver personalised, professional, and proactive accountancy services
              that support long-term success and financial peace of mind.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">ACCA</div>
                <div className="text-sm text-gray-600">Certified</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>

            <Button size="lg">
              Read More About Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl overflow-hidden">
              <img
                src="/image.png?height=500&width=500&text=The+Millions+Team"
                alt="The Millions Accountants Team"
                className="w-full h-full object-cover"
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

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Calendar, MessageCircle, Phone, Mail, ArrowRight } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Expert Advice Today</h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Ready to take your finances to the next level? Our team of certified accountants is here to help you
            succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Book a Free Consultation</h3>
                <p className="text-white/80 mb-4">30-minute consultation to discuss your needs and how we can help.</p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full">
                  Schedule Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">WhatsApp Us Instantly</h3>
                <p className="text-white/80 mb-4">Get immediate answers to your questions via WhatsApp chat.</p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full">
                  Start Chat
                  <MessageCircle className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+44 20 1234 5678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>hello@themillions.co.uk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

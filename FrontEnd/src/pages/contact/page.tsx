import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to take control of your finances? Our expert team is here to help you succeed. Contact us today for
              a free consultation.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Abebe Kebede"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="abebe@reicb.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+44 20 1234 5678"
                        />
                      </div>
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Interested In</label>
                        <select
                          id="service"
                          name="service"
                          onChange={(e) => handleInputChange("service", e.target.value)}
                          defaultValue=""
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          <option value="" disabled>
                            Select a service
                          </option>
                          <option value="payroll">Payroll & Bookkeeping</option>
                          <option value="self-assessment">Self Assessment</option>
                          <option value="company-formation">Company Formation</option>
                          <option value="property">Property Accounting</option>
                          <option value="management">Management Accounts</option>
                          <option value="tax-planning">Tax Planning</option>
                          <option value="business-advisory">Business Advisory</option>
                          <option value="compliance">Compliance Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your requirements..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us Now
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Free Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-gray-600">
                      123 Business Street
                      <br />
                      London, EC1A 1BB
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+44 20 1234 5678</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">hello@themillions.co.uk</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-4">
                  For urgent tax matters or HMRC deadlines, contact our emergency line:
                </p>
                <Button variant="destructive" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency: +44 20 1234 9999
                </Button>
                {/* <p className="text-xs text-red-600 mt-2">Available 24/7 for existing clients only</p> */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Find Our Office</CardTitle>
              <p className="text-gray-600">
                Located in the heart of London's financial district, easily accessible by public transport.
              </p>
            </CardHeader>

            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.4248216160718!2d-0.098350184025729!3d51.51561747963616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ca4c4c86a5f%3A0x2483f4e26c1b35e!2s123%20Business%20Street%2C%20London%20EC1A%201BB!5e0!3m2!1sen!2suk!4v1704894890000!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  // allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

import type React from "react"
import { useState } from "react"
import { SubPageHero } from "../../components/SubPageHero"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"

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
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="min-h-screen bg-millions-light">
      <SubPageHero 
        label="Get in Touch" 
        title="Ready to Start Your Journey?" 
        subText="Our expert team is here to provide the professional advisory and learning services you need to succeed in global markets."
      />

      <div className="max-w-7xl mx-auto px-4 md:px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="font-cormorant text-millions-dark text-3xl font-light mb-4">Send us a Message</h2>
              <p className="text-millions-body font-light text-sm italic">
                Fields marked with an asterisk (*) are required.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-white border-l-4 border-l-millions-accent p-10 text-center animate-fade-in-up">
                <CheckCircle className="w-16 h-16 text-millions-accent mx-auto mb-4" />
                <h3 className="font-cormorant text-2xl text-millions-dark font-light mb-2">Message Sent!</h3>
                <p className="text-millions-body font-light">Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Full Name *</label>
                    <input 
                      className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g. Abebe Kebede"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Email Address *</label>
                    <input 
                      type="email"
                      className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g. abebe@reicb.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Phone Number</label>
                    <input 
                      type="tel"
                      className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Service Interested In</label>
                    <select 
                      className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost appearance-none"
                      onChange={(e) => handleInputChange("service", e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="advisory">Professional Advisory</option>
                      <option value="learning">Professional Learning</option>
                      <option value="ventures">Venture Development</option>
                      <option value="impact">Social Impact & Mentorship</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Message *</label>
                  <textarea 
                    className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your requirements..."
                    rows={6}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-millions-dark text-white px-10 py-4 font-jost text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-millions-accent hover:text-millions-dark hover:-translate-y-0.5 flex items-center gap-3 w-fit"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Sidebar */}
          <div className="space-y-10 animate-fade-in-up md:animation-delay-300">
            {/* Quick Contact Block */}
            <div className="bg-millions-dark p-10 border-t-2 border-t-millions-accent">
              <h3 className="font-cormorant text-white text-xl font-light mb-6">Connect Directly</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <Phone className="w-5 h-5 text-millions-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-[0.6rem] tracking-[0.15em] text-white/40 uppercase mb-1">Call Us</h4>
                    <p className="text-white text-sm font-light">+44 7951 7965 92</p>
                    <p className="text-white/30 text-[0.65rem] italic">Available Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <Mail className="w-5 h-5 text-millions-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-[0.6rem] tracking-[0.15em] text-white/40 uppercase mb-1">Email Our Office</h4>
                    <p className="text-white text-sm font-light">info@themillions.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <MapPin className="w-5 h-5 text-millions-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-[0.6rem] tracking-[0.15em] text-white/40 uppercase mb-1">Headquarters</h4>
                    <p className="text-white text-sm font-light">Terminus Terrace, Southampton</p>
                    <p className="text-white/30 text-[0.65rem] italic">SO14 3FD, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Block */}
            <div className="bg-white p-10 border-t-2 border-t-millions-mid">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-millions-mid" />
                <h3 className="font-cormorant text-millions-dark text-xl font-light">Business Hours</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: "Mon - Fri", hours: "9:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
                  { day: "Sunday", hours: "Closed" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.8rem] font-light border-b border-millions-dark/5 pb-2">
                    <span className="text-millions-body italic">{item.day}</span>
                    <span className="text-millions-dark font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-[#f8f6f2] p-8 border border-millions-dark/5 grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
              <h4 className="font-cormorant text-millions-dark mb-4">Finding Our Location</h4>
              <p className="text-xs text-millions-body font-light leading-relaxed mb-4">
                We are strategically positioned in the heart of Southampton, facilitating our global connections to East African markets.
              </p>
              <div className="aspect-video bg-millions-dark/5 border border-millions-dark/10 flex items-center justify-center text-[0.6rem] tracking-widest text-millions-muted uppercase">
                Interactive Map Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

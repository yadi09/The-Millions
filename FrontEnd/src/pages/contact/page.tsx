import type React from "react"
import { useState } from "react"
import { SubPageHero } from "../../components/SubPageHero"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useGetContactServicesQuery, useSubmitContactMutation } from "../../features/api/apiSlice"
import { landingContent } from "../../data/landingContent"

export default function ContactPage() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    serviceId: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // API Hooks
  const { data: services, isLoading: isLoadingServices } = useGetContactServicesQuery()
  const [submitContact, { isLoading: isSubmitting }] = useSubmitContactMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      await submitContact({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceId: formData.serviceId,
        message: formData.message,
      }).unwrap()

      setIsSubmitted(true)
      // Success message stays until manually cleared or timed out
    } catch (err: any) {
      setErrorMessage(err?.data?.error || "Failed to send message. Please try again later.")
    }
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
              <div className="bg-white/60 backdrop-blur-sm border-l-4 border-l-millions-accent p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center animate-fade-in-up">
                <CheckCircle className="w-16 h-16 text-millions-accent mx-auto mb-6" />
                <h3 className="font-cormorant text-[clamp(1.8rem,3vw,2.5rem)] text-millions-dark font-light mb-4">Message Sent!</h3>
                <p className="text-millions-body font-light text-[0.95rem]">Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in-up bg-white/60 backdrop-blur-sm p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-millions-dark/5">
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
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Service Interested In *</label>
                    <select
                      className="bg-white border border-millions-dark/10 p-3 text-sm focus:border-millions-accent outline-none font-jost appearance-none disabled:opacity-50"
                      onChange={(e) => handleInputChange("serviceId", e.target.value)}
                      value={formData.serviceId}
                      required
                      disabled={isLoadingServices}
                    >
                      <option value="" disabled>{isLoadingServices ? "Loading services..." : "Select a service"}</option>
                      {services?.map((service: any) => (
                        <option key={service.id} value={service.id}>
                          {service.name || service.title}
                        </option>
                      ))}
                    </select>
                    {(!isLoadingServices && (!services || services.length === 0)) && (
                      <p className="text-[0.65rem] text-red-500 italic mt-1">Note: No services available in the database.</p>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm font-jost">{errorMessage}</p>
                  </div>
                )}

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
                  disabled={isSubmitting || (services && services.length === 0)}
                  className="bg-millions-dark text-white px-10 py-4 font-jost text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-millions-accent hover:text-millions-dark hover:-translate-y-0.5 flex items-center gap-3 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
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
                    {landingContent.contact.phones.map((phone, i) => (
                      <p key={i} className="text-white text-sm font-light">{phone}</p>
                    ))}
                    <p className="text-white/30 text-[0.65rem] italic">Available Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <Mail className="w-5 h-5 text-millions-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-[0.6rem] tracking-[0.15em] text-white/40 uppercase mb-1">Email Our Office</h4>
                    <p className="text-white text-sm font-light">{landingContent.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <MapPin className="w-5 h-5 text-millions-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-[0.6rem] tracking-[0.15em] text-white/40 uppercase mb-1">Headquarters</h4>
                    <p className="text-white text-sm font-light">{landingContent.contact.address.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Block */}
            <div className="bg-white/60 backdrop-blur-sm p-10 border border-millions-dark/5 border-t-2 border-t-millions-mid shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-6 h-6 text-millions-mid" />
                <h3 className="font-cormorant text-millions-dark text-[1.4rem] font-light">Business Hours</h3>
              </div>
              <div className="space-y-4">
                {[
                  { day: "Mon - Fri", hours: "9:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
                  { day: "Sunday", hours: "Closed" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.85rem] font-light border-b border-millions-dark/5 pb-3">
                    <span className="text-millions-body italic tracking-wide">{item.day}</span>
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

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Calculator, FileText, Building, TrendingUp, Users, ArrowRight, Check, ChevronRight, MessageCircle, Calendar, Briefcase, Shield, Heart, Zap, Loader2 } from "lucide-react"
import { useGetServicesQuery } from "../../features/api/apiSlice"
import type { Service } from "../../types/service"

const iconMap: Record<string, any> = {
  FileText,
  Calculator,
  Building,
  TrendingUp,
  Users,
  Briefcase,
  Shield,
  Heart,
  Zap,
};

export default function ServicesPage() {
  const { data: services, isLoading } = useGetServicesQuery();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </main>
    );
  }

  const displayServices = services || [];
  // Use the first service as default active tab
  const currentTab = activeTab || displayServices[0]?.id || null;

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      {/* Minimalist Hero Section matching Home Page colors */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-5xl text-center flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Expert solutions
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Tailored <span className="text-blue-600">Accounting Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flexible, scalable accountancy and tax services built around your needs. From launching a business to optimising tax efficiency and managing growth.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 px-4 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service: Service) => {
            const IconComponent = iconMap[service.icon] || FileText;

            return (
              <Card key={service.id} className="border-gray-200 bg-white shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col h-full rounded-2xl">
                <CardHeader className="pb-6">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-gray-500 text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <ul className="space-y-4 mb-8 flex-1">
                    {service.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => {
                        setActiveTab(service.id);
                        document.getElementById('service-details')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link cursor-pointer"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Detailed Services Tabs Section */}
      {displayServices.some(s => s.subServices && s.subServices.length > 0) && (
        <section id="service-details" className="py-16 px-4 bg-gray-50/50 border-t border-gray-100 scroll-mt-24">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Explore Our Expertise</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Dive deeper into our specific service offerings designed for your unique financial landscape.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Tabs Sidebar */}
              <div className="lg:w-1/3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {displayServices.filter(s => s.subServices && s.subServices.length > 0).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`text-left px-6 py-4 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink flex items-center justify-between group ${currentTab === service.id
                      ? 'bg-white shadow-sm border border-blue-200 text-blue-700'
                      : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent hover:shadow-sm'
                      }`}
                  >
                    <span className="font-semibold">{service.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 hidden lg:block ${currentTab === service.id ? 'translate-x-1 text-blue-400' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gray-400'
                      }`} />
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="lg:w-2/3">
                {displayServices.filter(s => s.subServices && s.subServices.length > 0).map((service) => (
                  <div
                    key={service.id}
                    className={`space-y-8 transition-all duration-500 ${currentTab === service.id ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-4 hidden'
                      }`}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200">{service.title}</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {service.subServices.map((sub) => (
                        <div key={sub.id} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">{sub.title}</h4>
                          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{sub.description}</p>
                          <ul className="space-y-3">
                            {sub.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero-like CTA Section */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Ready to streamline your finances?
          </h2>
          <p className="text-gray-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our tailored services can support your immediate needs and long-term goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base">
              <Calendar className="w-5 h-5 mr-2" />
              Book Consultation
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 h-12 px-8 text-base text-white outline-none border-none">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us Instantly
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

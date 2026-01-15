import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Calculator, FileText, Building, TrendingUp, Users, ArrowRight, Check } from "lucide-react"


const iconMap: any = {
  FileText,
  Calculator,
  Building,
  TrendingUp,
  Users
};

const services = [
  {
    icon: FileText,
    title: "Accounting & Tax Compliance",
    description: "Complete statutory compliance and tax return services for individuals and businesses.",
    features: [
      "Annual statutory accounts",
      "Corporation tax returns (CT600)",
      "Self-assessment tax returns",
      "VAT returns & MTD compliance",
      "HMRC correspondence handling",
    ],
    href: "/services/accounting-tax-compliance",
  },
  {
    icon: Calculator,
    title: "Payroll & Bookkeeping",
    description: "Comprehensive payroll management and bookkeeping services with cloud integration.",
    features: [
      "RTI-compliant payroll processing",
      "Auto-enrolment pension support",
      "Monthly or quarterly bookkeeping",
      "Cloud software setup & training",
      "Expense management",
    ],
    href: "/services/payroll-bookkeeping",
  },
  {
    icon: Building,
    title: "Business Start-up Support",
    description: "Complete support for new businesses from formation to first year compliance.",
    features: [
      "Company formation",
      "HMRC registration (PAYE, VAT, etc.)",
      "Business structure advice",
      "Start-up funding guidance",
      "First-year compliance support",
    ],
    href: "/services/business-startup",
  },
  {
    icon: TrendingUp,
    title: "Advisory & Growth Planning",
    description: "Strategic financial advice and planning to support your business growth.",
    features: [
      "Management accounts",
      "Budgeting and forecasting",
      "Cash flow management",
      "Business growth strategy",
      "Performance analysis",
    ],
    href: "/services/advisory-growth",
  },
  {
    icon: Users,
    title: "Specialist Services",
    description: "Tailored accounting solutions for specific industries and business types.",
    features: [
      "Contractor & freelancer accounting",
      "CIS tax support",
      "Landlord & property tax",
      "Charity & CIC accounts",
      "Not-for-profit organizations",
    ],
    href: "/services/specialist-services",
  },
]

const complianceServices = [
  {
    title: "Year-End Accounts & Tax Returns",
    description: "Professional preparation of statutory accounts and tax returns",
    items: ["Annual statutory accounts", "Corporation tax returns", "Self-assessment returns", "Tax planning advice"],
  },
  {
    title: "VAT & Making Tax Digital",
    description: "Complete VAT compliance and MTD implementation",
    items: ["VAT return preparation", "MTD software setup", "VAT planning", "HMRC correspondence"],
  },
]

const advisoryServices = [
  {
    title: "Strategic Growth & Advisory",
    description: "Business planning and growth strategy support",
    items: ["Management accounts", "Cash flow forecasting", "Business planning", "Growth strategy"],
  },
  {
    title: "Business Start-Up Support",
    description: "Complete support for new business ventures",
    items: ["Company formation", "Business structure advice", "Funding guidance", "Compliance setup"],
  },
]

const specialistServices = [
  {
    title: "Landlord & Property Tax",
    description: "Specialized services for property investors",
    items: ["Rental income management", "Property tax returns", "Capital allowances", "Portfolio optimization"],
  },
  {
    title: "CIS & Contractor Accounting",
    description: "Construction industry and contractor services",
    items: ["CIS compliance", "Contractor tax returns", "Subcontractor verification", "Industry-specific advice"],
  },
  {
    title: "Charities & Not-for-Profits",
    description: "Specialized accounting for charitable organizations",
    items: ["Charity accounts", "CIC reporting", "Grant management", "Regulatory compliance"],
  },
]

export default function ServicesPage() {
  // Use static services data directly
  const displayServices = services;

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Tailored Accounting Services for Individuals, Startups & Growing Businesses
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto">
            We offer flexible, scalable accountancy and tax services built around your needs. Whether you're launching a
            business, optimising tax efficiency, or managing growth, we're here to support your goals.
          </p>

        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {displayServices.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon] || service.icon || FileText;

            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-slate-900 mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-slate-600">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group" asChild>
                    <a href={service.href}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Service Categories */}
        <div className="space-y-16">
          {/* Compliance Services */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">1. Accounting & Tax Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceServices.map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payroll & Bookkeeping */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">2. Payroll & Bookkeeping</h2>
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Complete Payroll & Bookkeeping Solutions</CardTitle>
                <CardDescription>
                  RTI-compliant payroll processing and comprehensive bookkeeping services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Payroll Services</h4>
                    <ul className="space-y-2">
                      {[
                        "RTI-compliant payroll processing",
                        "Auto-enrolment pension support",
                        "P60s and P45s",
                        "Payroll reporting",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Bookkeeping Services</h4>
                    <ul className="space-y-2">
                      {[
                        "Monthly or quarterly bookkeeping",
                        "Cloud software setup & training",
                        "Bank reconciliation",
                        "Expense management",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advisory Services */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              3. Business Start-up Support & Advisory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advisoryServices.map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Specialist Services */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">4. Specialist Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {specialistServices.map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you're starting a business, need ongoing compliance support, or want strategic growth advice, we're
            here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-xl">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl bg-transparent">
              Get Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

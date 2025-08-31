import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Calculator, FileText, Building, Home, TrendingUp, Shield, Users, ArrowRight, Heart } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Year-End Accounts & Tax Returns",
    description: "Annual statutory accounts, corporation tax returns (CT600), and self-assessment tax returns.",
  },
  {
    icon: Calculator,
    title: "Payroll & Bookkeeping",
    description: "RTI-compliant payroll processing, auto-enrolment pension support, and cloud software setup.",
  },
  {
    icon: Shield,
    title: "VAT & Making Tax Digital",
    description: "VAT returns and MTD compliance to keep your business fully compliant with HMRC requirements.",
  },
  {
    icon: Building,
    title: "Business Start-Up Support",
    description: "Company formation, HMRC registration (PAYE, VAT), business structure advice, and funding guidance.",
  },
  {
    icon: TrendingUp,
    title: "Strategic Growth & Advisory",
    description: "Management accounts, budgeting, forecasting, cash flow management, and business growth strategy.",
  },
  {
    icon: Home,
    title: "Landlord & Property Tax",
    description: "Specialized accounting for property investors and landlords with comprehensive tax optimization.",
  },
  {
    icon: Users,
    title: "CIS & Contractor Accounting",
    description: "Contractor and freelancer accounting with CIS tax support for construction industry professionals.",
  },
  {
    icon: Heart,
    title: "Charities & Not-for-Profits",
    description: "Specialized accounting services for charities, CICs, and community organizations.",
  },
]

export function ServicesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services at a Glance</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive financial services tailored to your needs, from individuals to growing businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <service.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Calculator, FileText, Building, Home, TrendingUp, Shield, Users, ArrowRight, Heart } from "lucide-react"

const iconMap: any = {
  tax: FileText,
  payroll: Calculator,
  vat: Shield,
  startup: Building,
  growth: TrendingUp,
  property: Home,
  cis: Users,
  charity: Heart,
  // Fallbacks
  FileText,
  Calculator,
  Shield,
  Building,
  TrendingUp,
  Home,
  Users,
  Heart
};

interface ServiceCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ServicesContent {
  title: string;
  subtitle: string;
  cards: ServiceCard[];
  viewAllAction: string;
}

interface ServicesGridProps {
  content?: ServicesContent;
}

export function ServicesGrid({ content }: ServicesGridProps) {
  if (!content) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {content.cards.map((service, index) => {
            const IconComponent = iconMap[service.icon] || FileText;
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
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
            )
          })}
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

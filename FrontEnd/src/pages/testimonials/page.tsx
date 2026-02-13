import { useState, useMemo } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
    Star,
    Quote,
    ChevronLeft,
    ChevronRight,
    Play,
    TrendingUp,
    Users,
    Award,
    Clock,
    ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useTestimonials } from "../../context/TestimonialContext"

const heroStats = [
    { icon: TrendingUp, value: "98%", label: "Client Satisfaction" },
    { icon: Clock, value: "5+ Years", label: "Average Relationship" },
    { icon: Award, value: "95%", label: "Client Retention" },
    { icon: Users, value: "500+", label: "Happy Clients" },
]

export default function TestimonialsPage() {
    const { testimonials } = useTestimonials()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeCategory, setActiveCategory] = useState("all")

    // Get only approved testimonials
    const allTestimonials = useMemo(() =>
        testimonials.filter(t => t.status === 'approved'),
        [testimonials]);

    // Compute categories with dynamic counts
    const categories = useMemo(() => {
        const baseCategories = [
            { id: "all", label: "All Testimonials" },
            { id: "Property Accounting", label: "Property Accounting" },
            { id: "Self Assessment", label: "Self Assessment" },
            { id: "Business Advisory", label: "Business Advisory" },
            { id: "Tax Planning", label: "Tax Planning" },
            { id: "Payroll & Bookkeeping", label: "Payroll & Bookkeeping" },
            { id: "VAT Returns", label: "VAT Returns" },
            { id: "Company Formation", label: "Company Formation" },
        ];

        return baseCategories.map(cat => {
            if (cat.id === 'all') return { ...cat, count: undefined };
            const count = allTestimonials.filter(t => t.category === cat.id).length;
            return { ...cat, count };
        }).filter(cat => cat.id === 'all' || (cat.count ?? 0) > 0);
    }, [allTestimonials]);

    const nextTestimonial = () => {
        if (allTestimonials.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % allTestimonials.length)
    }

    const prevTestimonial = () => {
        if (allTestimonials.length === 0) return;
        setCurrentIndex(
            (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length
        )
    }

    const currentTestimonial = allTestimonials[currentIndex] || {
        id: 'placeholder',
        name: "Valued Client",
        role: "Client",
        company: "Company",
        image: "/placeholder.svg",
        rating: 5,
        category: "General",
        content: "Testimonials will appear here once approved.",
        results: "",
        videoTestimonial: false,
        location: "UK",
    };

    // Filter testimonials based on category
    const filteredTestimonials =
        activeCategory === "all"
            ? allTestimonials
            : allTestimonials.filter((t) => t.category === activeCategory)

    // Video testimonials
    const videoTestimonials = allTestimonials.filter((t) => t.videoTestimonial)

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Client Success Stories
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                            Discover how we've helped businesses and individuals achieve their
                            financial goals. Real stories, real results, from satisfied
                            clients.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {heroStats.map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <div
                                        key={index}
                                        className="text-center p-6 bg-white rounded-xl shadow-sm"
                                    >
                                        <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Success Story */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Featured Success Stories
                        </h2>
                        <p className="text-xl text-gray-600">
                            Read in-depth stories of clients who trusted us with their
                            finances.
                        </p>
                    </div>

                    <Card className="max-w-5xl mx-auto overflow-hidden shadow-lg">
                        <CardContent className="p-0">
                            <div className="md:flex">
                                {/* Client Info Side */}
                                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={currentTestimonial.image || "/placeholder.svg"}
                                            alt={currentTestimonial.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {currentTestimonial.name}
                                            </h3>
                                            <p className="text-blue-200 text-sm">
                                                {currentTestimonial.role}
                                            </p>
                                            <p className="text-blue-200 text-xs">
                                                {currentTestimonial.company}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/20 text-white border-white/30"
                                        >
                                            {currentTestimonial.category}
                                        </Badge>
                                        {currentTestimonial.videoTestimonial && (
                                            <div className="flex items-center gap-1">
                                                <Play className="w-4 h-4" />
                                                <span>Video</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Testimonial Content */}
                                <div className="md:w-2/3 p-8">
                                    <Quote className="w-8 h-8 text-blue-600 mb-4" />
                                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                        "{currentTestimonial.content}"
                                    </p>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold text-green-800 mb-1">
                                            Results Achieved:
                                        </h4>
                                        <p className="text-green-700">
                                            {currentTestimonial.results}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {currentTestimonial.location}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={prevTestimonial}
                                                className="h-8 w-8 bg-transparent"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm text-gray-500 px-2">
                                                {currentIndex + 1} of {allTestimonials.length}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={nextTestimonial}
                                                className="h-8 w-8 bg-transparent"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* All Client Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            All Client Testimonials
                        </h2>
                        <p className="text-xl text-gray-600">
                            Browse testimonials by service category
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(cat.id)}
                                className={
                                    activeCategory === cat.id ? "" : "bg-white hover:bg-gray-100"
                                }
                            >
                                {cat.label}
                                {cat.count && (
                                    <span className="ml-2 text-xs opacity-70">{cat.count}</span>
                                )}
                            </Button>
                        ))}
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTestimonials.map((testimonial) => (
                            <Card
                                key={testimonial.id}
                                className="group hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={testimonial.image || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {testimonial.company}
                                            </p>
                                        </div>
                                        {testimonial.videoTestimonial && (
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Play className="w-4 h-4 text-blue-600" />
                                            </div>
                                        )}
                                    </div>

                                    <Badge variant="secondary" className="mb-3">
                                        {testimonial.category}
                                    </Badge>

                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>

                                    <Quote className="w-6 h-6 text-blue-200 mb-2" />
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                                        {testimonial.content}
                                    </p>

                                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                                        <p className="text-sm font-medium text-green-800">
                                            {testimonial.results}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{testimonial.location}</span>
                                        <span>{testimonial.role}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Video Testimonials
                        </h2>
                        <p className="text-xl text-gray-600">
                            Watch our clients share their success stories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {videoTestimonials.map((testimonial) => (
                            <Card
                                key={testimonial.id}
                                className="group hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="relative aspect-video bg-gray-200">
                                    <img
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-blue-600 ml-1" />
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Join Our Success Stories?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Let us help you achieve the same level of success as our satisfied
                        clients. Book your free consultation today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100"
                            asChild
                        >
                            <Link to="/contact">
                                Book Free Consultation
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                            asChild
                        >
                            <Link to="/services">View Our Services</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}

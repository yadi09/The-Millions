import { useState } from "react";
import { useGetPageQuery, useGetTestimonialsQuery } from "../../features/api/apiSlice";
import { Loader2, Star, Quote, Play } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function TestimonialsPage() {
    const { data: pageData, isLoading: pageLoading } = useGetPageQuery("testimonials");
    const { data: testimonials, isLoading: testimonialsLoading } = useGetTestimonialsQuery({ role: "public" });

    const [filter, setFilter] = useState<string>("All");

    if (pageLoading || testimonialsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const sections = pageData?.sections || [];
    const heroSection = sections.find((s: any) => s.type === "hero");

    // Default hero content if none provided from CMS
    const heroContent = heroSection?.content || {
        title: "Client Success Stories",
        subtitle: "Discover how we've helped businesses achieve their financial goals through expert accounting and strategic advisory.",
    };

    const categories = ["All", ...Array.from(new Set((testimonials || []).map((t) => t.category)))];

    const filteredTestimonials = (testimonials || [])
        .filter((t) => filter === "All" || t.category === filter)
        .sort((a, b) => {
            if (a.order > 0 && b.order > 0) return a.order - b.order;
            if (a.order > 0) return -1;
            if (b.order > 0) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    {heroContent.title}
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    {heroContent.subtitle}
                </p>
            </section>

            {/* Trust Metrics */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                            <div className="text-sm text-slate-600">Client Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-sm text-slate-600">Businesses Served</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">5+ Yrs</div>
                            <div className="text-sm text-slate-600">Avg. Relationship</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">£10M+</div>
                            <div className="text-sm text-slate-600">Tax Saved</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={filter === category ? "default" : "outline"}
                            onClick={() => setFilter(category)}
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {filteredTestimonials.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No testimonials found.</h3>
                        <p className="text-slate-500">Check back later or try a different category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTestimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex-1 flex flex-col">
                                    {/* Rating & Category */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex gap-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            {testimonial.category}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <Quote className="w-8 h-8 text-blue-200 mb-4" />
                                        <p className="text-slate-700 leading-relaxed mb-6 italic">
                                            "{testimonial.content}"
                                        </p>
                                    </div>

                                    {/* Results if any */}
                                    {testimonial.results && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                                            <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                {testimonial.results}
                                            </p>
                                        </div>
                                    )}

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                                        <div className="relative">
                                            <img
                                                src={testimonial.image || "/placeholder.svg"}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 aspect-square shrink-0"
                                            />

                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                                            <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                                            <p className="text-xs text-slate-400">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-24 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to become our next success story?</h2>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Book a Free Consultation
                </Button>
            </section>
        </main>
    );
}

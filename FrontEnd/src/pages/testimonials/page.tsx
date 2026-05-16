import { useState } from "react";
import { useGetPageQuery, useGetTestimonialsQuery } from "../../features/api/apiSlice";
import { Loader2, Star, Quote } from "lucide-react";
import { SubPageHero } from "../../components/SubPageHero";

export default function TestimonialsPage() {
    const { data: pageData, isLoading: pageLoading } = useGetPageQuery("testimonials");
    const { data: testimonials, isLoading: testimonialsLoading } = useGetTestimonialsQuery({ role: "public" });

    const [filter, setFilter] = useState<string>("All");

    if (pageLoading || testimonialsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-millions-light">
                <Loader2 className="w-8 h-8 animate-spin text-millions-accent" />
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
        <main className="min-h-screen bg-millions-light">
            <SubPageHero
                label={heroContent.badge || "Success Stories"}
                title={heroContent.headlineBlack || heroContent.title || "Client Success Stories"}
                titleEm={heroContent.headlineBlue || ""}
                subText={heroContent.description || heroContent.subtitle || "Discover how we've helped businesses achieve their financial goals through expert accounting and strategic advisory."}
            />

            <section className="max-w-7xl mx-auto px-4 md:px-20 -mt-10 mb-16 relative z-20">
                <div className="bg-millions-dark border-t-2 border-t-millions-accent shadow-2xl py-8 px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 text-center items-center">
                        <div className="animate-fade-in-up">
                            <div className="font-cormorant text-4xl md:text-5xl text-millions-accent mb-2">98%</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Client Satisfaction</div>
                        </div>
                        <div className="animate-fade-in-up md:delay-100">
                            <div className="font-cormorant text-4xl md:text-5xl text-millions-accent mb-2">500+</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Businesses Served</div>
                        </div>
                        <div className="animate-fade-in-up md:delay-200">
                            <div className="font-cormorant text-4xl md:text-5xl text-millions-accent mb-2">5+ Yrs</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Avg. Relationship</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mb-16 animate-fade-in-up text-center">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-10 py-3.5 font-jost text-[0.68rem] tracking-[0.15em] uppercase font-bold transition-all border ${filter === category
                                ? "bg-millions-dark text-white border-millions-dark"
                                : "bg-white/40 text-millions-muted border-millions-dark/5 hover:border-millions-accent hover:text-millions-accent"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 pb-20">
                {!testimonials || testimonials.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-sm p-24 text-center border-t border-millions-dark/5 animate-fade-in-up">
                        <Quote className="w-10 h-10 text-millions-accent/20 mx-auto mb-8" />
                        <h3 className="font-cormorant text-[clamp(1.5rem,3vw,2.2rem)] text-millions-dark mb-4 italic font-light">Success Stories: Under Editorial Sync</h3>
                        <p className="text-millions-body font-light text-[0.9rem] max-w-md mx-auto leading-relaxed">
                            We are currently refining our archive of client case studies for public viewing. Our track record of professional success will be published here shortly.
                        </p>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-24 bg-white/40 backdrop-blur-sm border-t border-millions-dark/5 animate-fade-in-up">
                        <h3 className="font-cormorant text-2xl text-millions-dark font-light mb-2 italic">Refining Results</h3>
                        <p className="text-millions-body font-light text-[0.9rem]">No client stories found in the "{filter}" category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up">
                        {filteredTestimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white/60 backdrop-blur-sm p-10 flex flex-col hover:bg-white transition-all group border border-millions-dark/5 hover:border-millions-accent/20 shadow-sm hover:shadow-xl">
                                {/* Rating Header */}
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex gap-1.5">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-2.5 h-2.5 fill-millions-accent text-millions-accent" />
                                        ))}
                                    </div>
                                    <span className="text-[0.6rem] tracking-[0.25em] uppercase text-millions-accent font-bold px-3 py-1.5 bg-millions-accent/5">
                                        {testimonial.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <Quote className="w-6 h-6 text-millions-accent/20 mb-8 group-hover:text-millions-accent/40 transition-colors" />
                                    <p className="font-cormorant text-millions-dark text-[1.1rem] leading-[1.8] mb-10 italic font-light">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                {/* Results Highlight if any */}
                                {testimonial.results && (
                                    <div className="bg-millions-dark p-6 mb-10 border-l-2 border-l-millions-accent">
                                        <p className="text-[0.68rem] tracking-wide text-white/50 font-light flex items-center gap-4">
                                            <span className="w-1 h-1 rounded-full bg-millions-accent" />
                                            {testimonial.results}
                                        </p>
                                    </div>
                                )}

                                {/* Author Info */}
                                <div className="flex items-center gap-6 pt-10 border-t border-millions-dark/5 mt-auto">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-millions-dark flex items-center justify-center font-cormorant text-xl text-millions-accent overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-md">
                                            {testimonial.image ? (
                                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                            ) : (
                                                testimonial.name.split(' ').map(n => n[0]).join('')
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-cormorant text-millions-dark text-[1.15rem] font-semibold leading-tight">{testimonial.name}</h4>
                                        <p className="text-[0.63rem] tracking-[0.15em] text-millions-accent uppercase mt-2 font-medium">
                                            {testimonial.role} | {testimonial.company}
                                        </p>
                                        <p className="text-millions-muted text-[0.6rem] italic transition-all mt-1 font-light">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Final CTA */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mt-10 pb-10 text-center animate-fade-in-up">
                <div className="bg-millions-dark p-10 md:p-12 border-t-2 border-t-millions-accent shadow-2xl">
                    <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight mb-8">Ready to define your own success story?</h2>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="bg-millions-accent text-millions-dark px-14 py-4 font-jost text-[0.78rem] tracking-[0.2em] font-bold uppercase transition-all hover:bg-white hover:-translate-y-1"
                    >
                        Secure Free Consultation
                    </button>
                </div>
            </section>
        </main>
    );
}

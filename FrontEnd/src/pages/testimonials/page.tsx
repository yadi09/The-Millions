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
                label="Success Stories"
                title={heroContent.title}
                subText={heroContent.subtitle}
            />

            {/* Trust Metrics Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 -mt-10 mb-20 relative z-20">
                <div className="bg-millions-dark border-t-2 border-t-millions-accent shadow-2xl p-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center items-center">
                        <div>
                            <div className="font-cormorant text-4xl text-millions-accent mb-2">98%</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Client Satisfaction</div>
                        </div>
                        <div>
                            <div className="font-cormorant text-4xl text-millions-accent mb-2">500+</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Businesses Served</div>
                        </div>
                        <div>
                            <div className="font-cormorant text-4xl text-millions-accent mb-2">5+ Yrs</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Avg. Relationship</div>
                        </div>
                        <div>
                            <div className="font-cormorant text-4xl text-millions-accent mb-2">£10M+</div>
                            <div className="text-[0.65rem] tracking-[0.2em] text-white/40 uppercase font-light">Tax Saved</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mb-16 animate-fade-in-up">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-8 py-3 font-jost text-[0.7rem] tracking-[0.1em] uppercase font-bold transition-all border ${filter === category
                                    ? "bg-millions-dark text-white border-millions-dark"
                                    : "bg-white text-millions-muted border-millions-dark/5 hover:border-millions-accent hover:text-millions-accent"
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
                    <div className="bg-white p-20 text-center border border-millions-dark/5 animate-fade-in-up">
                        <Quote className="w-12 h-12 text-millions-accent/20 mx-auto mb-6" />
                        <h3 className="font-cormorant text-2xl text-millions-dark mb-4 italic">Success Stories: Coming Soon</h3>
                        <p className="text-millions-body font-light max-w-md mx-auto">
                            We are currently finalizing permissions and preparing our client case studies for public viewing. Our track record of success will be published here shortly.
                        </p>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-millions-dark/5 animate-fade-in-up">
                        <h3 className="font-cormorant text-2xl text-millions-dark font-light mb-2 italic">Refining Results</h3>
                        <p className="text-millions-body font-light">No client stories found in the "{filter}" category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-millions-dark/5 border border-millions-dark/5 animate-fade-in-up">
                        {filteredTestimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white p-10 flex flex-col hover:bg-millions-accent/5 transition-all group border border-transparent hover:border-millions-accent/20">
                                {/* Rating Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-millions-accent text-millions-accent shadow-sm" />
                                        ))}
                                    </div>
                                    <span className="text-[0.6rem] tracking-[0.2em] uppercase text-millions-accent font-bold px-3 py-1 bg-millions-accent/5">
                                        {testimonial.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <Quote className="w-8 h-8 text-millions-accent/20 mb-6 group-hover:text-millions-accent/40 transition-colors" />
                                    <p className="font-cormorant text-millions-dark text-[1.05rem] leading-relaxed mb-8 italic font-light">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                {/* Results Highlight if any */}
                                {testimonial.results && (
                                    <div className="bg-millions-mid p-4 mb-8 border-l-2 border-l-millions-accent">
                                        <p className="text-[0.7rem] text-white/70 font-light flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-millions-accent" />
                                            {testimonial.results}
                                        </p>
                                    </div>
                                )}

                                {/* Author Info */}
                                <div className="flex items-center gap-5 pt-8 border-t border-millions-dark/5 mt-auto">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-millions-dark flex items-center justify-center font-cormorant text-xl text-millions-accent overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                            {testimonial.image ? (
                                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                            ) : (
                                                testimonial.name.split(' ').map(n => n[0]).join('')
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-cormorant text-millions-dark text-lg font-semibold leading-tight">{testimonial.name}</h4>
                                        <p className="text-[0.65rem] tracking-[0.1em] text-millions-accent uppercase mt-1">
                                            {testimonial.role} | {testimonial.company}
                                        </p>
                                        <p className="text-white/0 group-hover:text-millions-muted text-[0.6rem] italic transition-all mt-0.5">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Final CTA */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mt-10 mb-28 text-center animate-fade-in-up">
                <div className="bg-millions-dark p-16 border-t-2 border-t-millions-accent">
                    <h2 className="font-cormorant text-white text-3xl md:text-4xl font-light mb-8">Ready to define your own success story?</h2>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="bg-millions-accent text-millions-dark px-12 py-4 font-jost text-[0.8rem] tracking-[0.15em] font-bold uppercase transition-all hover:bg-white hover:-translate-y-1"
                    >
                        Secure Free Consultation
                    </button>
                </div>
            </section>
        </main>
    );
}

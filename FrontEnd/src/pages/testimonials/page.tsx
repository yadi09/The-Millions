import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPageQuery, useGetTestimonialsQuery } from "../../features/api/apiSlice";
import { Loader2, Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { SubPageHero } from "../../components/SubPageHero";
import { cn } from "../../components/lib/utils";
import type { Testimonial } from "../../types/testimonial";
import type { RootState } from "../../app/store";

const TESTIMONIALS_PER_PAGE = 9;

export default function TestimonialsPage() {
    // Same preview-override pattern as the Landing page.
    const [searchParams] = useSearchParams();
    const isAuthed = useSelector((s: RootState) => s.auth.isAuthenticated);
    const preview = searchParams.get("preview") === "1" && isAuthed;
    const { data: pageData, isLoading: pageLoading } = useGetPageQuery({ slug: "testimonials", preview });
    const { data: testimonials, isLoading: testimonialsLoading } = useGetTestimonialsQuery({ role: "public" });

    const [filter, setFilter] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 whenever the category filter changes.
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // IMPORTANT: keep useMemo above any early returns so the hook order is
    // stable across renders (React's Rules of Hooks).
    const filteredTestimonials = useMemo(() => {
        const list = (testimonials || [])
            .filter((t) => filter === "All" || t.category === filter)
            .sort((a, b) => {
                if (a.order > 0 && b.order > 0) return b.order - a.order;
                if (a.order > 0) return -1;
                if (b.order > 0) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        return list;
    }, [testimonials, filter]);

    if (pageLoading || testimonialsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-millions-light">
                <Loader2 className="w-8 h-8 animate-spin text-millions-accent" />
            </div>
        );
    }

    const sections = pageData?.sections || [];
    const heroSection = sections.find((s: any) => s.type === "hero");

    const heroContent = heroSection?.content || {
        title: "Client Success Stories",
        subtitle: "Discover how we've helped businesses achieve their financial goals through expert accounting and strategic advisory.",
    };

    const categoriesWithCounts = (() => {
        const counts: Record<string, number> = {};
        for (const t of testimonials || []) {
            counts[t.category] = (counts[t.category] || 0) + 1;
        }
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    })();

    // Featured card pops out when we're on page 1 and not filtering — it's the
    // highest-order approved testimonial and acts as the marketing anchor.
    const showFeatured = currentPage === 1 && filter === "All" && filteredTestimonials.length > 0 && filteredTestimonials[0].order > 0;
    const featuredTestimonial = showFeatured ? filteredTestimonials[0] : null;
    const listTestimonials = showFeatured ? filteredTestimonials.slice(1) : filteredTestimonials;

    const totalPages = Math.max(1, Math.ceil(listTestimonials.length / TESTIMONIALS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const pageStart = (safePage - 1) * TESTIMONIALS_PER_PAGE;
    const paginatedTestimonials = listTestimonials.slice(pageStart, pageStart + TESTIMONIALS_PER_PAGE);

    const goToPage = (p: number) => {
        setCurrentPage(p);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-millions-light">
            <SubPageHero
                label={heroContent.badge || "Success Stories"}
                title={heroContent.headlineBlack || heroContent.title || "Client Success Stories"}
                titleEm={heroContent.headlineBlue || ""}
                subText={heroContent.description || heroContent.subtitle || "Discover how we've helped businesses achieve their financial goals through expert accounting and strategic advisory."}
            />

            {/* Stats banner — kept, just floating on the cream bg with tighter padding */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 -mt-10 mb-20 relative z-20">
                <div className="bg-millions-dark border-t-2 border-t-millions-accent shadow-2xl py-10 px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 text-center items-center">
                        <Stat value="98%" label="Client Satisfaction" />
                        <Stat value="500+" label="Businesses Served" delay="md:delay-100" />
                        <Stat value="5+ Yrs" label="Avg. Relationship" delay="md:delay-200" />
                    </div>
                </div>
            </section>

            {/* Category Filters */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mb-14 animate-fade-in-up">
                <div className="flex flex-wrap justify-center gap-2">
                    <FilterChip
                        active={filter === "All"}
                        onClick={() => setFilter("All")}
                        label="All"
                        count={(testimonials || []).length}
                    />
                    {categoriesWithCounts.map(([cat, count]) => (
                        <FilterChip
                            key={cat}
                            active={filter === cat}
                            onClick={() => setFilter(cat)}
                            label={cat}
                            count={count}
                        />
                    ))}
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 pb-20">
                {!testimonials || testimonials.length === 0 ? (
                    <EmptyState
                        title="Success Stories: Under Editorial Sync"
                        body="We are currently refining our archive of client case studies for public viewing. Our track record of professional success will be published here shortly."
                    />
                ) : filteredTestimonials.length === 0 ? (
                    <EmptyState
                        title="No matches in this category"
                        body={`No client stories found in the "${filter}" category yet. Try a different filter or browse all.`}
                        action={{ label: "Browse all stories", onClick: () => setFilter("All") }}
                    />
                ) : (
                    <>
                        {featuredTestimonial && (
                            <FeaturedTestimonialCard t={featuredTestimonial} />
                        )}

                        {paginatedTestimonials.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                                {paginatedTestimonials.map((t, idx) => (
                                    <TestimonialCard key={t.id} t={t} delay={idx} />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <SmartPagination
                                currentPage={safePage}
                                totalPages={totalPages}
                                onChange={goToPage}
                            />
                        )}
                    </>
                )}
            </section>

            {/* Final CTA */}
            <section className="max-w-7xl mx-auto px-4 md:px-20 mt-10 pb-20 text-center animate-fade-in-up">
                <div className="bg-millions-dark p-10 md:p-14 border-t-2 border-t-millions-accent shadow-2xl">
                    <h2 className="font-cormorant text-white text-[clamp(1.8rem,3.5vw,2.6rem)] font-light leading-tight mb-8">
                        Ready to define your own <em className="italic text-millions-accent not-italic">success story?</em>
                    </h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-millions-accent text-millions-dark px-12 py-4 font-jost text-[0.75rem] tracking-[0.2em] font-bold uppercase transition-all hover:bg-white hover:-translate-y-1"
                        >
                            Secure Free Consultation
                        </a>
                        <a
                            href="/submit-testimonial"
                            className="border border-millions-accent/40 text-millions-accent px-12 py-4 font-jost text-[0.75rem] tracking-[0.2em] font-medium uppercase transition-all hover:bg-millions-accent/10"
                        >
                            Share Your Story
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ---------------------------------------------------------------------------
// Stat tile — used in the dark banner directly under the hero.
// ---------------------------------------------------------------------------
function Stat({ value, label, delay = "" }: { value: string; label: string; delay?: string }) {
    return (
        <div className={cn("animate-fade-in-up", delay)}>
            <div className="font-cormorant text-4xl md:text-5xl text-millions-accent mb-2 font-light">{value}</div>
            <div className="text-[0.6rem] tracking-[0.25em] text-white/40 uppercase font-light">{label}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Filter chip — compact, count badge inline.
// ---------------------------------------------------------------------------
function FilterChip({
    active,
    onClick,
    label,
    count,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-jost text-[0.65rem] uppercase tracking-[0.2em] transition-colors border",
                active
                    ? "bg-millions-dark text-millions-accent border-millions-dark"
                    : "bg-transparent text-millions-muted border-millions-dark/10 hover:border-millions-accent hover:text-millions-accent",
            )}
        >
            <span>{label}</span>
            <span className={cn("text-[0.55rem]", active ? "text-white/60" : "text-millions-muted/60")}>
                {count}
            </span>
        </button>
    );
}

// ---------------------------------------------------------------------------
// Empty state — shared between "no testimonials at all" and "no filter results".
// ---------------------------------------------------------------------------
function EmptyState({ title, body, action }: { title: string; body: string; action?: { label: string; onClick: () => void } }) {
    return (
        <div className="bg-white/40 backdrop-blur-sm p-16 md:p-24 text-center border-t border-millions-dark/5 animate-fade-in-up">
            <Quote className="w-10 h-10 text-millions-accent/20 mx-auto mb-8" />
            <h3 className="font-cormorant text-[clamp(1.5rem,3vw,2.2rem)] text-millions-dark mb-4 italic font-light">{title}</h3>
            <p className="text-millions-body font-light text-[0.9rem] max-w-md mx-auto leading-relaxed mb-8">
                {body}
            </p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="bg-millions-dark text-white px-8 py-3 font-jost text-[0.65rem] tracking-[0.2em] uppercase font-bold hover:bg-millions-accent hover:text-millions-dark transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Author block — shared between featured + standard cards.
// Circular avatar with gold ring; tighter typography hierarchy.
// ---------------------------------------------------------------------------
function AuthorBlock({ t, size = "default" }: { t: Testimonial; size?: "default" | "lg" }) {
    const initials = t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const avatarSize = size === "lg" ? "w-16 h-16" : "w-12 h-12";
    const nameSize = size === "lg" ? "text-[1.25rem]" : "text-[1rem]";

    return (
        <div className="flex items-center gap-4">
            {t.image ? (
                <img
                    src={t.image}
                    alt={t.name}
                    className={cn(
                        avatarSize,
                        "rounded-full object-cover border border-millions-accent/30 shrink-0",
                    )}
                />
            ) : (
                <div
                    className={cn(
                        avatarSize,
                        "rounded-full bg-millions-dark/5 border border-millions-accent/30 flex items-center justify-center font-cormorant text-millions-accent shrink-0",
                        size === "lg" ? "text-base" : "text-sm",
                    )}
                >
                    {initials}
                </div>
            )}
            <div className="min-w-0">
                <p className={cn("font-cormorant text-millions-dark font-semibold leading-none", nameSize)}>
                    {t.name}
                </p>
                <p className="text-[0.62rem] tracking-[0.15em] text-millions-accent uppercase mt-1.5 font-medium truncate">
                    {t.role} · {t.company}
                </p>
                {t.location && (
                    <p className="text-millions-muted/80 text-[0.62rem] mt-1 font-light flex items-center gap-1.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {t.location}
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Standard testimonial card — magazine pull-quote style.
// ---------------------------------------------------------------------------
function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
    return (
        <article
            className="group bg-white p-8 md:p-9 flex flex-col h-full border-l-2 border-l-transparent hover:border-l-millions-accent hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${delay * 0.05}s` }}
        >
            {/* Top row — category eyebrow, stars subtle on the right */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <span className="text-millions-accent text-[0.55rem] tracking-[0.25em] font-bold uppercase leading-snug pt-0.5">
                    {t.category}
                </span>
                <div className="flex gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-millions-accent text-millions-accent" />
                    ))}
                </div>
            </div>

            {/* Quote */}
            <Quote className="w-6 h-6 text-millions-accent/30 mb-5" />
            <blockquote className="font-cormorant text-millions-dark text-[1.05rem] leading-[1.75] italic font-light mb-6 flex-1">
                {t.content}
            </blockquote>

            {/* Result — inline subtle pill, not a banner */}
            {t.results && (
                <p className="flex items-center gap-2 text-[0.65rem] text-millions-muted/80 font-light italic mb-6">
                    <span className="w-1 h-1 rounded-full bg-millions-accent shrink-0" />
                    {t.results}
                </p>
            )}

            {/* Author */}
            <div className="pt-6 border-t border-millions-dark/5 mt-auto">
                <AuthorBlock t={t} />
            </div>
        </article>
    );
}

// ---------------------------------------------------------------------------
// Featured testimonial — top-order pull, displayed above the grid on page 1.
// Magazine pull-quote at scale.
// ---------------------------------------------------------------------------
function FeaturedTestimonialCard({ t }: { t: Testimonial }) {
    return (
        <article className="relative bg-white border-l-[3px] border-l-millions-accent mb-12 shadow-sm hover:shadow-2xl transition-shadow duration-500 animate-fade-in-up">
            <div className="p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-millions-accent text-[0.6rem] tracking-[0.3em] font-bold uppercase">
                            Featured
                        </span>
                        <span className="w-1 h-1 rounded-full bg-millions-accent/40" />
                        <span className="text-millions-muted text-[0.6rem] tracking-[0.25em] uppercase font-medium">
                            {t.category}
                        </span>
                        <div className="ml-auto flex gap-1">
                            {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-millions-accent text-millions-accent" />
                            ))}
                        </div>
                    </div>

                    <Quote className="w-9 h-9 text-millions-accent/30 mb-6" />

                    <blockquote className="font-cormorant text-millions-dark text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.6] italic font-light mb-8 max-w-[60ch]">
                        {t.content}
                    </blockquote>

                    {t.results && (
                        <div className="inline-flex items-center gap-3 bg-millions-accent/5 px-4 py-2 mb-2">
                            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-millions-accent/70 font-bold">
                                Impact
                            </span>
                            <span className="w-px h-3 bg-millions-accent/20" />
                            <span className="text-[0.75rem] text-millions-dark font-medium tracking-wide">
                                {t.results}
                            </span>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 lg:border-l lg:border-l-millions-dark/5 lg:pl-10">
                    <AuthorBlock t={t} size="lg" />
                </div>
            </div>
        </article>
    );
}

// ---------------------------------------------------------------------------
// Smart pagination — Prev / 1 … current ± 1 … last / Next, with ellipsis
// for jumps. Mirrors the pattern used on /blog so the public-side pagination
// reads consistently across the site.
// ---------------------------------------------------------------------------
function SmartPagination({
    currentPage,
    totalPages,
    onChange,
}: {
    currentPage: number;
    totalPages: number;
    onChange: (p: number) => void;
}) {
    const tokens = useMemo<Array<number | "…">>(() => {
        const set = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
        const pages = Array.from(set)
            .filter((n) => n >= 1 && n <= totalPages)
            .sort((a, b) => a - b);
        const out: Array<number | "…"> = [];
        pages.forEach((p, i) => {
            if (i > 0 && p - pages[i - 1] > 1) out.push("…");
            out.push(p);
        });
        return out;
    }, [currentPage, totalPages]);

    return (
        <nav className="flex items-center justify-center gap-1 mt-16 pt-10 border-t border-millions-dark/5 animate-fade-in-up" aria-label="Pagination">
            <button
                type="button"
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 h-10 text-[0.7rem] font-jost uppercase tracking-[0.15em] text-millions-muted hover:text-millions-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
            </button>
            {tokens.map((tok, idx) =>
                tok === "…" ? (
                    <span key={`gap-${idx}`} className="w-10 h-10 flex items-center justify-center text-millions-muted/40 text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={tok}
                        type="button"
                        onClick={() => onChange(tok)}
                        className={cn(
                            "w-10 h-10 font-jost text-sm transition-all",
                            currentPage === tok
                                ? "bg-millions-dark text-millions-accent"
                                : "text-millions-muted hover:text-millions-accent",
                        )}
                    >
                        {tok}
                    </button>
                ),
            )}
            <button
                type="button"
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 h-10 text-[0.7rem] font-jost uppercase tracking-[0.15em] text-millions-muted hover:text-millions-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </nav>
    );
}

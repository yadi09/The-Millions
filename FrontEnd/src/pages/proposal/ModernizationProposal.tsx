import { useEffect } from "react";
import {
    FolderLock,
    ScanLine,
    CalendarCheck,
    FileSignature,
    CalendarClock,
    ShieldCheck,
    Lock,
    MessageCircle,
    FileText,
    Inbox,
    BarChart3,
    Mail,
    Calculator,
    ArrowDown,
    Sparkles,
    Check,
} from "lucide-react";

// Standalone proposal page — meant to be shared as a link with the firm
// owners. No auth, no admin chrome, designed as a single scrollable pitch.

const Section = ({
    children,
    background = "dark",
    className = "",
}: {
    children: React.ReactNode;
    background?: "dark" | "cream";
    className?: string;
}) => (
    <section
        className={`relative px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-28 ${
            background === "dark" ? "bg-millions-dark text-white" : "bg-[#f5f1e8] text-millions-dark"
        } ${className}`}
    >
        <div className="max-w-5xl mx-auto">{children}</div>
    </section>
);

const SectionEyebrow = ({ children, accent = "gold" }: { children: React.ReactNode; accent?: "gold" | "dark" }) => (
    <div
        className={`flex items-center gap-3 sm:gap-4 text-[0.6rem] sm:text-[0.7rem] tracking-[0.25em] uppercase mb-4 ${
            accent === "gold" ? "text-millions-accent" : "text-millions-dark/60"
        }`}
    >
        <div className={`w-6 sm:w-10 h-[1px] ${accent === "gold" ? "bg-millions-accent/40" : "bg-millions-dark/30"}`} />
        {children}
    </div>
);

const PillarCard = ({
    icon: Icon,
    label,
    title,
    pitch,
    bullets,
    effort,
    background = "dark",
}: {
    icon: any;
    label: string;
    title: string;
    pitch: string;
    bullets: string[];
    effort: string;
    background?: "dark" | "cream";
}) => {
    const isDark = background === "dark";
    return (
        <div
            className={`relative animate-fade-in-up p-6 sm:p-8 md:p-10 border ${
                isDark
                    ? "bg-white/5 border-white/5 hover:border-millions-accent/30"
                    : "bg-white border-millions-dark/5 hover:border-millions-accent/40 shadow-sm hover:shadow-xl"
            } transition-all`}
        >
            <div className="flex items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 ${
                        isDark ? "bg-millions-accent/10 border border-millions-accent/20" : "bg-millions-dark text-millions-accent"
                    }`}
                >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-millions-accent" />
                </div>
                <div className="min-w-0">
                    <p className={`text-[0.55rem] sm:text-[0.6rem] font-jost uppercase tracking-[0.25em] ${isDark ? "text-millions-accent/60" : "text-millions-dark/40"}`}>
                        {label}
                    </p>
                    <h3 className={`font-cormorant text-xl sm:text-2xl md:text-3xl font-light leading-tight italic mt-1 ${isDark ? "text-white" : "text-millions-dark"}`}>
                        {title}
                    </h3>
                </div>
            </div>

            <p className={`font-jost text-[0.85rem] sm:text-[0.9rem] leading-relaxed mb-5 sm:mb-6 ${isDark ? "text-white/70" : "text-millions-dark/80"}`}>
                {pitch}
            </p>

            <ul className="space-y-2.5 mb-6">
                {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className={`w-3.5 h-3.5 mt-1 shrink-0 ${isDark ? "text-millions-accent" : "text-millions-accent"}`} />
                        <span className={`text-[0.8rem] sm:text-[0.85rem] font-jost leading-relaxed ${isDark ? "text-white/60" : "text-millions-dark/70"}`}>
                            {b}
                        </span>
                    </li>
                ))}
            </ul>

            <div className={`pt-4 border-t flex items-center gap-3 ${isDark ? "border-white/5" : "border-millions-dark/10"}`}>
                <CalendarClock className={`w-3.5 h-3.5 ${isDark ? "text-white/30" : "text-millions-dark/30"}`} />
                <span className={`text-[0.65rem] font-jost uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-millions-dark/50"}`}>{effort}</span>
            </div>
        </div>
    );
};

const SmallFeature = ({
    icon: Icon,
    title,
    desc,
    isDark = true,
}: {
    icon: any;
    title: string;
    desc: string;
    isDark?: boolean;
}) => (
    <div
        className={`p-5 sm:p-6 border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-millions-dark/5"
        }`}
    >
        <div className="flex items-center gap-3 mb-2">
            <Icon className="w-4 h-4 text-millions-accent shrink-0" />
            <h4 className={`font-cormorant text-base sm:text-lg font-light italic ${isDark ? "text-white" : "text-millions-dark"}`}>{title}</h4>
        </div>
        <p className={`text-[0.78rem] sm:text-[0.82rem] font-jost leading-relaxed ${isDark ? "text-white/50" : "text-millions-dark/60"}`}>
            {desc}
        </p>
    </div>
);

const ModernizationProposal = () => {
    useEffect(() => {
        document.title = "The Millions × 2026 Modernization Proposal";
    }, []);

    return (
        <div className="min-h-screen bg-millions-dark text-white selection:bg-millions-accent selection:text-millions-dark overflow-x-hidden">
            {/* HERO ----------------------------------------------------- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 py-20 overflow-hidden">
                {/* Background ornament */}
                <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.025] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-millions-accent/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-millions-accent/5 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
                    {/* Brand mark */}
                    <div className="flex flex-col items-center mb-10 sm:mb-14">
                        <span className="font-cormorant text-[0.65rem] sm:text-[0.7rem] font-light tracking-[0.4em] text-white/40 uppercase">the</span>
                        <span className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-semibold text-white">MILLIONS.</span>
                    </div>

                    <div className="inline-flex items-center gap-3 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase mb-6">
                        <div className="w-8 h-[1px] bg-millions-accent/40" />
                        A proposal for the firm
                        <div className="w-8 h-[1px] bg-millions-accent/40" />
                    </div>

                    <h1 className="font-cormorant text-[clamp(2.5rem,8vw,5.5rem)] font-light leading-[0.95] mb-6 sm:mb-8">
                        Modernization
                        <br />
                        <em className="italic text-millions-accent">for 2026.</em>
                    </h1>

                    <p className="font-jost text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-white/60 max-w-2xl mx-auto mb-10">
                        Three features that make The Millions look — and operate — like a 2026 firm.
                        Built to be the answer a prospective client gets when they ask
                        <em className="text-white/80 not-italic"> "do I still have to email you my receipts?"</em>
                    </p>

                    <div className="flex items-center justify-center gap-2 text-white/30 animate-bounce">
                        <ArrowDown className="w-4 h-4" />
                        <span className="text-[0.6rem] font-jost uppercase tracking-[0.3em]">Read the proposal</span>
                    </div>
                </div>
            </section>

            {/* WHY NOW -------------------------------------------------- */}
            <Section background="cream">
                <SectionEyebrow accent="dark">Why now</SectionEyebrow>
                <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight mb-6 sm:mb-8">
                    The boutique firms winning new business in 2026 share <em className="italic text-millions-accent">three things.</em>
                </h2>
                <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                    {[
                        { n: "01", t: "A working client portal", d: "Documents in, deliverables out — no email chasing." },
                        { n: "02", t: "Automated receipt capture", d: "Phone photo in, clean accounting data out." },
                        { n: "03", t: "Visible compliance tracking", d: "Every deadline accounted for, every client reminded." },
                    ].map((p) => (
                        <div key={p.n} className="bg-white p-5 sm:p-6 border border-millions-dark/5">
                            <span className="text-[0.6rem] font-jost text-millions-accent uppercase tracking-[0.3em] font-bold">{p.n}</span>
                            <h3 className="font-cormorant text-lg sm:text-xl text-millions-dark font-light italic mt-2 mb-2 leading-snug">{p.t}</h3>
                            <p className="text-[0.78rem] sm:text-[0.82rem] font-jost text-millions-dark/60 leading-relaxed">{p.d}</p>
                        </div>
                    ))}
                </div>
                <p className="font-jost text-[0.85rem] sm:text-[0.9rem] text-millions-dark/70 leading-relaxed mt-10 sm:mt-12 max-w-3xl">
                    Each one solves a real, expensive problem the firm faces today. Built together, they form the spine of what
                    "a modern accountancy firm" means in 2026 — and the line that wins new client meetings.
                </p>
            </Section>

            {/* PHASE 1 — THREE PILLARS ---------------------------------- */}
            <Section background="dark">
                <div className="text-center mb-12 sm:mb-16">
                    <SectionEyebrow>Phase 1 · The Headline</SectionEyebrow>
                    <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight">
                        The three <em className="italic text-millions-accent">pillars</em>
                    </h2>
                    <p className="text-white/40 font-jost text-[0.85rem] sm:text-[0.9rem] mt-4 max-w-2xl mx-auto">
                        Two weeks of focused build. Each pillar solves a distinct pain point that costs the firm measurable money today.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
                    <PillarCard
                        icon={FolderLock}
                        label="Pillar 01"
                        title="Client Portal"
                        pitch="Each client gets their own secure dashboard. Upload receipts and statements, see job status, sign documents, pay invoices — all in one place. The single biggest visible differentiator between a 2026 firm and a 2010 firm."
                        bullets={[
                            "Drag-drop document upload (receipts, P60s, bank statements)",
                            "Live job status: VAT Filed ✓, Self Assessment Awaiting Sign-Off",
                            "E-signature on engagement letters and tax returns",
                            "Online invoice payment via Stripe",
                        ]}
                        effort="4–6 days · Build effort"
                    />
                    <PillarCard
                        icon={ScanLine}
                        label="Pillar 02"
                        title="AI Receipt Scanner"
                        pitch="Client snaps a phone photo, the system reads it — vendor, amount, date, VAT, category — and files it pre-categorized into their portal. The 'magic moment' that closes prospect demos."
                        bullets={[
                            "Phone-photo upload from the client portal",
                            "Auto-extracted vendor, amount, VAT, date",
                            "Pre-categorized as expense type",
                            "Fractions of a penny per receipt processed",
                        ]}
                        effort="2–3 days · Build effort"
                    />
                    <PillarCard
                        icon={CalendarCheck}
                        label="Pillar 03"
                        title="Compliance Calendar"
                        pitch="Every UK-specific deadline tracked per client — VAT, PAYE, Self Assessment, Corporation Tax. Automated reminders go out 30/14/7/1 days before, via email and WhatsApp, with a direct link to upload what's missing."
                        bullets={[
                            "Per-client deadline view + firm-wide overview",
                            "30 / 14 / 7 / 1 day auto-reminders",
                            "Reuses the existing WhatsApp lead-capture pipeline",
                            "Reduces 'where's my X' emails the firm fields daily",
                        ]}
                        effort="3–4 days · Build effort"
                    />
                </div>

                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-millions-accent/5 border border-millions-accent/20 max-w-3xl mx-auto text-center">
                    <Sparkles className="w-5 h-5 text-millions-accent mx-auto mb-3" />
                    <p className="font-cormorant text-lg sm:text-xl text-white/80 italic leading-relaxed">
                        "Right now, what makes a small UK firm look modern is the client portal. After Phase 1, every prospect who asks
                        <span className="text-millions-accent"> 'why The Millions?' </span>
                        has a concrete, demonstrable answer."
                    </p>
                </div>
            </Section>

            {/* PHASE 2 -------------------------------------------------- */}
            <Section background="cream">
                <div className="mb-10 sm:mb-12">
                    <SectionEyebrow accent="dark">Phase 2 · Operational levers</SectionEyebrow>
                    <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight">
                        Once Phase 1 ships, <em className="italic text-millions-accent">these compound it.</em>
                    </h2>
                    <p className="text-millions-dark/60 font-jost text-[0.85rem] sm:text-[0.9rem] mt-4 max-w-2xl">
                        Less individual wow per feature. Each one saves the firm hours every week and tightens the lead-to-engagement funnel.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <SmallFeature
                        icon={FileSignature}
                        title="Fixed-Fee Quote Generator"
                        desc="Wizard collects business profile, outputs a branded PDF proposal with Stripe checkout for the engagement deposit. Quote-to-signed-contract in minutes, not days."
                        isDark={false}
                    />
                    <SmallFeature
                        icon={CalendarClock}
                        title="Online Consultation Booking"
                        desc="Client picks a slot, pays a £X deposit, gets a Zoom/Meet link automatically. Calendly-equivalent, in-site, branded."
                        isDark={false}
                    />
                    <SmallFeature
                        icon={ShieldCheck}
                        title="KYC / AML Onboarding"
                        desc="UK regulatory ID + proof-of-address verification (Veriff/Onfido). Compliance + audit trail handled, looks great on an inspection."
                        isDark={false}
                    />
                    <SmallFeature
                        icon={Lock}
                        title="2FA, Audit Log, Multi-User Roles"
                        desc="Required as the firm grows beyond two partners. Anyone touching tax data needs proper access control."
                        isDark={false}
                    />
                    <SmallFeature
                        icon={MessageCircle}
                        title="WhatsApp Bot v2 — Client Q&A"
                        desc="Registered clients ask their own questions ('when's my VAT due?'). Answered from a curated knowledge base, escalated to a human when unclear."
                        isDark={false}
                    />
                    <SmallFeature
                        icon={Inbox}
                        title="Multi-Channel Inbox"
                        desc="Gmail + WhatsApp + web form + AI-agent leads, threaded into one view per client. No more 'where did Mark message me about that?'"
                        isDark={false}
                    />
                </div>
            </Section>

            {/* PHASE 3 -------------------------------------------------- */}
            <Section background="dark">
                <div className="mb-10 sm:mb-12">
                    <SectionEyebrow>Phase 3 · Long-term polish</SectionEyebrow>
                    <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight">
                        Small adds that <em className="italic text-millions-accent">compound forever.</em>
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <SmallFeature
                        icon={FileText}
                        title="Letterhead, Invoice & Email-Signature Generators"
                        desc="Same canvas pipeline as the business card builder. Completes the brand kit; every email becomes a tiny marketing impression."
                    />
                    <SmallFeature
                        icon={BarChart3}
                        title="Lead-to-Engagement Funnel Analytics"
                        desc="Conversion rates at each step (lead → consult → quote → engaged). Source attribution. 'You converted 32% of WhatsApp leads vs 18% of web-form leads.'"
                    />
                    <SmallFeature
                        icon={Mail}
                        title="Newsletter Builder"
                        desc="Quarterly tax-tip emails composed from existing blog content. Free retention tool — clients you stay in front of don't drift."
                    />
                    <SmallFeature
                        icon={Calculator}
                        title="Public Tax Calculator Tools"
                        desc="UK Self-Assessment, take-home pay, dividend tax, VAT. Embedded on the marketing site as SEO lead magnets — people Google these every January."
                    />
                </div>
            </Section>

            {/* INVESTMENT ----------------------------------------------- */}
            <Section background="cream">
                <SectionEyebrow accent="dark">Investment</SectionEyebrow>
                <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight mb-8 sm:mb-12">
                    What it takes, <em className="italic text-millions-accent">phase by phase.</em>
                </h2>

                <div className="space-y-4 sm:space-y-5">
                    {[
                        {
                            n: "Phase 1 · The Headline",
                            t: "~2 weeks",
                            d: "Client portal, AI receipt scanner, compliance calendar. The trifecta that becomes the firm's sales pitch.",
                        },
                        {
                            n: "Phase 2 · Operational",
                            t: "~1–2 weeks",
                            d: "Quote generator, booking, KYC, 2FA + roles, WhatsApp v2, unified inbox.",
                        },
                        {
                            n: "Phase 3 · Polish",
                            t: "Ongoing",
                            d: "Brand kit completion, analytics, newsletter, public lead-magnet tools.",
                        },
                    ].map((p) => (
                        <div key={p.n} className="bg-white p-5 sm:p-6 md:p-7 border border-millions-dark/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                            <div className="flex-1">
                                <p className="text-[0.6rem] font-jost text-millions-accent uppercase tracking-[0.25em] font-bold mb-1">{p.n}</p>
                                <p className="text-[0.85rem] sm:text-[0.9rem] font-jost text-millions-dark/70 leading-relaxed">{p.d}</p>
                            </div>
                            <div className="shrink-0 sm:text-right">
                                <span className="font-cormorant text-2xl sm:text-3xl font-light italic text-millions-dark">{p.t}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* CTA ------------------------------------------------------ */}
            <section className="relative px-6 sm:px-10 md:px-16 py-20 sm:py-28 bg-millions-dark text-white text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.025] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-millions-accent/8 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <SectionEyebrow>Next step</SectionEyebrow>
                    <h2 className="font-cormorant text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-tight mb-6">
                        If Phase 1 lands, the firm has <em className="italic text-millions-accent">a new pitch.</em>
                    </h2>
                    <p className="font-jost text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-white/60 mb-10 max-w-2xl mx-auto">
                        Approve the headline phase and I'll start with the client portal foundation. Each pillar ships into the existing admin
                        as a separate PR — you'll see progress in days, not months.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <a
                            href="mailto:abrham@reicb.com?subject=The%20Millions%20%C3%97%202026%20Modernization%20%E2%80%94%20Approved&body=Hi%20Yadamzer%2C%0A%0AWe%27ve%20read%20the%20proposal.%20Let%27s%20proceed%20with%20Phase%201.%0A%0A"
                            className="inline-flex items-center justify-center bg-millions-accent text-millions-dark hover:bg-white rounded-none h-12 px-8 text-[0.7rem] uppercase tracking-[0.25em] font-bold transition-all shadow-xl"
                        >
                            Approve Phase 1
                        </a>
                        <a
                            href="mailto:abrham@reicb.com?subject=The%20Millions%20%C3%97%202026%20%E2%80%94%20Questions"
                            className="inline-flex items-center justify-center bg-transparent border border-white/20 text-white/70 hover:border-white hover:text-white rounded-none h-12 px-8 text-[0.7rem] uppercase tracking-[0.25em] font-medium transition-all"
                        >
                            Send questions
                        </a>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-[0.55rem] font-jost text-white/30 uppercase tracking-[0.3em] mb-2">Prepared by</p>
                        <p className="font-cormorant text-xl sm:text-2xl italic text-white/80">Yadamzer Terefe</p>
                        <a href="mailto:abrham@reicb.com" className="text-[0.75rem] font-jost text-millions-accent hover:text-white transition-colors">
                            abrham@reicb.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModernizationProposal;

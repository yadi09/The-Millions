import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Check,
    AlertTriangle,
    X,
    Minus,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Sparkles,
    Send,
    Loader2,
    Star,
    PartyPopper,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    FEATURE_CATALOGUE,
    STATUS_OPTIONS,
    TOTAL_FEATURES,
    type ResponseStatus,
} from "../../data/feedbackCatalogue";
import { useSubmitFeedbackMutation } from "../../features/api/apiSlice";

type ResponseMap = Record<string, { status: ResponseStatus; comment?: string }>;

const STATUS_ICON: Record<ResponseStatus, any> = {
    worked: Check,
    struggled: AlertTriangle,
    broken: X,
    skipped: Minus,
};

const STATUS_TONE_CLASSES: Record<ResponseStatus, { active: string; idle: string }> = {
    worked: {
        active: "bg-emerald-500 text-millions-dark border-emerald-500",
        idle: "bg-white/5 text-white/40 border-white/5 hover:border-emerald-400/40 hover:text-emerald-300",
    },
    struggled: {
        active: "bg-amber-500 text-millions-dark border-amber-500",
        idle: "bg-white/5 text-white/40 border-white/5 hover:border-amber-400/40 hover:text-amber-300",
    },
    broken: {
        active: "bg-red-500 text-white border-red-500",
        idle: "bg-white/5 text-white/40 border-white/5 hover:border-red-400/40 hover:text-red-300",
    },
    skipped: {
        active: "bg-white/15 text-white/70 border-white/20",
        idle: "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white/70",
    },
};

const STORAGE_KEY = "the-millions-feedback-draft-v1";

const FeedbackWalkthrough = () => {
    const [submittedBy, setSubmittedBy] = useState("");
    const [responses, setResponses] = useState<ResponseMap>({});
    const [overallRating, setOverallRating] = useState<number | null>(null);
    const [overallComment, setOverallComment] = useState("");
    const [commentOpen, setCommentOpen] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submit, { isLoading: saving }] = useSubmitFeedbackMutation();

    // Persist to localStorage as the user fills in — so they can close the
    // tab and come back later without losing what they typed.
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const draft = JSON.parse(raw);
            if (draft?.submittedBy) setSubmittedBy(draft.submittedBy);
            if (draft?.responses) setResponses(draft.responses);
            if (typeof draft?.overallRating === "number") setOverallRating(draft.overallRating);
            if (draft?.overallComment) setOverallComment(draft.overallComment);
        } catch {
            // ignore — corrupted draft, start fresh
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ submittedBy, responses, overallRating, overallComment })
            );
        } catch {
            // quota or disabled — fine, draft just won't persist
        }
    }, [submittedBy, responses, overallRating, overallComment]);

    const ratedCount = useMemo(() => Object.keys(responses).length, [responses]);
    const progressPct = Math.round((ratedCount / TOTAL_FEATURES) * 100);

    const setStatus = (featureId: string, status: ResponseStatus) => {
        setResponses((prev) => ({ ...prev, [featureId]: { ...prev[featureId], status } }));
    };

    const setComment = (featureId: string, comment: string) => {
        setResponses((prev) => ({
            ...prev,
            [featureId]: { status: prev[featureId]?.status ?? "skipped", comment },
        }));
    };

    const toggleComment = (featureId: string) => {
        setCommentOpen((p) => ({ ...p, [featureId]: !p[featureId] }));
    };

    const handleSubmit = async () => {
        if (!submittedBy.trim()) {
            toast.error("Please add your name so I know who this feedback is from.");
            const nameInput = document.getElementById("submitter-name");
            nameInput?.scrollIntoView({ behavior: "smooth", block: "center" });
            nameInput?.focus();
            return;
        }
        try {
            await submit({
                submittedBy: submittedBy.trim(),
                overallRating,
                overallComment: overallComment.trim() || null,
                responses,
            }).unwrap();
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch {
                // ignore
            }
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e: any) {
            toast.error(e?.data?.message || "Couldn't send feedback. Try again in a moment.");
        }
    };

    if (submitted) {
        return <ThankYouScreen onAnother={() => setSubmitted(false)} />;
    }

    return (
        <div className="min-h-screen bg-millions-dark text-white selection:bg-millions-accent selection:text-millions-dark">
            {/* HERO ----------------------------------------------------- */}
            <section className="relative px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.025] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-millions-accent/8 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative max-w-3xl mx-auto">
                    <div className="flex flex-col items-center mb-8 sm:mb-10">
                        <span className="font-cormorant text-[0.65rem] sm:text-[0.7rem] font-light tracking-[0.4em] text-white/40 uppercase">the</span>
                        <span className="font-cormorant text-2xl sm:text-3xl font-semibold text-white">MILLIONS.</span>
                    </div>

                    <div className="inline-flex items-center gap-3 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase mb-5">
                        <div className="w-6 h-[1px] bg-millions-accent/40" />
                        A short walkthrough
                        <div className="w-6 h-[1px] bg-millions-accent/40" />
                    </div>

                    <h1 className="font-cormorant text-[clamp(2rem,6vw,4rem)] font-light leading-[1] mb-5 sm:mb-6">
                        How is the new admin <em className="italic text-millions-accent">working for you?</em>
                    </h1>

                    <p className="font-jost text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-white/60 max-w-2xl">
                        Below is every feature we've built so far. For each one, tap whether it worked, was confusing, or broke —
                        and drop a quick comment if anything needs attention. Your replies save automatically as you go, so you
                        can come back later if you need to break this up over a couple of sessions.
                    </p>
                </div>
            </section>

            {/* Sticky progress bar */}
            <div className="sticky top-0 z-30 backdrop-blur bg-millions-dark/80 border-y border-white/5">
                <div className="max-w-3xl mx-auto px-6 sm:px-10 md:px-16 py-3 sm:py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-jost text-white/40 uppercase tracking-[0.2em]">
                                Progress
                            </span>
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-jost text-millions-accent uppercase tracking-[0.2em] font-bold">
                                {ratedCount} of {TOTAL_FEATURES}
                            </span>
                        </div>
                        <div className="h-1 bg-white/5 overflow-hidden">
                            <div
                                className="h-full bg-millions-accent transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURE CATEGORIES ---------------------------------------- */}
            <section className="px-6 sm:px-10 md:px-16 py-10 sm:py-14">
                <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
                    {FEATURE_CATALOGUE.map((category, idx) => (
                        <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="mb-5 sm:mb-6 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3 text-millions-accent text-[0.55rem] sm:text-[0.6rem] tracking-[0.3em] uppercase mb-2">
                                    <div className="w-5 h-[1px] bg-millions-accent/40" />
                                    {String(idx + 1).padStart(2, "0")} · {category.label}
                                </div>
                                <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-light leading-tight">
                                    {category.desc}
                                </h2>
                            </div>

                            <ul className="space-y-3 sm:space-y-4">
                                {category.features.map((feature) => {
                                    const response = responses[feature.id];
                                    const isOpen = !!commentOpen[feature.id];
                                    return (
                                        <li
                                            key={feature.id}
                                            className={`bg-white/[0.02] border ${response ? "border-millions-accent/20" : "border-white/5"} transition-colors`}
                                        >
                                            <div className="p-4 sm:p-5">
                                                <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-cormorant text-base sm:text-lg text-white leading-snug">
                                                            {feature.label}
                                                        </h3>
                                                        {feature.where && (
                                                            <p className="text-[0.6rem] sm:text-[0.65rem] font-jost text-white/30 mt-1 italic">
                                                                {feature.where}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status pills */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {STATUS_OPTIONS.map((opt) => {
                                                        const Icon = STATUS_ICON[opt.value];
                                                        const active = response?.status === opt.value;
                                                        const cls = active
                                                            ? STATUS_TONE_CLASSES[opt.value].active
                                                            : STATUS_TONE_CLASSES[opt.value].idle;
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => setStatus(feature.id, opt.value)}
                                                                className={`px-2.5 sm:px-3 py-2 text-[0.6rem] sm:text-[0.65rem] font-jost uppercase tracking-[0.12em] sm:tracking-[0.15em] font-medium transition-all border flex items-center justify-center gap-1.5 ${cls}`}
                                                            >
                                                                <Icon className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{opt.short}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Comment toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleComment(feature.id)}
                                                    className="mt-3 inline-flex items-center gap-1.5 text-[0.6rem] font-jost text-white/30 hover:text-millions-accent uppercase tracking-[0.18em] transition-colors"
                                                >
                                                    <MessageSquare className="w-3 h-3" />
                                                    {response?.comment
                                                        ? "Comment added"
                                                        : isOpen
                                                            ? "Hide comment"
                                                            : "Add a comment (optional)"}
                                                    {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>

                                                {isOpen && (
                                                    <div className="mt-3">
                                                        <textarea
                                                            value={response?.comment ?? ""}
                                                            onChange={(e) => setComment(feature.id, e.target.value)}
                                                            placeholder="What worked, what didn't, what you'd change..."
                                                            rows={2}
                                                            maxLength={2000}
                                                            className="w-full bg-white/5 border border-white/10 text-white/80 font-jost text-[0.8rem] focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none p-3 transition-all placeholder:text-white/15 resize-y"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* OVERALL RATING ------------------------------------------- */}
            <section className="px-6 sm:px-10 md:px-16 py-10 sm:py-14 bg-millions-accent/5 border-y border-millions-accent/10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase mb-4">
                        <Sparkles className="w-4 h-4" />
                        Overall
                    </div>
                    <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-light leading-tight mb-8">
                        How would you rate the admin <em className="italic text-millions-accent">overall?</em>
                    </h2>

                    <div className="flex items-center gap-2 sm:gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((n) => {
                            const filled = overallRating !== null && n <= overallRating;
                            return (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setOverallRating(overallRating === n ? null : n)}
                                    className="p-1 transition-transform hover:scale-110"
                                    aria-label={`Rate ${n} stars`}
                                >
                                    <Star
                                        className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${filled ? "fill-millions-accent text-millions-accent" : "text-white/15 hover:text-millions-accent/50"}`}
                                    />
                                </button>
                            );
                        })}
                        {overallRating !== null && (
                            <span className="ml-3 font-cormorant text-2xl sm:text-3xl text-white/70 italic">
                                {overallRating}/5
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] block">
                            Anything else you'd like to mention?
                        </label>
                        <textarea
                            value={overallComment}
                            onChange={(e) => setOverallComment(e.target.value)}
                            placeholder="What's the firm's biggest pain point right now? What feature would change your day-to-day if I added it next? Anything I should drop?"
                            rows={5}
                            maxLength={5000}
                            className="w-full bg-white/5 border border-white/10 text-white font-jost text-[0.85rem] leading-relaxed focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none p-4 transition-all placeholder:text-white/20 resize-y"
                        />
                    </div>
                </div>
            </section>

            {/* SUBMITTER + SUBMIT ---------------------------------------- */}
            <section className="px-6 sm:px-10 md:px-16 py-12 sm:py-16">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="submitter-name" className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] block">
                            Your name *
                        </label>
                        <input
                            id="submitter-name"
                            value={submittedBy}
                            onChange={(e) => setSubmittedBy(e.target.value)}
                            placeholder="e.g. Mark Million"
                            maxLength={120}
                            className="w-full bg-white/5 border border-white/10 text-white font-cormorant text-lg sm:text-xl focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none p-4 transition-all placeholder:text-white/15"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full h-14 sm:h-16 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.25em] uppercase text-[0.75rem] sm:text-[0.8rem] font-bold transition-all shadow-lg"
                    >
                        {saving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Send className="w-5 h-5 mr-3" />}
                        Send your feedback
                    </Button>

                    <p className="text-[0.65rem] sm:text-[0.7rem] font-jost text-white/30 text-center leading-relaxed">
                        Goes straight to Yadamzer. Take as long as you need — your answers save in this browser as you go.
                    </p>
                </div>
            </section>
        </div>
    );
};

const ThankYouScreen = ({ onAnother }: { onAnother: () => void }) => (
    <div className="min-h-screen bg-millions-dark text-white flex items-center justify-center px-6 sm:px-10 md:px-16 py-16">
        <div className="max-w-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-millions-accent/10 border border-millions-accent/30 mb-8 sm:mb-10">
                <PartyPopper className="w-9 h-9 sm:w-11 sm:h-11 text-millions-accent" />
            </div>
            <h1 className="font-cormorant text-[clamp(2rem,6vw,4rem)] font-light leading-[1.05] mb-6">
                Thank you — <em className="italic text-millions-accent">that's exactly what I needed.</em>
            </h1>
            <p className="font-jost text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-white/60 max-w-xl mx-auto mb-10">
                Your feedback has been recorded. I'll review every comment, fix what's broken, and make the
                confusing bits clearer in the next pass. Feel free to come back here and submit again later if
                anything else comes up while you're using the admin day to day.
            </p>
            <button
                onClick={onAnother}
                className="text-[0.7rem] font-jost text-millions-accent hover:text-white uppercase tracking-[0.3em] font-bold transition-colors"
            >
                Send another →
            </button>
        </div>
    </div>
);

export default FeedbackWalkthrough;

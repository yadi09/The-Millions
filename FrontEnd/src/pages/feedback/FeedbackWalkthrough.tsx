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
    UserCheck,
    ChevronLeft,
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

// The firm has two partners — each gets their own form slot, their own
// localStorage draft, and their name auto-fills on submit. If a third
// owner ever joins, add an entry here.
type OwnerKey = "mark" | "seleshi";

const OWNERS: { key: OwnerKey; name: string; title: string; intro: string }[] = [
    {
        key: "mark",
        name: "Mark Million",
        title: "Partner",
        intro: "Walk through the admin in your own time. Your answers save automatically.",
    },
    {
        key: "seleshi",
        name: "Seleshi Million",
        title: "Partner",
        intro: "Walk through the admin in your own time. Your answers save automatically.",
    },
];

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

// Per-owner draft keys. Bumped to v2 because the new schema includes
// only what's specific to one owner (no submittedBy field — the picker
// chooses that).
const draftKey = (owner: OwnerKey) => `the-millions-feedback-draft-v2-${owner}`;
// Tracks which owners have submitted so the picker can show a "DONE"
// badge next to a name that already has feedback in. Reset on submit.
const SUBMITTED_OWNERS_KEY = "the-millions-feedback-submitted-owners";

function readSubmittedOwners(): Set<OwnerKey> {
    try {
        const raw = localStorage.getItem(SUBMITTED_OWNERS_KEY);
        if (!raw) return new Set();
        return new Set(JSON.parse(raw));
    } catch {
        return new Set();
    }
}

function markOwnerSubmitted(owner: OwnerKey) {
    try {
        const current = readSubmittedOwners();
        current.add(owner);
        localStorage.setItem(SUBMITTED_OWNERS_KEY, JSON.stringify([...current]));
    } catch {
        // quota / disabled — fine
    }
}

const FeedbackWalkthrough = () => {
    const [activeOwner, setActiveOwner] = useState<OwnerKey | null>(null);
    const [submittedOwners, setSubmittedOwners] = useState<Set<OwnerKey>>(readSubmittedOwners());
    const [submitted, setSubmitted] = useState(false);

    if (submitted && activeOwner) {
        return (
            <ThankYouScreen
                owner={OWNERS.find((o) => o.key === activeOwner)!}
                otherOwnerPending={OWNERS.some((o) => o.key !== activeOwner && !submittedOwners.has(o.key))}
                onSwitchOwner={(next) => {
                    setActiveOwner(next);
                    setSubmitted(false);
                }}
                onDone={() => {
                    setActiveOwner(null);
                    setSubmitted(false);
                }}
            />
        );
    }

    if (!activeOwner) {
        return (
            <OwnerPicker
                submittedOwners={submittedOwners}
                onPick={setActiveOwner}
            />
        );
    }

    return (
        <WalkthroughForm
            owner={OWNERS.find((o) => o.key === activeOwner)!}
            onBack={() => setActiveOwner(null)}
            onSubmitted={() => {
                markOwnerSubmitted(activeOwner);
                setSubmittedOwners(readSubmittedOwners());
                setSubmitted(true);
            }}
        />
    );
};

// ----- Picker screen ---------------------------------------------------------

const OwnerPicker = ({
    submittedOwners,
    onPick,
}: {
    submittedOwners: Set<OwnerKey>;
    onPick: (k: OwnerKey) => void;
}) => (
    <div className="min-h-screen bg-millions-dark text-white selection:bg-millions-accent selection:text-millions-dark flex flex-col">
        <section className="relative px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 overflow-hidden flex-1 flex items-center">
            <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.025] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-millions-accent/8 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-millions-accent/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative max-w-3xl mx-auto w-full">
                <div className="flex flex-col items-center mb-10 sm:mb-12">
                    <span className="font-cormorant text-[0.65rem] sm:text-[0.7rem] font-light tracking-[0.4em] text-white/40 uppercase">the</span>
                    <span className="font-cormorant text-2xl sm:text-3xl font-semibold text-white">MILLIONS.</span>
                </div>

                <div className="inline-flex items-center gap-3 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase mb-5">
                    <div className="w-6 h-[1px] bg-millions-accent/40" />
                    A walkthrough
                    <div className="w-6 h-[1px] bg-millions-accent/40" />
                </div>

                <h1 className="font-cormorant text-[clamp(2rem,6vw,4rem)] font-light leading-[1.05] mb-5 sm:mb-6 text-center">
                    Who's <em className="italic text-millions-accent">filling this out?</em>
                </h1>

                <p className="font-jost text-[0.85rem] sm:text-[0.95rem] leading-relaxed text-white/60 max-w-xl mx-auto text-center mb-10 sm:mb-14">
                    Pick yourself below. Each of you gets your own form — your answers save in this
                    browser as you go, so you can come back to it later. Both of you can fill it in
                    independently; I'll see both responses on my end.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-xl mx-auto">
                    {OWNERS.map((owner) => {
                        const isDone = submittedOwners.has(owner.key);
                        const hasDraft = (() => {
                            try {
                                return !!localStorage.getItem(draftKey(owner.key));
                            } catch {
                                return false;
                            }
                        })();
                        return (
                            <button
                                key={owner.key}
                                type="button"
                                onClick={() => onPick(owner.key)}
                                className="group bg-white/5 border border-white/10 hover:border-millions-accent/40 active:bg-white/[0.08] transition-all p-6 sm:p-7 text-left"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-millions-accent/10 border border-millions-accent/30 flex items-center justify-center shrink-0 group-hover:bg-millions-accent/20 transition-colors">
                                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-millions-accent" />
                                    </div>
                                    {isDone && (
                                        <span className="text-[0.5rem] font-jost text-emerald-300 uppercase tracking-[0.25em] font-bold bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5">
                                            Done
                                        </span>
                                    )}
                                    {!isDone && hasDraft && (
                                        <span className="text-[0.5rem] font-jost text-amber-300 uppercase tracking-[0.25em] font-bold bg-amber-500/10 border border-amber-400/30 px-2 py-0.5">
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-cormorant text-2xl sm:text-3xl text-white font-light italic leading-tight mb-1">
                                    {owner.name}
                                </h3>
                                <p className="text-[0.6rem] sm:text-[0.65rem] font-jost text-millions-accent uppercase tracking-[0.2em] mb-3">
                                    {owner.title}
                                </p>
                                <p className="text-[0.75rem] sm:text-[0.8rem] font-jost text-white/40 leading-relaxed">
                                    {isDone ? "You've already submitted feedback. Tap to send another round." : owner.intro}
                                </p>
                                <div className="mt-4 pt-3 border-t border-white/5 text-[0.6rem] font-jost text-millions-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    {isDone ? "Submit again" : hasDraft ? "Continue draft" : "Start walkthrough"} →
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    </div>
);

// ----- Walkthrough form (per-owner) -----------------------------------------

const WalkthroughForm = ({
    owner,
    onBack,
    onSubmitted,
}: {
    owner: typeof OWNERS[number];
    onBack: () => void;
    onSubmitted: () => void;
}) => {
    const [responses, setResponses] = useState<ResponseMap>({});
    const [overallRating, setOverallRating] = useState<number | null>(null);
    const [overallComment, setOverallComment] = useState("");
    const [commentOpen, setCommentOpen] = useState<Record<string, boolean>>({});
    const [submit, { isLoading: saving }] = useSubmitFeedbackMutation();

    // Load this owner's draft on mount. Each owner has their own slot.
    useEffect(() => {
        try {
            const raw = localStorage.getItem(draftKey(owner.key));
            if (!raw) {
                // reset state if there's nothing saved — important when switching owners
                setResponses({});
                setOverallRating(null);
                setOverallComment("");
                return;
            }
            const draft = JSON.parse(raw);
            setResponses(draft?.responses ?? {});
            setOverallRating(typeof draft?.overallRating === "number" ? draft.overallRating : null);
            setOverallComment(draft?.overallComment ?? "");
        } catch {
            // ignore corrupted draft
        }
    }, [owner.key]);

    // Persist on change to the owner-specific slot.
    useEffect(() => {
        try {
            localStorage.setItem(
                draftKey(owner.key),
                JSON.stringify({ responses, overallRating, overallComment })
            );
        } catch {
            // quota or disabled — fine
        }
    }, [owner.key, responses, overallRating, overallComment]);

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
        try {
            await submit({
                submittedBy: owner.name,
                overallRating,
                overallComment: overallComment.trim() || null,
                responses,
            }).unwrap();
            try {
                localStorage.removeItem(draftKey(owner.key));
            } catch {
                // ignore
            }
            onSubmitted();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e: any) {
            toast.error(e?.data?.message || "Couldn't send feedback. Try again in a moment.");
        }
    };

    return (
        <div className="min-h-screen bg-millions-dark text-white selection:bg-millions-accent selection:text-millions-dark">
            {/* HERO ----------------------------------------------------- */}
            <section className="relative px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.025] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-millions-accent/8 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative max-w-3xl mx-auto">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-millions-accent text-[0.65rem] font-jost uppercase tracking-[0.2em] mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Switch person
                    </button>

                    <div className="flex flex-col items-center mb-8 sm:mb-10">
                        <span className="font-cormorant text-[0.65rem] sm:text-[0.7rem] font-light tracking-[0.4em] text-white/40 uppercase">the</span>
                        <span className="font-cormorant text-2xl sm:text-3xl font-semibold text-white">MILLIONS.</span>
                    </div>

                    <div className="inline-flex items-center gap-3 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.3em] uppercase mb-5">
                        <div className="w-6 h-[1px] bg-millions-accent/40" />
                        Filling out as {owner.name.split(" ")[0]}
                        <div className="w-6 h-[1px] bg-millions-accent/40" />
                    </div>

                    <h1 className="font-cormorant text-[clamp(2rem,6vw,4rem)] font-light leading-[1] mb-5 sm:mb-6">
                        Hi {owner.name.split(" ")[0]} — how is the new admin <em className="italic text-millions-accent">working for you?</em>
                    </h1>

                    <p className="font-jost text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-white/60 max-w-2xl">
                        Below is every feature we've built so far. For each one, tap whether it worked, was confusing, or broke —
                        and drop a quick comment if anything needs attention. Your replies save automatically as you go.
                    </p>
                </div>
            </section>

            {/* Sticky progress bar */}
            <div className="sticky top-0 z-30 backdrop-blur bg-millions-dark/80 border-y border-white/5">
                <div className="max-w-3xl mx-auto px-6 sm:px-10 md:px-16 py-3 sm:py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-jost text-white/40 uppercase tracking-[0.2em]">
                                {owner.name.split(" ")[0]}'s progress
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

            {/* SUBMIT --------------------------------------------------- */}
            <section className="px-6 sm:px-10 md:px-16 py-12 sm:py-16">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-millions-accent shrink-0" />
                        <div className="text-[0.75rem] sm:text-[0.8rem] font-jost text-white/70 leading-relaxed">
                            Submitting as <span className="text-white font-medium">{owner.name}</span>.
                            {" "}
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-millions-accent hover:text-white underline transition-colors"
                            >
                                Not you?
                            </button>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full h-14 sm:h-16 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.25em] uppercase text-[0.75rem] sm:text-[0.8rem] font-bold transition-all shadow-lg"
                    >
                        {saving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Send className="w-5 h-5 mr-3" />}
                        Send {owner.name.split(" ")[0]}'s feedback
                    </Button>

                    <p className="text-[0.65rem] sm:text-[0.7rem] font-jost text-white/30 text-center leading-relaxed">
                        Goes straight to Yadamzer. Take as long as you need — your answers save in this browser as you go.
                    </p>
                </div>
            </section>
        </div>
    );
};

// ----- Thank-you screen ------------------------------------------------------

const ThankYouScreen = ({
    owner,
    otherOwnerPending,
    onSwitchOwner,
    onDone,
}: {
    owner: typeof OWNERS[number];
    otherOwnerPending: boolean;
    onSwitchOwner: (k: OwnerKey) => void;
    onDone: () => void;
}) => {
    const otherOwner = OWNERS.find((o) => o.key !== owner.key);
    return (
        <div className="min-h-screen bg-millions-dark text-white flex items-center justify-center px-6 sm:px-10 md:px-16 py-16">
            <div className="max-w-2xl text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-millions-accent/10 border border-millions-accent/30 mb-8 sm:mb-10">
                    <PartyPopper className="w-9 h-9 sm:w-11 sm:h-11 text-millions-accent" />
                </div>
                <h1 className="font-cormorant text-[clamp(2rem,6vw,4rem)] font-light leading-[1.05] mb-6">
                    Thank you, {owner.name.split(" ")[0]} — <em className="italic text-millions-accent">that's exactly what I needed.</em>
                </h1>
                <p className="font-jost text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-white/60 max-w-xl mx-auto mb-10">
                    Your feedback has been recorded. I'll review every comment, fix what's broken, and make the
                    confusing bits clearer in the next pass.
                </p>

                {otherOwnerPending && otherOwner && (
                    <div className="bg-millions-accent/5 border border-millions-accent/20 p-5 sm:p-6 mb-8 max-w-xl mx-auto">
                        <p className="text-[0.7rem] font-jost text-millions-accent uppercase tracking-[0.25em] font-bold mb-2">
                            Still waiting on {otherOwner.name.split(" ")[0]}
                        </p>
                        <p className="text-[0.8rem] font-jost text-white/60 leading-relaxed mb-4">
                            If {otherOwner.name.split(" ")[0]} is here too, hand them the device — their slot is ready.
                        </p>
                        <button
                            type="button"
                            onClick={() => onSwitchOwner(otherOwner.key)}
                            className="text-[0.65rem] font-jost text-millions-accent hover:text-white uppercase tracking-[0.25em] font-bold transition-colors"
                        >
                            Start {otherOwner.name.split(" ")[0]}'s walkthrough →
                        </button>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center">
                    <button
                        type="button"
                        onClick={onDone}
                        className="text-[0.7rem] font-jost text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors"
                    >
                        Back to picker
                    </button>
                    <span className="text-white/20 hidden sm:inline">·</span>
                    <button
                        type="button"
                        onClick={() => onSwitchOwner(owner.key)}
                        className="text-[0.7rem] font-jost text-millions-accent hover:text-white uppercase tracking-[0.3em] font-bold transition-colors"
                    >
                        Send another round →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackWalkthrough;

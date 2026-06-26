import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Loader2,
    Check,
    AlertTriangle,
    X,
    Minus,
    Star,
    Trash2,
    MessageSquare,
    ChevronLeft,
    Inbox as InboxIcon,
    Users,
    List,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import {
    useListFeedbackQuery,
    useDeleteFeedbackMutation,
} from "../../features/api/apiSlice";
import {
    FEATURE_CATALOGUE,
    findFeature,
    STATUS_OPTIONS,
    type ResponseStatus,
} from "../../data/feedbackCatalogue";

type Submission = {
    id: string;
    submittedBy: string;
    overallRating: number | null;
    overallComment: string | null;
    responses: Record<string, { status: ResponseStatus; comment?: string | null }>;
    createdAt: string;
};

const STATUS_ICON: Record<ResponseStatus, any> = {
    worked: Check,
    struggled: AlertTriangle,
    broken: X,
    skipped: Minus,
};

const STATUS_TONE: Record<ResponseStatus, string> = {
    worked: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30",
    struggled: "text-amber-300 bg-amber-500/10 border-amber-400/30",
    broken: "text-red-400 bg-red-500/10 border-red-400/30",
    skipped: "text-white/40 bg-white/5 border-white/10",
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3 font-medium">
        {children}
    </p>
);

function relativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffSec = Math.round((now - then) / 1000);
    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.round(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.round(diffSec / 3600)}h ago`;
    if (diffSec < 86400 * 7) return `${Math.round(diffSec / 86400)}d ago`;
    return new Date(iso).toLocaleDateString();
}

type View = "list" | "compare";

const FeedbackResults = () => {
    const { data: submissions = [], isLoading } = useListFeedbackQuery();
    const [deleteFeedback] = useDeleteFeedbackMutation();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [view, setView] = useState<View>("list");

    // For the compare view, find the most recent submission per submitter name.
    // submissions are already ordered desc, so the first match wins.
    const latestPerOwner = useMemo(() => {
        const seen = new Map<string, Submission>();
        for (const s of submissions as Submission[]) {
            if (!seen.has(s.submittedBy)) seen.set(s.submittedBy, s);
        }
        return [...seen.values()];
    }, [submissions]);

    const selected = (submissions as Submission[]).find((s) => s.id === selectedId);

    // Aggregate stats across all submissions: how many people marked each
    // feature as worked / struggled / broken / skipped. Lets the user spot
    // problem features at a glance without clicking into each submission.
    const aggregate = useMemo(() => {
        const counts: Record<string, Record<ResponseStatus, number>> = {};
        for (const s of submissions as Submission[]) {
            for (const [fid, r] of Object.entries(s.responses ?? {})) {
                if (!r?.status) continue;
                if (!counts[fid]) counts[fid] = { worked: 0, struggled: 0, broken: 0, skipped: 0 };
                counts[fid][r.status]++;
            }
        }
        return counts;
    }, [submissions]);

    const handleDelete = async (id: string) => {
        try {
            await deleteFeedback(id).unwrap();
            toast.success("Submission deleted.");
            if (selectedId === id) setSelectedId(null);
        } catch (e: any) {
            toast.error(e?.data?.message || "Failed to delete.");
        }
    };

    // ----- DETAIL VIEW -----
    if (selected) {
        return (
            <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
                <div>
                    <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-millions-accent text-[0.65rem] font-jost uppercase tracking-[0.2em] mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back to submissions
                    </button>
                    <h1 className="font-cormorant text-[clamp(1.85rem,5vw,3rem)] font-light text-white mb-3 leading-tight">
                        Feedback from <em className="italic text-millions-accent">{selected.submittedBy}</em>
                    </h1>
                    <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                        <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                        {new Date(selected.createdAt).toLocaleString()}
                    </div>
                </div>

                {/* Overall block */}
                <Card className="bg-millions-accent/5 border-millions-accent/20 rounded-none">
                    <CardContent className="p-5 sm:p-6 md:p-7">
                        <SectionLabel>Overall</SectionLabel>
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((n) => {
                                const filled = selected.overallRating !== null && n <= selected.overallRating;
                                return (
                                    <Star
                                        key={n}
                                        className={`w-6 h-6 sm:w-7 sm:h-7 ${filled ? "fill-millions-accent text-millions-accent" : "text-white/15"}`}
                                    />
                                );
                            })}
                            {selected.overallRating !== null && (
                                <span className="ml-2 font-cormorant text-xl sm:text-2xl text-white/70 italic">
                                    {selected.overallRating}/5
                                </span>
                            )}
                        </div>
                        {selected.overallComment ? (
                            <p className="font-cormorant text-base sm:text-lg italic text-white/80 leading-relaxed whitespace-pre-wrap">
                                "{selected.overallComment}"
                            </p>
                        ) : (
                            <p className="font-jost text-[0.7rem] text-white/30 italic">No overall comment</p>
                        )}
                    </CardContent>
                </Card>

                {/* Per-feature breakdown, grouped by category */}
                <div className="space-y-8">
                    {FEATURE_CATALOGUE.map((category) => {
                        const responsesInCategory = category.features
                            .map((f) => ({ feature: f, response: selected.responses?.[f.id] }))
                            .filter((r) => r.response);
                        if (responsesInCategory.length === 0) return null;
                        return (
                            <div key={category.id}>
                                <div className="mb-3 pb-2 border-b border-white/5">
                                    <SectionLabel>{category.label}</SectionLabel>
                                </div>
                                <ul className="space-y-2">
                                    {responsesInCategory.map(({ feature, response }) => {
                                        if (!response) return null;
                                        const Icon = STATUS_ICON[response.status];
                                        const tone = STATUS_TONE[response.status];
                                        const statusLabel = STATUS_OPTIONS.find((o) => o.value === response.status)?.short ?? response.status;
                                        return (
                                            <li key={feature.id} className="bg-white/[0.02] border border-white/5 p-4">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="font-cormorant text-base sm:text-lg text-white leading-snug">
                                                        {feature.label}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[0.55rem] sm:text-[0.6rem] font-jost uppercase tracking-[0.15em] font-bold border shrink-0 ${tone}`}>
                                                        <Icon className="w-3 h-3" />
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                                {response.comment && (
                                                    <p className="text-[0.75rem] sm:text-[0.8rem] font-jost text-white/60 leading-relaxed mt-2 pl-3 border-l-2 border-millions-accent/30 whitespace-pre-wrap">
                                                        {response.comment}
                                                    </p>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Show features that weren't rated at all in this submission */}
                {(() => {
                    const unrated = FEATURE_CATALOGUE.flatMap((c) => c.features).filter(
                        (f) => !selected.responses?.[f.id]
                    );
                    if (unrated.length === 0) return null;
                    return (
                        <Card className="bg-white/[0.02] border-white/5 rounded-none">
                            <CardContent className="p-5 sm:p-6">
                                <SectionLabel>{unrated.length} features were not rated in this submission</SectionLabel>
                                <ul className="text-[0.75rem] font-jost text-white/40 space-y-1">
                                    {unrated.map((f) => (
                                        <li key={f.id}>· {f.label}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    );
                })()}

                <div className="pt-4 border-t border-white/5">
                    <Button
                        onClick={() => setDeletingId(selected.id)}
                        variant="outline"
                        className="rounded-none border-red-400/20 text-red-400/70 hover:bg-red-400/5 hover:text-red-400 text-[0.65rem] uppercase tracking-[0.2em] h-10 px-5"
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete this submission
                    </Button>
                </div>

                <ConfirmModal
                    isOpen={deletingId !== null}
                    onClose={() => setDeletingId(null)}
                    onConfirm={async () => {
                        if (deletingId) await handleDelete(deletingId);
                    }}
                    title="Delete submission?"
                    message={`Permanently remove ${selected.submittedBy}'s feedback?`}
                    confirmText="Delete"
                />
            </div>
        );
    }

    // ----- LIST VIEW -----
    return (
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Feedback <em className="italic text-millions-accent">Results</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    {submissions.length} submission{submissions.length === 1 ? "" : "s"}
                </div>
                <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed max-w-2xl">
                    Share the walkthrough URL with the firm owners and they'll fill out this checklist.
                    Their replies land here. Click any row to see their per-feature responses and comments.
                </p>
                <p className="mt-3 text-[0.7rem] font-jost text-white/30 break-all">
                    Walkthrough link:{" "}
                    <a
                        href="/feedback/walkthrough"
                        target="_blank"
                        rel="noreferrer"
                        className="text-millions-accent hover:text-white underline"
                    >
                        {window.location.origin}/feedback/walkthrough
                    </a>
                </p>
            </div>

            {/* View toggle — once both partners have submitted, Compare is the
                most useful view; otherwise List is fine. */}
            {submissions.length > 0 && (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 h-10 px-4 text-[0.65rem] font-jost uppercase tracking-[0.2em] border transition-all ${view === "list"
                                ? "bg-millions-accent text-millions-dark border-millions-accent font-bold"
                                : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white"
                            }`}
                    >
                        <List className="w-3.5 h-3.5" />
                        All submissions
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("compare")}
                        disabled={latestPerOwner.length < 2}
                        title={latestPerOwner.length < 2 ? "Need feedback from at least two people to compare" : ""}
                        className={`flex items-center gap-2 h-10 px-4 text-[0.65rem] font-jost uppercase tracking-[0.2em] border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${view === "compare"
                                ? "bg-millions-accent text-millions-dark border-millions-accent font-bold"
                                : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white"
                            }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        Side-by-side compare
                    </button>
                </div>
            )}

            {view === "compare" && latestPerOwner.length >= 2 ? (
                <CompareView submissions={latestPerOwner.slice(0, 2)} />
            ) : null}

            {/* Aggregate scoreboard — features that drew the most complaints */}
            {view === "list" && submissions.length > 0 && (
                <Card className="bg-white/5 border-white/5 rounded-none">
                    <CardContent className="p-5 sm:p-6">
                        <SectionLabel>At a glance — how many people had trouble with each feature</SectionLabel>
                        <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                            {Object.entries(aggregate)
                                .map(([fid, counts]) => ({
                                    fid,
                                    counts,
                                    flagged: counts.struggled + counts.broken,
                                    found: findFeature(fid),
                                }))
                                .filter((x) => x.flagged > 0)
                                .sort((a, b) => b.flagged - a.flagged)
                                .slice(0, 10)
                                .map(({ fid, counts, found }) => (
                                    <li key={fid} className="flex items-center justify-between gap-3 p-2.5 bg-white/[0.02] border border-white/5">
                                        <span className="text-[0.75rem] font-jost text-white truncate flex-1 min-w-0">
                                            {found?.feature.label ?? fid}
                                            <span className="text-white/30 ml-2 text-[0.65rem]">· {found?.category.label}</span>
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {counts.struggled > 0 && (
                                                <span className="inline-flex items-center gap-1 text-amber-300 text-[0.6rem] font-jost font-bold">
                                                    <AlertTriangle className="w-3 h-3" /> {counts.struggled}
                                                </span>
                                            )}
                                            {counts.broken > 0 && (
                                                <span className="inline-flex items-center gap-1 text-red-400 text-[0.6rem] font-jost font-bold">
                                                    <X className="w-3 h-3" /> {counts.broken}
                                                </span>
                                            )}
                                            {counts.worked > 0 && (
                                                <span className="inline-flex items-center gap-1 text-emerald-400/70 text-[0.6rem] font-jost">
                                                    <Check className="w-3 h-3" /> {counts.worked}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            {Object.values(aggregate).every((c) => c.struggled === 0 && c.broken === 0) && (
                                <li className="text-[0.75rem] font-jost text-emerald-400/70 italic text-center py-4">
                                    Everything's working smoothly so far. 🎉
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Submission list — only when in list view */}
            {view === "list" && (
            <Card className="bg-white/5 border-white/5 rounded-none">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-6 h-6 text-millions-accent animate-spin mx-auto mb-3" />
                            <p className="text-[0.7rem] font-jost text-white/30 uppercase tracking-[0.25em]">
                                Loading submissions…
                            </p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-12 sm:p-16 text-center">
                            <InboxIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white/10 mx-auto mb-4" />
                            <h3 className="font-cormorant text-xl sm:text-2xl text-white/50 font-light italic mb-2">
                                No feedback yet
                            </h3>
                            <p className="text-white/30 font-jost text-[0.75rem] sm:text-[0.8rem] max-w-sm mx-auto leading-relaxed">
                                Send the walkthrough link above to the firm owners. Their replies will appear here.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-white/5">
                            {(submissions as Submission[]).map((s) => {
                                const totalRated = Object.keys(s.responses ?? {}).length;
                                const issues = Object.values(s.responses ?? {}).filter(
                                    (r) => r?.status === "struggled" || r?.status === "broken"
                                ).length;
                                return (
                                    <li key={s.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(s.id)}
                                            className="w-full text-left flex items-center gap-4 p-4 sm:p-5 md:p-6 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors group"
                                        >
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-millions-accent/10 border border-millions-accent/20 flex items-center justify-center shrink-0 group-hover:bg-millions-accent/15 transition-colors">
                                                <MessageSquare className="w-4 h-4 text-millions-accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-cormorant text-lg sm:text-xl text-white font-light italic leading-tight truncate">
                                                        {s.submittedBy}
                                                    </h3>
                                                    {s.overallRating !== null && (
                                                        <span className="inline-flex items-center gap-0.5 text-millions-accent text-[0.6rem]">
                                                            {Array.from({ length: s.overallRating }).map((_, i) => (
                                                                <Star key={i} className="w-3 h-3 fill-millions-accent text-millions-accent" />
                                                            ))}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[0.6rem] sm:text-[0.65rem] font-jost text-white/30 mt-1">
                                                    {relativeTime(s.createdAt)} · {totalRated} feature{totalRated === 1 ? "" : "s"} rated
                                                    {issues > 0 && (
                                                        <span className="text-amber-300/80 ml-2 font-bold">
                                                            · {issues} flagged
                                                        </span>
                                                    )}
                                                </p>
                                                {s.overallComment && (
                                                    <p className="text-[0.7rem] sm:text-[0.75rem] font-jost text-white/50 mt-1.5 line-clamp-1 italic">
                                                        "{s.overallComment}"
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-[0.55rem] font-jost text-millions-accent/60 uppercase tracking-[0.2em] shrink-0">
                                                View →
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </CardContent>
            </Card>
            )}
        </div>
    );
};

// ----- Compare view: two submissions side by side ---------------------------

const COMPARE_STATUS_TONE: Record<ResponseStatus, string> = {
    worked: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30",
    struggled: "text-amber-300 bg-amber-500/10 border-amber-400/30",
    broken: "text-red-400 bg-red-500/10 border-red-400/30",
    skipped: "text-white/40 bg-white/5 border-white/10",
};

const CompareView = ({ submissions }: { submissions: Submission[] }) => {
    const [left, right] = submissions;
    if (!left || !right) return null;

    // For each feature, surface what each person said. A row gets a subtle
    // amber tint when the two responses DISAGREE — that's where the action is.
    const featuresToShow = FEATURE_CATALOGUE.flatMap((c) =>
        c.features.map((f) => ({ category: c, feature: f }))
    );

    return (
        <Card className="bg-white/5 border-white/5 rounded-none">
            <CardContent className="p-0">
                {/* Header */}
                <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-4 border-b border-white/5 bg-black/20">
                    <SectionLabel>Feature</SectionLabel>
                    <div className="text-center">
                        <p className="font-cormorant text-base sm:text-lg text-white font-light italic leading-none truncate">
                            {left.submittedBy.split(" ")[0]}
                        </p>
                        {left.overallRating !== null && (
                            <span className="inline-flex items-center gap-0.5 mt-1">
                                {Array.from({ length: left.overallRating }).map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-millions-accent text-millions-accent" />
                                ))}
                            </span>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="font-cormorant text-base sm:text-lg text-white font-light italic leading-none truncate">
                            {right.submittedBy.split(" ")[0]}
                        </p>
                        {right.overallRating !== null && (
                            <span className="inline-flex items-center gap-0.5 mt-1">
                                {Array.from({ length: right.overallRating }).map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-millions-accent text-millions-accent" />
                                ))}
                            </span>
                        )}
                    </div>
                </div>

                {/* Per-category groups */}
                {FEATURE_CATALOGUE.map((category) => {
                    const categoryRows = featuresToShow.filter((x) => x.category.id === category.id);
                    return (
                        <div key={category.id}>
                            <div className="px-4 sm:px-5 md:px-6 py-3 bg-millions-accent/5 border-b border-millions-accent/10">
                                <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-millions-accent uppercase tracking-[0.25em] font-bold">
                                    {category.label}
                                </p>
                            </div>
                            <ul className="divide-y divide-white/5">
                                {categoryRows.map(({ feature }) => {
                                    const lr = left.responses?.[feature.id];
                                    const rr = right.responses?.[feature.id];
                                    const bothRated = lr?.status && rr?.status;
                                    const disagree = bothRated && lr.status !== rr.status && (lr.status !== "skipped" && rr.status !== "skipped");
                                    return (
                                        <li
                                            key={feature.id}
                                            className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 items-start transition-colors ${disagree ? "bg-amber-500/[0.04]" : ""}`}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-[0.7rem] sm:text-[0.75rem] font-jost text-white/80 leading-snug">
                                                    {feature.label}
                                                </p>
                                                {disagree && (
                                                    <span className="inline-flex items-center gap-1 mt-1 text-[0.55rem] font-jost text-amber-300 uppercase tracking-[0.2em] font-bold">
                                                        <AlertTriangle className="w-2.5 h-2.5" />
                                                        Disagreement
                                                    </span>
                                                )}
                                            </div>
                                            <CompareCell response={lr} />
                                            <CompareCell response={rr} />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}

                {/* Overall comments */}
                <div className="border-t border-white/5 px-4 sm:px-5 md:px-6 py-5 grid sm:grid-cols-2 gap-4 sm:gap-6 bg-black/10">
                    {[left, right].map((s) => (
                        <div key={s.id}>
                            <SectionLabel>{s.submittedBy.split(" ")[0]}'s overall comment</SectionLabel>
                            {s.overallComment ? (
                                <p className="font-cormorant text-sm sm:text-base italic text-white/80 leading-relaxed whitespace-pre-wrap">
                                    "{s.overallComment}"
                                </p>
                            ) : (
                                <p className="text-[0.7rem] font-jost text-white/25 italic">No overall comment</p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const CompareCell = ({ response }: { response?: { status: ResponseStatus; comment?: string | null } }) => {
    if (!response?.status) {
        return (
            <div className="flex items-center justify-center">
                <span className="text-[0.55rem] font-jost text-white/20 uppercase tracking-[0.15em]">—</span>
            </div>
        );
    }
    const Icon = STATUS_ICON[response.status];
    const tone = COMPARE_STATUS_TONE[response.status];
    const label = STATUS_OPTIONS.find((o) => o.value === response.status)?.short ?? response.status;
    return (
        <div className="flex flex-col items-center gap-1.5">
            <span className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-[0.55rem] sm:text-[0.6rem] font-jost uppercase tracking-[0.12em] font-bold border w-full ${tone}`}>
                <Icon className="w-3 h-3" />
                {label}
            </span>
            {response.comment && (
                <p
                    title={response.comment}
                    className="text-[0.6rem] font-jost text-white/40 italic line-clamp-2 leading-snug text-center"
                >
                    "{response.comment}"
                </p>
            )}
        </div>
    );
};

export default FeedbackResults;

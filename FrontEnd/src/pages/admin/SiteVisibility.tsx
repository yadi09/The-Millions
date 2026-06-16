import { useState } from "react";
import { toast } from "sonner";
import {
    Loader2,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Home,
    Mail,
    BookOpen,
    Star,
    Send,
    LayoutGrid,
    Info,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import {
    useGetAdminVisibilityQuery,
    useSetPageVisibilityMutation,
    useSetSectionVisibilityMutation,
} from "../../features/api/apiSlice";

// Public-route catalogue. Order matters — this is the order they appear
// in the admin list. Map page key → display info + the DB page slug that
// holds its sections (if any).
const PAGE_CATALOGUE: {
    key: string;
    label: string;
    path: string;
    desc: string;
    icon: any;
    /** DB Page slug whose sections are togglable here. Undefined = no sections. */
    dbSlug?: string;
}[] = [
        { key: "home", label: "Home", path: "/", desc: "Landing page", icon: Home, dbSlug: "home" },
        { key: "blog", label: "Blog", path: "/blog", desc: "Blog index page", icon: BookOpen },
        { key: "testimonials", label: "Testimonials", path: "/testimonials", desc: "Client testimonials page", icon: Star },
        { key: "contact", label: "Contact", path: "/contact", desc: "Contact form page", icon: Mail },
        { key: "submit-testimonial", label: "Submit Testimonial", path: "/submit-testimonial", desc: "Public testimonial submission form", icon: Send },
    ];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3 font-medium">
        {children}
    </p>
);

// Pretty-print a section type for the UI. "mission-vision" → "Mission Vision"
function formatSectionType(t: string): string {
    return t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const ToggleSwitch = ({
    on,
    onChange,
    disabled,
    size = "md",
}: {
    on: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md";
}) => {
    const w = size === "sm" ? "w-9" : "w-11";
    const h = size === "sm" ? "h-5" : "h-6";
    const thumb = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
    const translate = size === "sm" ? "translate-x-4" : "translate-x-5";
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!on)}
            className={`relative ${w} ${h} rounded-full transition-colors shrink-0 ${
                on ? "bg-millions-accent" : "bg-white/10"
            } ${disabled ? "opacity-50 cursor-wait" : "cursor-pointer hover:opacity-90"}`}
            aria-label={on ? "Hide" : "Show"}
        >
            <span
                className={`absolute top-0.5 left-0.5 ${thumb} bg-white rounded-full transition-transform shadow ${
                    on ? translate : "translate-x-0"
                }`}
            />
        </button>
    );
};

const SiteVisibility = () => {
    const { data, isLoading } = useGetAdminVisibilityQuery();
    const [setPageVis, { isLoading: pageBusy }] = useSetPageVisibilityMutation();
    const [setSectionVis, { isLoading: sectionBusy }] = useSetSectionVisibilityMutation();
    // Track which page rows have their sections expanded
    const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});

    const handlePageToggle = async (key: string, next: boolean) => {
        try {
            await setPageVis({ key, visible: next }).unwrap();
            toast.success(`${key === "submit-testimonial" ? "Submit Testimonial" : key.charAt(0).toUpperCase() + key.slice(1)} page is now ${next ? "live" : "hidden"}.`);
        } catch (e: any) {
            toast.error(e?.data?.message || "Failed to update page visibility.");
        }
    };

    const handleSectionToggle = async (id: string, next: boolean, label: string) => {
        try {
            await setSectionVis({ id, visible: next }).unwrap();
            toast.success(`Section "${label}" is now ${next ? "live" : "hidden"}.`);
        } catch (e: any) {
            toast.error(e?.data?.message || "Failed to update section visibility.");
        }
    };

    const previewLink = (path: string) => `${path}${path.includes("?") ? "&" : "?"}preview=1`;

    return (
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Site <em className="italic text-millions-accent">Visibility</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    Turn pages and sections on or off
                </div>
                <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed max-w-2xl">
                    Hidden pages show a "coming soon" screen to visitors. Hidden sections are skipped entirely.
                    Append <span className="text-millions-accent">?preview=1</span> to any URL while logged in to see hidden content yourself before flipping it live.
                </p>
            </div>

            {/* Preview tip card */}
            <Card className="bg-millions-accent/5 border-millions-accent/20 rounded-none">
                <CardContent className="p-4 sm:p-5 flex items-start gap-3">
                    <Info className="w-4 h-4 text-millions-accent shrink-0 mt-0.5" />
                    <div className="text-[0.75rem] sm:text-[0.8rem] font-jost text-white/70 leading-relaxed">
                        <strong className="text-millions-accent font-medium">Preview tip:</strong> hidden content stays editable.
                        Click the eye icon on any page to open it with the preview flag attached — you'll see everything as if it were live.
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <Card className="bg-white/5 border-white/5 rounded-none">
                    <CardContent className="p-12 text-center">
                        <Loader2 className="w-6 h-6 text-millions-accent animate-spin mx-auto mb-3" />
                        <p className="text-[0.7rem] font-jost text-white/30 uppercase tracking-[0.25em]">Loading visibility settings…</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-white/5 border-white/5 rounded-none">
                    <CardContent className="p-0">
                        <ul className="divide-y divide-white/5">
                            {PAGE_CATALOGUE.map((p) => {
                                const isPageOn = data?.pages?.[p.key] !== false;
                                const sectionsBlock = p.dbSlug ? data?.sectionsByPageSlug?.[p.dbSlug] : undefined;
                                const sectionCount = sectionsBlock?.sections?.length ?? 0;
                                const hiddenSectionCount = sectionsBlock?.sections?.filter((s) => !s.visible).length ?? 0;
                                const isExpanded = !!expandedPages[p.key];
                                const Icon = p.icon;
                                return (
                                    <li key={p.key} className="">
                                        {/* Page row */}
                                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 md:p-6">
                                            <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 border ${isPageOn ? "bg-millions-accent/10 border-millions-accent/30" : "bg-white/[0.02] border-white/5"}`}>
                                                <Icon className={`w-4 h-4 ${isPageOn ? "text-millions-accent" : "text-white/30"}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-cormorant text-lg sm:text-xl text-white font-light italic leading-tight">{p.label}</h3>
                                                    {!isPageOn && (
                                                        <span className="text-[0.5rem] font-jost text-amber-300 uppercase tracking-[0.2em] font-bold bg-amber-500/10 border border-amber-400/20 px-1.5 py-0.5">
                                                            Hidden
                                                        </span>
                                                    )}
                                                    {hiddenSectionCount > 0 && isPageOn && (
                                                        <span className="text-[0.5rem] font-jost text-white/40 uppercase tracking-[0.2em] font-medium bg-white/5 border border-white/5 px-1.5 py-0.5">
                                                            {hiddenSectionCount} section{hiddenSectionCount > 1 ? "s" : ""} hidden
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[0.65rem] sm:text-[0.7rem] font-jost text-white/40 mt-1">
                                                    {p.path} · {p.desc}
                                                </p>
                                            </div>
                                            <a
                                                href={previewLink(p.path)}
                                                target="_blank"
                                                rel="noreferrer"
                                                title={`Preview ${p.label} (opens in new tab with ?preview=1)`}
                                                className="text-white/30 hover:text-millions-accent transition-colors p-2"
                                                aria-label={`Preview ${p.label}`}
                                            >
                                                {isPageOn ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </a>
                                            <ToggleSwitch
                                                on={isPageOn}
                                                disabled={pageBusy}
                                                onChange={(v) => handlePageToggle(p.key, v)}
                                            />
                                            {sectionCount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedPages((s) => ({ ...s, [p.key]: !s[p.key] }))}
                                                    className="text-white/40 hover:text-white transition-colors p-1"
                                                    title={isExpanded ? "Collapse sections" : "Expand sections"}
                                                    aria-label={isExpanded ? "Collapse sections" : "Expand sections"}
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                        {/* Sections sublist (only for pages backed by DB sections) */}
                                        {isExpanded && sectionsBlock && (
                                            <div className="bg-black/20 border-t border-white/5">
                                                <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                                                    <SectionLabel>{p.label} sections · {sectionsBlock.sections.length} total</SectionLabel>
                                                    <ul className="space-y-2">
                                                        {sectionsBlock.sections.map((s) => {
                                                            const label = formatSectionType(s.type);
                                                            return (
                                                                <li key={s.id} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5">
                                                                    <LayoutGrid className={`w-3.5 h-3.5 shrink-0 ${s.visible ? "text-millions-accent/70" : "text-white/20"}`} />
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className={`text-[0.75rem] font-jost capitalize ${s.visible ? "text-white" : "text-white/40"}`}>
                                                                            {label}
                                                                        </span>
                                                                        <span className="text-[0.55rem] font-jost text-white/25 uppercase tracking-[0.2em] ml-2">
                                                                            #{s.order + 1}
                                                                        </span>
                                                                        {!s.visible && (
                                                                            <span className="text-[0.5rem] font-jost text-amber-300 uppercase tracking-[0.2em] font-bold ml-2 bg-amber-500/10 border border-amber-400/20 px-1.5 py-0.5">
                                                                                Hidden
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <ToggleSwitch
                                                                        size="sm"
                                                                        on={s.visible}
                                                                        disabled={sectionBusy}
                                                                        onChange={(v) => handleSectionToggle(s.id, v, label)}
                                                                    />
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SiteVisibility;

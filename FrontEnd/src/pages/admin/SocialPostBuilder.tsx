import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    Loader2,
    Download,
    Save,
    Trash2,
    Plus,
    Image as ImageIcon,
    Sparkles,
    FileText,
    Quote,
    BarChart3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
    useGetMySocialPostsQuery,
    useUpsertSocialPostMutation,
    useDeleteSocialPostMutation,
    useUploadImageMutation,
} from "../../features/api/apiSlice";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import {
    renderSocialPost,
    exportSocialPostPng,
    defaultContent,
    PLATFORM_DIMENSIONS,
    type TemplateType,
    type Platform,
    type Content,
    type TipListContent,
    type QuoteContent,
    type StatContent,
} from "../../utils/socialPost";

type Form = {
    id?: string;
    templateType: TemplateType;
    platform: Platform;
    content: Content;
    imageUrl?: string | null;
    title?: string | null;
};

const TEMPLATE_OPTIONS: { value: TemplateType; label: string; desc: string; icon: any }[] = [
    { value: "tip-list", label: "Tip List", desc: "Numbered tips — the workhorse for educational content", icon: FileText },
    { value: "quote", label: "Quote", desc: "One bold statement — punchy breaks between posts", icon: Quote },
    { value: "stat", label: "Stat", desc: "Big number + caption — deadline countdowns + insights", icon: BarChart3 },
];

const PLATFORM_OPTIONS: { value: Platform; label: string; aspect: string }[] = [
    { value: "linkedin", label: "LinkedIn", aspect: "1200×627" },
    { value: "square", label: "Square", aspect: "1080×1080" },
    { value: "story", label: "Story", aspect: "1080×1920" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3 font-medium">
        {children}
    </p>
);

const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-white/5 border border-white/10 text-white font-jost text-sm tracking-wide focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none h-11 px-3 sm:px-4 transition-all placeholder:text-white/15 ${props.className || ""}`}
    />
);

const DarkTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className={`w-full bg-white/5 border border-white/10 text-white font-jost text-sm tracking-wide focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none p-3 sm:p-4 transition-all placeholder:text-white/15 resize-y ${props.className || ""}`}
    />
);

const initialForm = (): Form => ({
    templateType: "tip-list",
    platform: "linkedin",
    content: defaultContent("tip-list"),
    imageUrl: null,
    title: null,
});

const SocialPostBuilder = () => {
    const { data: posts = [], isLoading: loadingPosts } = useGetMySocialPostsQuery();
    const [upsert, { isLoading: saving }] = useUpsertSocialPostMutation();
    const [deletePost] = useDeleteSocialPostMutation();
    const [uploadImage, { isLoading: uploadingImage }] = useUploadImageMutation();

    const [form, setForm] = useState<Form>(initialForm());
    const [exporting, setExporting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const previewRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redraw preview on every form change. Preview width is fixed; height
    // derives from the platform's native aspect ratio.
    useEffect(() => {
        let cancelled = false;
        const draw = async () => {
            if (!previewRef.current) return;
            try {
                await renderSocialPost(previewRef.current, form, 720);
                if (cancelled) return;
            } catch (e) {
                console.error("Preview render failed", e);
            }
        };
        draw();
        return () => {
            cancelled = true;
        };
    }, [form]);

    const handleTemplateChange = (t: TemplateType) => {
        if (t === form.templateType) return;
        // Reset content to that template's defaults so the form fields make sense
        setForm((f) => ({ ...f, templateType: t, content: defaultContent(t) }));
    };

    const handleNewDraft = () => setForm(initialForm());

    const handleLoadDraft = (post: any) => {
        setForm({
            id: post.id,
            templateType: post.templateType as TemplateType,
            platform: post.platform as Platform,
            content: post.content as Content,
            imageUrl: post.imageUrl,
            title: post.title,
        });
        toast.success(`Loaded "${post.title || post.templateType}"`);
    };

    const handleSave = async () => {
        try {
            const saved = await upsert({
                id: form.id,
                templateType: form.templateType,
                platform: form.platform,
                content: form.content,
                imageUrl: form.imageUrl,
                title: form.title || generateTitle(form.content, form.templateType),
            }).unwrap();
            setForm((f) => ({ ...f, id: saved.id, title: saved.title }));
            toast.success("Draft saved.");
        } catch (e: any) {
            toast.error(e?.data?.message || "Save failed.");
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportSocialPostPng(form);
            toast.success(`PNG exported (${PLATFORM_DIMENSIONS[form.platform].aspect}).`);
        } catch (e) {
            console.error(e);
            toast.error("Export failed.");
        } finally {
            setExporting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id).unwrap();
            toast.success("Draft deleted.");
            if (form.id === id) setForm(initialForm());
        } catch (e: any) {
            toast.error(e?.data?.message || "Delete failed.");
        }
    };

    const handleImageUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("image", file);
        try {
            const res = await uploadImage(fd).unwrap();
            setForm((f) => ({ ...f, imageUrl: res.url }));
            toast.success("Background image set.");
        } catch (e: any) {
            toast.error(e?.data?.message || "Image upload failed.");
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Social <em className="italic text-millions-accent">Posts</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    Branded graphics for LinkedIn · Instagram · Stories
                </div>
                <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed max-w-2xl">
                    Three templates, three platform sizes. Fill in your content, export a PNG, post.
                    Drafts save to your library so you can reuse a series (Tax Tip 1, 2, 3...).
                </p>
            </div>

            {/* Two-column layout: builder + library */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 sm:gap-8">
                {/* Builder column */}
                <div className="space-y-6">
                    {/* Template + platform selectors */}
                    <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none">
                        <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
                            <div>
                                <SectionLabel>Template</SectionLabel>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {TEMPLATE_OPTIONS.map((t) => {
                                        const Icon = t.icon;
                                        const active = form.templateType === t.value;
                                        return (
                                            <button
                                                key={t.value}
                                                onClick={() => handleTemplateChange(t.value)}
                                                title={t.desc}
                                                className={`p-3 sm:p-4 text-left transition-all border ${
                                                    active
                                                        ? "bg-millions-accent text-millions-dark border-millions-accent"
                                                        : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white"
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 mb-2 ${active ? "text-millions-dark" : "text-millions-accent/70"}`} />
                                                <div className={`text-[0.7rem] font-jost uppercase tracking-[0.18em] font-bold ${active ? "" : ""}`}>{t.label}</div>
                                                <div className={`text-[0.55rem] mt-1 leading-tight ${active ? "text-millions-dark/70" : "text-white/30"}`}>{t.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <SectionLabel>Platform / Size</SectionLabel>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORM_OPTIONS.map((p) => {
                                        const active = form.platform === p.value;
                                        return (
                                            <button
                                                key={p.value}
                                                onClick={() => setForm((f) => ({ ...f, platform: p.value }))}
                                                className={`px-3 sm:px-4 py-2.5 text-[0.65rem] font-jost uppercase tracking-[0.18em] transition-all border ${
                                                    active
                                                        ? "bg-millions-accent text-millions-dark border-millions-accent font-bold"
                                                        : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white"
                                                }`}
                                            >
                                                {p.label}
                                                <span className={`ml-1.5 text-[0.5rem] ${active ? "text-millions-dark/60" : "text-white/25"}`}>{p.aspect}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none">
                        <CardContent className="p-5 sm:p-6 md:p-8">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <SectionLabel>Live preview</SectionLabel>
                                <span className="text-[0.55rem] font-jost text-white/30 uppercase tracking-[0.2em]">
                                    {PLATFORM_DIMENSIONS[form.platform].label} · {PLATFORM_DIMENSIONS[form.platform].aspect}
                                </span>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-3 sm:p-4 md:p-6 flex items-center justify-center">
                                <canvas
                                    ref={previewRef}
                                    className="max-w-full max-h-[600px] w-auto h-auto block shadow-2xl"
                                    style={{ imageRendering: "auto" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form */}
                    <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none">
                        <CardContent className="p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                <Sparkles className="w-4 h-4 text-millions-accent" />
                                <h2 className="font-cormorant text-xl text-white font-light italic leading-none">Content</h2>
                            </div>

                            {/* Per-template fields */}
                            {form.templateType === "tip-list" && (
                                <TipListForm
                                    content={form.content as TipListContent}
                                    onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                                />
                            )}
                            {form.templateType === "quote" && (
                                <QuoteForm
                                    content={form.content as QuoteContent}
                                    onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                                />
                            )}
                            {form.templateType === "stat" && (
                                <StatForm
                                    content={form.content as StatContent}
                                    onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                                />
                            )}

                            {/* Background image */}
                            <div className="pt-4 border-t border-white/5">
                                <SectionLabel>Background image (optional)</SectionLabel>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="inline-flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 text-white/60 hover:border-millions-accent/30 hover:text-white text-[0.65rem] uppercase tracking-[0.18em] font-jost transition-all"
                                    >
                                        {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                                        {form.imageUrl ? "Replace image" : "Upload image"}
                                    </button>
                                    {form.imageUrl && (
                                        <button
                                            onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
                                            className="inline-flex items-center gap-2 h-10 px-3 text-white/40 hover:text-red-300 text-[0.65rem] uppercase tracking-[0.18em] font-jost transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Remove
                                        </button>
                                    )}
                                    {form.imageUrl && (
                                        <span className="text-[0.6rem] font-jost text-white/30 truncate max-w-[200px]">image set</span>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleImageUpload(f);
                                        e.target.value = "";
                                    }}
                                />
                                <p className="text-[0.55rem] font-jost text-white/25 mt-2 leading-relaxed">
                                    A 75% dark overlay is applied automatically so the white text stays readable.
                                </p>
                            </div>

                            {/* Draft title */}
                            <div>
                                <SectionLabel>Draft title (for your library)</SectionLabel>
                                <DarkInput
                                    value={form.title ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder={generateTitle(form.content, form.templateType)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 h-11 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {form.id ? "Save Changes" : "Save Draft"}
                                </Button>
                                <Button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    variant="outline"
                                    className="flex-1 h-11 rounded-none bg-transparent border-millions-accent/40 text-millions-accent hover:bg-millions-accent/10 tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    Export PNG
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Library column */}
                <div className="space-y-4">
                    <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none xl:sticky xl:top-6">
                        <CardContent className="p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <SectionLabel>Library</SectionLabel>
                                <button
                                    onClick={handleNewDraft}
                                    className="inline-flex items-center gap-1.5 text-millions-accent hover:text-white text-[0.55rem] uppercase tracking-[0.2em] font-jost transition-colors"
                                    title="Start a new draft"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    New
                                </button>
                            </div>
                            {loadingPosts ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-5 h-5 text-millions-accent animate-spin mx-auto" />
                                </div>
                            ) : posts.length === 0 ? (
                                <p className="text-[0.7rem] font-jost text-white/30 italic text-center py-8">
                                    No drafts yet. Save your first post to start a library.
                                </p>
                            ) : (
                                <ul className="space-y-2 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                                    {posts.map((p: any) => {
                                        const isActive = form.id === p.id;
                                        return (
                                            <li
                                                key={p.id}
                                                className={`group flex items-start gap-2 p-3 border transition-all cursor-pointer ${
                                                    isActive
                                                        ? "bg-millions-accent/10 border-millions-accent/40"
                                                        : "bg-white/[0.02] border-white/5 hover:border-millions-accent/30 active:bg-white/[0.06]"
                                                }`}
                                                onClick={() => handleLoadDraft(p)}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[0.7rem] font-jost text-white truncate">
                                                        {p.title || generateTitle(p.content, p.templateType)}
                                                    </p>
                                                    <p className="text-[0.55rem] font-jost text-white/30 uppercase tracking-[0.15em] mt-0.5">
                                                        {p.templateType} · {p.platform}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletingId(p.id);
                                                    }}
                                                    className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                                    title="Delete draft"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmModal
                isOpen={deletingId !== null}
                onClose={() => setDeletingId(null)}
                onConfirm={async () => {
                    if (deletingId) await handleDelete(deletingId);
                }}
                title="Delete draft?"
                message="This will permanently delete this saved post. This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};

// Per-template content sub-forms ---------------------------------------------

const TipListForm = ({ content, onChange }: { content: TipListContent; onChange: (c: TipListContent) => void }) => {
    const updateItem = (i: number, v: string) => {
        const items = [...content.items];
        items[i] = v;
        onChange({ ...content, items });
    };
    const addItem = () => {
        if (content.items.length >= 5) return;
        onChange({ ...content, items: [...content.items, ""] });
    };
    const removeItem = (i: number) => {
        onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) });
    };

    return (
        <div className="space-y-5">
            <div>
                <SectionLabel>Headline</SectionLabel>
                <DarkInput
                    value={content.headline}
                    onChange={(e) => onChange({ ...content, headline: e.target.value })}
                    placeholder="3 Ways to Cut Your Tax Bill"
                    maxLength={120}
                />
            </div>
            <div>
                <SectionLabel>Tips (up to 5)</SectionLabel>
                <div className="space-y-2">
                    {content.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className="text-millions-accent font-cormorant text-lg font-semibold mt-2 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <DarkTextarea
                                value={item}
                                onChange={(e) => updateItem(i, e.target.value)}
                                placeholder={`Tip ${i + 1}`}
                                rows={2}
                                maxLength={280}
                            />
                            <button
                                onClick={() => removeItem(i)}
                                className="text-white/20 hover:text-red-400 mt-3 shrink-0"
                                title="Remove tip"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {content.items.length < 5 && (
                        <button
                            onClick={addItem}
                            className="inline-flex items-center gap-2 h-9 px-3 mt-1 border border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 text-[0.6rem] uppercase tracking-[0.18em] font-jost transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add tip
                        </button>
                    )}
                </div>
            </div>
            <div>
                <SectionLabel>Call to action (footer)</SectionLabel>
                <DarkInput
                    value={content.cta}
                    onChange={(e) => onChange({ ...content, cta: e.target.value })}
                    placeholder="the-millions.co.uk"
                    maxLength={80}
                />
            </div>
        </div>
    );
};

const QuoteForm = ({ content, onChange }: { content: QuoteContent; onChange: (c: QuoteContent) => void }) => (
    <div className="space-y-5">
        <div>
            <SectionLabel>Quote</SectionLabel>
            <DarkTextarea
                value={content.quote}
                onChange={(e) => onChange({ ...content, quote: e.target.value })}
                placeholder="Most directors overpay on dividends by £2,000 every year."
                rows={3}
                maxLength={280}
            />
        </div>
        <div>
            <SectionLabel>Attribution (optional)</SectionLabel>
            <DarkInput
                value={content.attribution}
                onChange={(e) => onChange({ ...content, attribution: e.target.value })}
                placeholder="Mark Million, Senior Partner"
                maxLength={120}
            />
        </div>
    </div>
);

const StatForm = ({ content, onChange }: { content: StatContent; onChange: (c: StatContent) => void }) => (
    <div className="space-y-5">
        <div>
            <SectionLabel>The number (large)</SectionLabel>
            <DarkInput
                value={content.number}
                onChange={(e) => onChange({ ...content, number: e.target.value })}
                placeholder="£12,570"
                maxLength={40}
            />
        </div>
        <div>
            <SectionLabel>Label</SectionLabel>
            <DarkInput
                value={content.label}
                onChange={(e) => onChange({ ...content, label: e.target.value })}
                placeholder="The personal allowance most clients forget"
                maxLength={140}
            />
        </div>
        <div>
            <SectionLabel>Sub-label (optional)</SectionLabel>
            <DarkTextarea
                value={content.sublabel}
                onChange={(e) => onChange({ ...content, sublabel: e.target.value })}
                placeholder="Use it or lose it before 5th April."
                rows={2}
                maxLength={280}
            />
        </div>
    </div>
);

// Helper — derive a sensible title when the user hasn't set one
function generateTitle(content: Content, type: TemplateType): string {
    if (type === "tip-list") {
        const c = content as TipListContent;
        return c.headline || "Untitled tip list";
    }
    if (type === "quote") {
        const c = content as QuoteContent;
        return c.quote ? c.quote.slice(0, 60) + (c.quote.length > 60 ? "…" : "") : "Untitled quote";
    }
    const c = content as StatContent;
    return c.number ? `${c.number} — ${c.label.slice(0, 40)}` : "Untitled stat";
}

export default SocialPostBuilder;

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    CreditCard,
    Download,
    FileDown,
    Loader2,
    Save,
    QrCode,
    AlertTriangle,
    Info,
    RotateCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
    useGetMyBusinessCardQuery,
    useUpsertMyBusinessCardMutation,
    useGetFooterQuery,
} from "../../features/api/apiSlice";
import {
    renderCardSide,
    exportCardPdf,
    downloadVcardFile,
    checkCard,
    type Template,
    type BusinessCardData,
} from "../../utils/businessCard";

type Form = BusinessCardData & {
    template: Template;
    showQrCode: boolean;
};

const EMPTY: Form = {
    name: "",
    title: "",
    tagline: "",
    email: "",
    phoneMobile: "",
    phoneOffice: "",
    website: "",
    address: ["", "", ""],
    template: "minimal",
    showQrCode: true,
};

const TEMPLATES: { value: Template; label: string; desc: string }[] = [
    { value: "minimal", label: "Minimal", desc: "Cream + gold, centered name" },
    { value: "luxe", label: "Luxe", desc: "Gold band, vertical wordmark" },
    { value: "modern", label: "Modern", desc: "Big name, gold rule, contact split" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2 block font-medium">{children}</label>
);

const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-white/5 border border-white/10 text-white font-jost text-sm tracking-wide focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 rounded-none h-11 px-3 sm:px-4 transition-all placeholder:text-white/15 ${props.className || ""}`}
    />
);

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <SectionLabel>{label}</SectionLabel>
        {children}
    </div>
);

const BusinessCardBuilder = () => {
    const { data: existing, isLoading: loadingCard } = useGetMyBusinessCardQuery();
    const { data: footer } = useGetFooterQuery();
    const [upsert, { isLoading: saving }] = useUpsertMyBusinessCardMutation();

    const [form, setForm] = useState<Form>(EMPTY);
    const [side, setSide] = useState<"front" | "back">("front");
    const [exporting, setExporting] = useState(false);

    const frontPreviewRef = useRef<HTMLCanvasElement>(null);
    const backPreviewRef = useRef<HTMLCanvasElement>(null);

    // Hydrate from server when first available. Fall back to footer defaults
    // (org email, phone, address) when no card has been built yet.
    useEffect(() => {
        if (loadingCard) return;
        if (existing) {
            setForm({
                name: existing.name ?? "",
                title: existing.title ?? "",
                tagline: existing.tagline ?? "",
                email: existing.email ?? "",
                phoneMobile: existing.phoneMobile ?? "",
                phoneOffice: existing.phoneOffice ?? "",
                website: existing.website ?? "",
                address: existing.address && existing.address.length ? existing.address : ["", "", ""],
                template: (existing.template as Template) ?? "minimal",
                showQrCode: existing.showQrCode ?? true,
            });
        } else if (footer) {
            // Prefill from footer record so the first edit isn't an empty form
            setForm((prev) => ({
                ...prev,
                email: prev.email || footer.email || "",
                phoneOffice: prev.phoneOffice || (Array.isArray(footer.phone) ? footer.phone[0] : "") || "",
                website: prev.website || footer.websiteUrl || "",
                address: prev.address?.some((a) => a)
                    ? prev.address
                    : ((Array.isArray(footer.address) && footer.address.length ? footer.address : ["", "", ""]) as string[]),
            }));
        }
    }, [existing, footer, loadingCard]);

    // Redraw previews on any form change
    useEffect(() => {
        let cancelled = false;
        const draw = async () => {
            if (!frontPreviewRef.current || !backPreviewRef.current) return;
            const cleaned = {
                ...form,
                address: (form.address ?? []).filter((a) => a && a.trim()),
            };
            // Preview at ~3x scaled card (no bleed for screen) — keeps aspect ratio
            const W = 510;
            const H = 330;
            try {
                await renderCardSide(frontPreviewRef.current, cleaned, "front", form.template, { width: W, height: H, withBleed: false });
                if (cancelled) return;
                await renderCardSide(backPreviewRef.current, cleaned, "back", form.template, { width: W, height: H, withBleed: false });
            } catch (e) {
                console.error("Preview render failed", e);
            }
        };
        draw();
        return () => {
            cancelled = true;
        };
    }, [form]);

    const handleField = <K extends keyof Form>(key: K, value: Form[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleAddress = (i: number, value: string) => {
        setForm((f) => {
            const next = [...(f.address ?? [])];
            while (next.length <= i) next.push("");
            next[i] = value;
            return { ...f, address: next };
        });
    };

    const handleSave = async () => {
        const warns = checkCard(form);
        const err = warns.find((w) => w.severity === "error");
        if (err) {
            toast.error(err.message);
            return;
        }
        try {
            await upsert({
                ...form,
                address: (form.address ?? []).filter((a) => a && a.trim()),
            }).unwrap();
            toast.success("Card saved.");
        } catch (e: any) {
            toast.error(e?.data?.message || "Save failed.");
        }
    };

    const handleExportPdf = async () => {
        const warns = checkCard(form);
        const err = warns.find((w) => w.severity === "error");
        if (err) {
            toast.error(err.message);
            return;
        }
        setExporting(true);
        try {
            const cleaned = {
                ...form,
                address: (form.address ?? []).filter((a) => a && a.trim()),
            };
            await exportCardPdf(cleaned, form.template);
            toast.success("Print-ready PDF exported (91×61mm with 3mm bleed).");
        } catch (e) {
            console.error(e);
            toast.error("PDF export failed.");
        } finally {
            setExporting(false);
        }
    };

    const handleExportVcard = () => {
        if (!form.name.trim()) {
            toast.error("Name is required to generate a vCard.");
            return;
        }
        downloadVcardFile({
            ...form,
            address: (form.address ?? []).filter((a) => a && a.trim()),
        });
    };

    const warnings = checkCard(form);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Business <em className="italic text-millions-accent">Card</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    Edit · Save · Export
                </div>
                <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed max-w-xl">
                    Edit your details, pick a template, and export a print-ready PDF (85×55mm card with 3mm bleed).
                    The back includes a QR code that adds you to a phone's contacts when scanned.
                </p>
            </div>

            {/* PREVIEW + ACTIONS ---------------------------------------- */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                                <CreditCard className="w-4 h-4 text-millions-accent" />
                            </div>
                            <div>
                                <h2 className="font-cormorant text-xl text-white font-light italic leading-none">Preview</h2>
                                <p className="text-[0.55rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1">85 × 55 mm · screen scale</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
                                variant="ghost"
                                className="h-9 px-3 rounded-none text-white/50 hover:text-white text-[0.6rem] uppercase tracking-[0.2em] font-jost"
                            >
                                <RotateCw className="w-3.5 h-3.5 mr-2" /> Flip
                            </Button>
                        </div>
                    </div>

                    {/* Both previews live in the DOM but only one is shown so we
                        avoid re-rendering on flip. Layout is single-stack on
                        mobile, side-by-side on lg+. */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <PreviewTile label="Front" visible={side === "front"} canvasRef={frontPreviewRef} />
                        <PreviewTile label="Back" visible={side === "back"} canvasRef={backPreviewRef} />
                    </div>

                    {/* Templates */}
                    <div>
                        <SectionLabel>Template</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATES.map((t) => {
                                const active = form.template === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        onClick={() => handleField("template", t.value)}
                                        title={t.desc}
                                        className={`px-3 sm:px-4 py-2.5 text-[0.65rem] font-jost uppercase tracking-[0.18em] transition-all border text-left ${active ? "bg-millions-accent text-millions-dark border-millions-accent font-bold" : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white"}`}
                                    >
                                        <div>{t.label}</div>
                                        <div className={`mt-0.5 text-[0.5rem] ${active ? "text-millions-dark/70" : "text-white/25"} normal-case tracking-normal font-normal`}>{t.desc}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* QR toggle */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.showQrCode}
                            onChange={(e) => handleField("showQrCode", e.target.checked)}
                            className="accent-millions-accent w-4 h-4"
                        />
                        <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-millions-accent/60" />
                            <span className="text-[0.7rem] font-jost text-white/70 uppercase tracking-[0.2em]">Include scannable contact (vCard QR)</span>
                        </div>
                    </label>

                    {/* Pre-flight warnings */}
                    {warnings.length > 0 && (
                        <div className="bg-amber-500/5 border border-amber-500/20 p-3 sm:p-4 space-y-2">
                            <div className="flex items-center gap-2 text-amber-300/80 text-[0.6rem] font-jost uppercase tracking-[0.2em] font-bold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Pre-flight checks
                            </div>
                            <ul className="space-y-1">
                                {warnings.map((w, i) => (
                                    <li key={i} className={`text-[0.7rem] font-jost ${w.severity === "error" ? "text-red-300" : "text-amber-200/70"}`}>
                                        · {w.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 h-11 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                        >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                        <Button
                            onClick={handleExportPdf}
                            disabled={exporting}
                            variant="outline"
                            className="flex-1 h-11 rounded-none bg-transparent border-millions-accent/40 text-millions-accent hover:bg-millions-accent/10 tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                        >
                            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                            Print PDF
                        </Button>
                        <Button
                            onClick={handleExportVcard}
                            variant="outline"
                            className="flex-1 h-11 rounded-none bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            vCard
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* FORM ----------------------------------------------------- */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <div className="w-9 h-9 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                            <Info className="w-4 h-4 text-millions-accent" />
                        </div>
                        <div>
                            <h2 className="font-cormorant text-xl text-white font-light italic leading-none">Details</h2>
                            <p className="text-[0.55rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1">
                                {existing ? "Update your card" : "Defaults pulled from org footer — edit what's personal"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <FieldGroup label="Full Name *">
                            <DarkInput value={form.name} onChange={(e) => handleField("name", e.target.value)} placeholder="e.g. Mark Million" />
                        </FieldGroup>
                        <FieldGroup label="Title">
                            <DarkInput value={form.title ?? ""} onChange={(e) => handleField("title", e.target.value)} placeholder="Senior Partner" />
                        </FieldGroup>
                    </div>

                    <FieldGroup label="Tagline (back-of-card; optional)">
                        <DarkInput value={form.tagline ?? ""} onChange={(e) => handleField("tagline", e.target.value)} placeholder="Chartered Accountants" maxLength={80} />
                    </FieldGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <FieldGroup label="Mobile">
                            <DarkInput type="tel" value={form.phoneMobile ?? ""} onChange={(e) => handleField("phoneMobile", e.target.value)} placeholder="+44 7700 900000" />
                        </FieldGroup>
                        <FieldGroup label="Office">
                            <DarkInput type="tel" value={form.phoneOffice ?? ""} onChange={(e) => handleField("phoneOffice", e.target.value)} placeholder="+44 20 1234 5678" />
                        </FieldGroup>
                        <FieldGroup label="Email">
                            <DarkInput type="email" value={form.email ?? ""} onChange={(e) => handleField("email", e.target.value)} placeholder="you@the-millions.co.uk" />
                        </FieldGroup>
                        <FieldGroup label="Website">
                            <DarkInput value={form.website ?? ""} onChange={(e) => handleField("website", e.target.value)} placeholder="the-millions.co.uk" />
                        </FieldGroup>
                    </div>

                    <div className="space-y-3">
                        <SectionLabel>Address (up to 3 lines)</SectionLabel>
                        {[0, 1, 2].map((i) => (
                            <DarkInput
                                key={i}
                                value={form.address?.[i] ?? ""}
                                onChange={(e) => handleAddress(i, e.target.value)}
                                placeholder={i === 0 ? "Suite / Street" : i === 1 ? "City, Postcode" : "Country (optional)"}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Print tips */}
            <Card className="bg-white/[0.02] border-white/5 rounded-none">
                <CardContent className="p-5 sm:p-6">
                    <SectionLabel>Print tips</SectionLabel>
                    <ul className="text-white/50 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed space-y-2">
                        <li><span className="text-millions-accent">PDF</span> is 91×61mm at 300 DPI — that's an 85×55mm card with 3mm bleed on every side. Print shops trim to the card size automatically based on the file dimensions; just tell MOO/Vistaprint/local "85×55mm with 3mm bleed".</li>
                        <li><span className="text-millions-accent">QR on the back</span> encodes a full vCard so scanning adds you to a phone's contacts with one tap.</li>
                        <li><span className="text-millions-accent">vCard file (.vcf)</span> is the same data as the QR — attach it to your email signature for the desktop equivalent.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

const PreviewTile = ({
    label,
    visible,
    canvasRef,
}: {
    label: string;
    visible: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => (
    <div className={`relative ${visible ? "" : "hidden lg:block lg:opacity-40"}`}>
        <div className="absolute -top-2 left-2 bg-millions-dark px-2 z-10">
            <span className="text-[0.5rem] font-jost text-millions-accent/60 uppercase tracking-[0.3em]">{label}</span>
        </div>
        <div
            className="border border-white/10 overflow-hidden shadow-2xl"
            style={{ aspectRatio: "85 / 55", background: "#0a0a0a" }}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    </div>
);

export default BusinessCardBuilder;

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, FileImage, FileCode2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";

// Brand colors mirror tailwind.config.js — keep these in lockstep if the
// palette ever changes.
const COLOR_DARK = "#0d2420";
const COLOR_GOLD = "#c9a84c";
const COLOR_WHITE = "#ffffff";

type MarkVariantKey = "primary" | "inverse" | "outlineGold" | "outlineWhite";
type WordmarkVariantKey = "gold" | "white" | "dark";

const MARK_VARIANTS: Record<MarkVariantKey, {
    label: string;
    bg: string | null;
    fg: string;
    stroke?: string;
    previewClass: string;
}> = {
    primary: { label: "Primary", bg: COLOR_DARK, fg: COLOR_GOLD, previewClass: "bg-millions-dark" },
    inverse: { label: "Inverse", bg: COLOR_GOLD, fg: COLOR_DARK, previewClass: "bg-millions-dark" },
    outlineGold: { label: "Outline Gold", bg: null, fg: COLOR_GOLD, stroke: COLOR_GOLD, previewClass: "bg-millions-dark" },
    outlineWhite: { label: "Outline White", bg: null, fg: COLOR_WHITE, stroke: COLOR_WHITE, previewClass: "bg-millions-dark" },
};

const WORDMARK_VARIANTS: Record<WordmarkVariantKey, {
    label: string;
    fg: string;
    sub: string;
    previewClass: string;
}> = {
    gold: { label: "Gold", fg: COLOR_GOLD, sub: COLOR_GOLD, previewClass: "bg-millions-dark" },
    white: { label: "White", fg: COLOR_WHITE, sub: "#a8a8a8", previewClass: "bg-millions-dark" },
    dark: { label: "Dark", fg: COLOR_DARK, sub: "#5a5a5a", previewClass: "bg-[#f5f1e8]" },
};

const SIZES = [
    { label: "512", value: 512, sub: "Web" },
    { label: "1024", value: 1024, sub: "Social" },
    { label: "2048", value: 2048, sub: "High-res" },
    { label: "4000", value: 4000, sub: "Print" },
];

// Canvas drawing -------------------------------------------------------------

function drawMark(canvas: HTMLCanvasElement, size: number, variant: MarkVariantKey) {
    const v = MARK_VARIANTS[variant];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const radius = size * 0.25;

    if (v.bg) {
        ctx.fillStyle = v.bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fill();
    } else if (v.stroke) {
        const lw = Math.max(2, size * 0.035);
        const inset = lw / 2 + size * 0.01;
        ctx.strokeStyle = v.stroke;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, radius - inset);
        ctx.stroke();
    }

    // Match the source SVG: font-size 48 inside a 64 viewBox = 0.75, with the
    // glyph offset slightly down-right for optical balance (x=52%, y=58%).
    ctx.fillStyle = v.fg;
    ctx.font = `600 ${Math.round(size * 0.75)}px "Cormorant Garamond", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", size * 0.52, size * 0.58);
}

function drawWordmark(canvas: HTMLCanvasElement, width: number, height: number, variant: WordmarkVariantKey) {
    const v = WORDMARK_VARIANTS[variant];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    // "THE" — small, light weight, heavy tracking (matches the header span)
    const theSize = Math.round(height * 0.18);
    ctx.fillStyle = v.sub;
    ctx.font = `300 ${theSize}px "Cormorant Garamond", serif`;
    // letterSpacing is the only canvas property that mirrors CSS letter-spacing.
    // Older browsers ignore it; the export still renders, just without tracking.
    (ctx as any).letterSpacing = `${Math.round(theSize * 0.25)}px`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("THE", Math.round(width * 0.04), Math.round(height * 0.32));

    // "MILLIONS." — large, semibold, no tracking
    const millionsSize = Math.round(height * 0.62);
    ctx.fillStyle = v.fg;
    ctx.font = `600 ${millionsSize}px "Cormorant Garamond", serif`;
    (ctx as any).letterSpacing = "0px";
    ctx.fillText("MILLIONS.", Math.round(width * 0.035), Math.round(height * 0.93));
}

// SVG generation -------------------------------------------------------------

function markSvg(variant: MarkVariantKey): string {
    const v = MARK_VARIANTS[variant];
    const bg = v.bg
        ? `<rect width="64" height="64" rx="16" fill="${v.bg}"/>`
        : v.stroke
            ? `<rect x="1.25" y="1.25" width="61.5" height="61.5" rx="14.75" fill="none" stroke="${v.stroke}" stroke-width="2.5"/>`
            : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  ${bg}
  <text x="52%" y="58%" font-family="Cormorant Garamond, serif" font-size="48" font-weight="600" fill="${v.fg}" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>`;
}

function wordmarkSvg(variant: WordmarkVariantKey): string {
    const v = WORDMARK_VARIANTS[variant];
    // 400×100 viewBox keeps the same 4:1 aspect ratio as the rendered canvas.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100">
  <text x="14" y="32" font-family="Cormorant Garamond, serif" font-size="18" font-weight="300" letter-spacing="4.5" fill="${v.sub}">THE</text>
  <text x="12" y="93" font-family="Cormorant Garamond, serif" font-size="62" font-weight="600" fill="${v.fg}">MILLIONS.</text>
</svg>`;
}

// Download helpers -----------------------------------------------------------

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportPng(
    kind: "mark" | "wordmark",
    variant: string,
    size: number
): Promise<void> {
    // Ensure both weights are loaded before rasterizing — Google Fonts are
    // async and a cold visit can otherwise produce a serif fallback PNG.
    await Promise.all([
        document.fonts.load('300 100px "Cormorant Garamond"'),
        document.fonts.load('600 100px "Cormorant Garamond"'),
    ]);
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    if (kind === "mark") {
        drawMark(canvas, size, variant as MarkVariantKey);
    } else {
        // Wordmark holds a 4:1 aspect (matches the header layout proportions).
        drawWordmark(canvas, size, Math.round(size / 4), variant as WordmarkVariantKey);
    }

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("Canvas export failed");
    downloadBlob(blob, `the-millions-${kind}-${variant}-${size}.png`);
}

function exportSvg(kind: "mark" | "wordmark", variant: string) {
    const svg = kind === "mark"
        ? markSvg(variant as MarkVariantKey)
        : wordmarkSvg(variant as WordmarkVariantKey);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    downloadBlob(blob, `the-millions-${kind}-${variant}.svg`);
}

// UI primitives --------------------------------------------------------------

const PillSelector = <T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string; sub?: string }[];
    value: T;
    onChange: (v: T) => void;
}) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const active = value === opt.value;
            return (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 sm:px-4 py-2 text-[0.6rem] sm:text-[0.65rem] font-jost uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border ${
                        active
                            ? "bg-millions-accent text-millions-dark border-millions-accent font-bold"
                            : "bg-white/5 text-white/50 border-white/5 hover:border-millions-accent/30 hover:text-white active:bg-white/[0.08]"
                    }`}
                >
                    {opt.label}
                    {opt.sub && <span className={`ml-1.5 text-[0.5rem] ${active ? "text-millions-dark/60" : "text-white/20"}`}>{opt.sub}</span>}
                </button>
            );
        })}
    </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-3 font-medium">{children}</p>
);

// Page -----------------------------------------------------------------------

const BrandAssets = () => {
    const [markVariant, setMarkVariant] = useState<MarkVariantKey>("primary");
    const [markSize, setMarkSize] = useState<number>(1024);
    const [wordmarkVariant, setWordmarkVariant] = useState<WordmarkVariantKey>("gold");
    const [wordmarkSize, setWordmarkSize] = useState<number>(1024);
    const [markBusy, setMarkBusy] = useState(false);
    const [wordmarkBusy, setWordmarkBusy] = useState(false);

    const markPreviewRef = useRef<HTMLCanvasElement>(null);
    const wordmarkPreviewRef = useRef<HTMLCanvasElement>(null);

    // Preview redraw on variant change. Fonts may still be loading on first
    // render, so we kick a fonts.ready before drawing.
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            await Promise.all([
                document.fonts.load('300 100px "Cormorant Garamond"'),
                document.fonts.load('600 100px "Cormorant Garamond"'),
            ]);
            if (cancelled) return;
            if (markPreviewRef.current) {
                drawMark(markPreviewRef.current, 512, markVariant);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [markVariant]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            await Promise.all([
                document.fonts.load('300 100px "Cormorant Garamond"'),
                document.fonts.load('600 100px "Cormorant Garamond"'),
            ]);
            if (cancelled) return;
            if (wordmarkPreviewRef.current) {
                drawWordmark(wordmarkPreviewRef.current, 800, 200, wordmarkVariant);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [wordmarkVariant]);

    const handleDownloadMark = async () => {
        setMarkBusy(true);
        try {
            await exportPng("mark", markVariant, markSize);
            toast.success(`Mark exported (${markSize}×${markSize} PNG).`);
        } catch (e) {
            console.error(e);
            toast.error("Export failed. Try again.");
        } finally {
            setMarkBusy(false);
        }
    };

    const handleDownloadWordmark = async () => {
        setWordmarkBusy(true);
        try {
            await exportPng("wordmark", wordmarkVariant, wordmarkSize);
            toast.success(`Wordmark exported (${wordmarkSize}×${Math.round(wordmarkSize / 4)} PNG).`);
        } catch (e) {
            console.error(e);
            toast.error("Export failed. Try again.");
        } finally {
            setWordmarkBusy(false);
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-4xl mx-auto pb-12 sm:pb-16 md:pb-20 animate-fade-in">
            <div>
                <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-tight">
                    Brand <em className="italic text-millions-accent">Assets</em>
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                    <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                    Logo & Wordmark Exports
                </div>
                <p className="mt-4 sm:mt-5 text-white/40 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed max-w-xl">
                    Export the brand mark and wordmark as transparent PNG at the size you need, or download the SVG source for vector work.
                </p>
            </div>

            {/* MARK ------------------------------------------------------- */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-white/5">
                        <div className="w-10 h-10 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                            <FileImage className="w-4 h-4 text-millions-accent" />
                        </div>
                        <div>
                            <h2 className="font-cormorant text-xl sm:text-2xl text-white font-light italic leading-none">Mark</h2>
                            <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1.5">The "M" — for avatars, favicons, watermarks</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-start">
                        {/* Preview tile */}
                        <div className={`aspect-square ${MARK_VARIANTS[markVariant].previewClass} border border-white/5 flex items-center justify-center p-8 transition-colors`}>
                            <canvas
                                ref={markPreviewRef}
                                className="max-w-full max-h-full w-auto h-auto"
                                style={{ imageRendering: "auto" }}
                            />
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <SectionLabel>Variant</SectionLabel>
                                <PillSelector
                                    options={(Object.entries(MARK_VARIANTS) as [MarkVariantKey, { label: string }][]).map(([k, v]) => ({ value: k, label: v.label }))}
                                    value={markVariant}
                                    onChange={setMarkVariant}
                                />
                            </div>
                            <div>
                                <SectionLabel>Size</SectionLabel>
                                <PillSelector
                                    options={SIZES.map((s) => ({ value: String(s.value), label: s.label, sub: s.sub }))}
                                    value={String(markSize)}
                                    onChange={(v) => setMarkSize(Number(v))}
                                />
                            </div>
                            <div className="pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleDownloadMark}
                                    disabled={markBusy}
                                    className="flex-1 h-11 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    {markBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    PNG · {markSize}px
                                </Button>
                                <Button
                                    onClick={() => exportSvg("mark", markVariant)}
                                    variant="outline"
                                    className="flex-1 h-11 rounded-none bg-transparent border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    <FileCode2 className="w-4 h-4 mr-2" />
                                    SVG
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* WORDMARK --------------------------------------------------- */}
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none animate-fade-in-up">
                <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-white/5">
                        <div className="w-10 h-10 bg-millions-accent/5 border border-millions-accent/10 flex items-center justify-center shrink-0">
                            <FileImage className="w-4 h-4 text-millions-accent" />
                        </div>
                        <div>
                            <h2 className="font-cormorant text-xl sm:text-2xl text-white font-light italic leading-none">Wordmark</h2>
                            <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-1.5">"the MILLIONS." — for headers, letterheads, social</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-start">
                        <div className={`aspect-[4/1] ${WORDMARK_VARIANTS[wordmarkVariant].previewClass} border border-white/5 flex items-center justify-center p-6 transition-colors`}>
                            <canvas
                                ref={wordmarkPreviewRef}
                                className="max-w-full max-h-full w-auto h-auto"
                                style={{ imageRendering: "auto" }}
                            />
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <SectionLabel>Variant</SectionLabel>
                                <PillSelector
                                    options={(Object.entries(WORDMARK_VARIANTS) as [WordmarkVariantKey, { label: string }][]).map(([k, v]) => ({ value: k, label: v.label }))}
                                    value={wordmarkVariant}
                                    onChange={setWordmarkVariant}
                                />
                            </div>
                            <div>
                                <SectionLabel>Width</SectionLabel>
                                <PillSelector
                                    options={SIZES.map((s) => ({ value: String(s.value), label: s.label, sub: s.sub }))}
                                    value={String(wordmarkSize)}
                                    onChange={(v) => setWordmarkSize(Number(v))}
                                />
                            </div>
                            <div className="pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleDownloadWordmark}
                                    disabled={wordmarkBusy}
                                    className="flex-1 h-11 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    {wordmarkBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    PNG · {wordmarkSize}×{Math.round(wordmarkSize / 4)}
                                </Button>
                                <Button
                                    onClick={() => exportSvg("wordmark", wordmarkVariant)}
                                    variant="outline"
                                    className="flex-1 h-11 rounded-none bg-transparent border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 tracking-[0.2em] uppercase text-[0.65rem] font-bold transition-all"
                                >
                                    <FileCode2 className="w-4 h-4 mr-2" />
                                    SVG
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage hints */}
            <Card className="bg-white/[0.02] border-white/5 rounded-none">
                <CardContent className="p-5 sm:p-6">
                    <SectionLabel>When to use what</SectionLabel>
                    <ul className="text-white/50 font-jost text-[0.75rem] sm:text-[0.8rem] leading-relaxed space-y-2">
                        <li><span className="text-millions-accent">PNG</span> — drop straight into social profiles, slide decks, Word documents.</li>
                        <li><span className="text-millions-accent">SVG</span> — best for print, billboards, embroidery; scales infinitely.</li>
                        <li><span className="text-millions-accent">Outline variants</span> — for when the logo sits on top of brand-coloured backgrounds and the filled box would clash.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default BrandAssets;
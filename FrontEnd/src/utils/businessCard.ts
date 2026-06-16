import QRCode from "qrcode";
import { jsPDF } from "jspdf";

// Data shape (matches BusinessCard model on the backend) -------------------

export type BusinessCardData = {
    name: string;
    title?: string | null;
    tagline?: string | null;
    email?: string | null;
    phoneMobile?: string | null;
    phoneOffice?: string | null;
    website?: string | null;
    address?: string[] | null;
    showQrCode?: boolean;
};

export type Template = "minimal" | "luxe" | "modern";
export type Side = "front" | "back";

// Brand colors (mirrors tailwind.config.js)
const COLOR_DARK = "#0d2420";
const COLOR_GOLD = "#c9a84c";
const COLOR_CREAM = "#f5f1e8";
const COLOR_WHITE = "#ffffff";

// vCard 3.0 ----------------------------------------------------------------

function escapeVcardField(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function generateVcard(card: BusinessCardData): string {
    const out: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
    out.push(`FN:${escapeVcardField(card.name)}`);

    // Best-effort N:Last;First;Middle split
    const parts = card.name.trim().split(/\s+/);
    if (parts.length === 1) {
        out.push(`N:${escapeVcardField(parts[0])};;;;`);
    } else {
        const last = parts[parts.length - 1];
        const first = parts.slice(0, -1).join(" ");
        out.push(`N:${escapeVcardField(last)};${escapeVcardField(first)};;;`);
    }

    if (card.title) out.push(`TITLE:${escapeVcardField(card.title)}`);
    out.push("ORG:The Millions");
    if (card.phoneMobile) out.push(`TEL;TYPE=CELL,VOICE:${card.phoneMobile}`);
    if (card.phoneOffice) out.push(`TEL;TYPE=WORK,VOICE:${card.phoneOffice}`);
    if (card.email) out.push(`EMAIL;TYPE=INTERNET,WORK:${card.email}`);
    if (card.website) out.push(`URL:${card.website}`);
    if (card.address && card.address.length) {
        const street = escapeVcardField(card.address.join(", "));
        out.push(`ADR;TYPE=WORK:;;${street};;;;`);
    }
    out.push("END:VCARD");
    return out.join("\r\n");
}

export function downloadVcardFile(card: BusinessCardData) {
    const blob = new Blob([generateVcard(card)], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.name.replace(/[^a-z0-9]+/gi, "_") || "contact"}.vcf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Pre-flight checks --------------------------------------------------------

export type CardWarning = { severity: "error" | "warning"; message: string };

export function checkCard(card: BusinessCardData): CardWarning[] {
    const warnings: CardWarning[] = [];
    if (!card.name.trim()) warnings.push({ severity: "error", message: "Name is required." });
    if (!card.phoneMobile && !card.phoneOffice) warnings.push({ severity: "warning", message: "Card has no phone number." });
    if (!card.email) warnings.push({ severity: "warning", message: "Card has no email." });
    const longLine = (card.address ?? []).find((a) => a.length > 50);
    if (longLine) warnings.push({ severity: "warning", message: "Address lines longer than 50 chars may overflow." });
    if ((card.tagline ?? "").length > 80) warnings.push({ severity: "warning", message: "Tagline is very long — may overflow the back." });
    return warnings;
}

// Rendering helpers --------------------------------------------------------

async function ensureFontsLoaded() {
    await Promise.all([
        document.fonts.load('300 100px "Cormorant Garamond"'),
        document.fonts.load('600 100px "Cormorant Garamond"'),
        document.fonts.load('400 16px "Jost"'),
        document.fonts.load('500 16px "Jost"'),
    ]);
    await document.fonts.ready;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
}

// Draws the "M" mark (rounded square + glyph). Pass a `bgColor` of null
// to draw a transparent square outline instead of a filled background.
function drawMark(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    bgColor: string | null,
    fgColor: string
) {
    const half = size / 2;
    if (bgColor) {
        ctx.fillStyle = bgColor;
        roundedRect(ctx, cx - half, cy - half, size, size, size * 0.25);
        ctx.fill();
    }
    ctx.fillStyle = fgColor;
    ctx.font = `600 ${Math.round(size * 0.75)}px "Cormorant Garamond", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", cx + size * 0.02, cy + size * 0.08);
}

// Draws the wordmark ("the MILLIONS.") left-aligned. Returns the bounding
// box height so callers can stack other elements beneath.
function drawWordmark(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    fgColor: string,
    subColor: string = fgColor
) {
    // Aspect ratio: "the MILLIONS." occupies a ~4:1 box. Treat width as the
    // horizontal budget and derive height from that.
    const height = width / 4;
    const theSize = Math.round(height * 0.18);
    ctx.fillStyle = subColor;
    ctx.font = `300 ${theSize}px "Cormorant Garamond", serif`;
    (ctx as any).letterSpacing = `${Math.round(theSize * 0.25)}px`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("THE", x + width * 0.04, y + height * 0.32);

    const mSize = Math.round(height * 0.62);
    ctx.fillStyle = fgColor;
    ctx.font = `600 ${mSize}px "Cormorant Garamond", serif`;
    (ctx as any).letterSpacing = "0px";
    ctx.fillText("MILLIONS.", x + width * 0.035, y + height * 0.93);
    return height;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function qrDataUrl(content: string, sizePx: number, dark: string, light: string): Promise<string> {
    // qrcode library expects hex strings (#RRGGBB or #RRGGBBAA) — CSS rgba()
    // syntax silently fails and throws downstream. Always pass hex.
    return QRCode.toDataURL(content, {
        margin: 0,
        width: sizePx,
        errorCorrectionLevel: "M",
        color: { dark, light },
    });
}

// Single source of truth for drawing a QR on the back of a card. Generates
// the QR with high-contrast colors (dark on light) for scan reliability,
// draws a colored pad behind it for a clean quiet-zone, and optionally
// writes a "SCAN TO ..." label below. Returns false (without throwing) on
// any failure so the rest of the card still renders.
async function drawQrPanel(
    ctx: CanvasRenderingContext2D,
    card: BusinessCardData,
    centerX: number,
    centerY: number,
    qrSize: number,
    opts: {
        padColor?: string;
        labelText?: string;
        labelColor?: string;
        labelSize?: number;
        labelTracking?: number;
    } = {}
): Promise<boolean> {
    try {
        const pad = opts.padColor ?? COLOR_CREAM;
        const dataUrl = await qrDataUrl(
            generateVcard(card),
            Math.round(qrSize * 4),
            COLOR_DARK,
            pad
        );
        const img = await loadImage(dataUrl);

        const padSize = qrSize * 1.18;
        const padX = centerX - padSize / 2;
        const padY = centerY - padSize / 2;
        ctx.fillStyle = pad;
        ctx.fillRect(padX, padY, padSize, padSize);
        ctx.drawImage(img, centerX - qrSize / 2, centerY - qrSize / 2, qrSize, qrSize);

        if (opts.labelText) {
            const lblSize = opts.labelSize ?? 14;
            drawText(ctx, opts.labelText, centerX, padY + padSize + lblSize * 1.8, {
                font: FONT_BODY,
                size: lblSize,
                weight: 500,
                color: opts.labelColor ?? COLOR_GOLD,
                align: "center",
                letterSpacing: `${opts.labelTracking ?? lblSize * 0.4}px`,
            });
        }
        return true;
    } catch (e) {
        // Swallow — print/preview should never die because the QR is finicky.
        // The card still goes out, just without the scan code.
        console.error("QR render failed; continuing without it", e);
        return false;
    }
}

// Card layout constants. Everything below uses *card-visible* coordinates;
// the bleed strip is filled by extending each template's background.

const FONT_HEADING = '"Cormorant Garamond", serif';
const FONT_BODY = '"Jost", sans-serif';

type DrawCtx = {
    ctx: CanvasRenderingContext2D;
    /** Full canvas bounds */
    cw: number;
    ch: number;
    /** Visible card bounds (canvas minus bleed strip on each side) */
    cardX: number;
    cardY: number;
    cardW: number;
    cardH: number;
    /** Safe area (card bounds minus 3mm safe inset on each side) */
    safeX: number;
    safeY: number;
    safeW: number;
    safeH: number;
};

// Helpers for drawing text with bounds. truncate at maxWidth if specified.
function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    opts: {
        font: string;
        size: number;
        weight?: number;
        color: string;
        align?: CanvasTextAlign;
        baseline?: CanvasTextBaseline;
        letterSpacing?: string;
        maxWidth?: number;
    }
) {
    ctx.fillStyle = opts.color;
    ctx.font = `${opts.weight ?? 400} ${opts.size}px ${opts.font}`;
    (ctx as any).letterSpacing = opts.letterSpacing ?? "0px";
    ctx.textAlign = opts.align ?? "left";
    ctx.textBaseline = opts.baseline ?? "alphabetic";
    if (opts.maxWidth) {
        ctx.fillText(text, x, y, opts.maxWidth);
    } else {
        ctx.fillText(text, x, y);
    }
}

function fillBackground(d: DrawCtx, color: string) {
    d.ctx.fillStyle = color;
    d.ctx.fillRect(0, 0, d.cw, d.ch);
}

// Template renderers -------------------------------------------------------

async function renderMinimalFront(d: DrawCtx, card: BusinessCardData) {
    // Letterhead-style symmetric layout: gold ruled bands top + bottom, centered
    // typography, balanced whitespace. The kind of card you'd put in a leather
    // wallet without embarrassment.
    fillBackground(d, COLOR_CREAM);

    // Top mark, small, centered
    const markSize = d.cardH * 0.13;
    drawMark(d.ctx, d.cardX + d.cardW / 2, d.safeY + markSize / 2 + d.cardH * 0.02, markSize, COLOR_DARK, COLOR_GOLD);

    // Upper gold rule — full safe-width, hair-thin
    const upperRuleY = d.safeY + markSize + d.cardH * 0.06;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.safeX, upperRuleY, d.safeW, Math.max(1, d.cardH * 0.003));

    // Name — big, dark, centered
    const nameY = upperRuleY + d.cardH * 0.13;
    drawText(d.ctx, card.name || "Your Name", d.cardX + d.cardW / 2, nameY, {
        font: FONT_HEADING, size: d.cardH * 0.17, weight: 600, color: COLOR_DARK, align: "center", baseline: "middle",
    });

    // Short gold accent under the name
    const accentY = nameY + d.cardH * 0.11;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.cardX + d.cardW / 2 - d.cardW * 0.04, accentY, d.cardW * 0.08, Math.max(1, d.cardH * 0.006));

    // Title — italic-feel small caps, gold
    if (card.title) {
        drawText(d.ctx, card.title.toUpperCase(), d.cardX + d.cardW / 2, accentY + d.cardH * 0.07, {
            font: FONT_BODY, size: d.cardH * 0.042, weight: 500, color: COLOR_GOLD, align: "center",
            letterSpacing: `${d.cardH * 0.022}px`,
        });
    }

    // Lower gold rule
    const lowerRuleY = d.cardY + d.cardH * 0.74;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.safeX, lowerRuleY, d.safeW, Math.max(1, d.cardH * 0.003));

    // Contact lines — centered, single column, tightly stacked
    const lines: string[] = [];
    if (card.phoneMobile) lines.push(card.phoneMobile);
    if (card.phoneOffice) lines.push(card.phoneOffice);
    if (card.email) lines.push(card.email);
    if (card.website) lines.push(card.website.replace(/^https?:\/\//, ""));

    const lineSize = d.cardH * 0.04;
    const lineGap = lineSize * 1.5;
    // Anchor block to vertical center of the remaining bottom strip
    const blockTop = lowerRuleY + d.cardH * 0.07;
    lines.slice(0, 4).forEach((ln, i) => {
        drawText(d.ctx, ln, d.cardX + d.cardW / 2, blockTop + i * lineGap, {
            font: FONT_BODY, size: lineSize, weight: 400, color: COLOR_DARK, align: "center",
        });
    });
}

async function renderMinimalBack(d: DrawCtx, card: BusinessCardData) {
    fillBackground(d, COLOR_DARK);

    // Wordmark — top centered, prominent
    const wmW = d.cardW * 0.5;
    drawWordmark(d.ctx, d.cardX + d.cardW / 2 - wmW / 2, d.cardY + d.cardH * 0.08, wmW, COLOR_GOLD);

    // QR centered with cream pad + scan label
    if (card.showQrCode !== false) {
        const qrSize = Math.min(d.cardH * 0.44, d.cardW * 0.28);
        await drawQrPanel(d.ctx, card, d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.6, qrSize, {
            padColor: COLOR_CREAM,
            labelText: "SCAN TO CONNECT",
            labelColor: COLOR_GOLD,
            labelSize: d.cardH * 0.032,
            labelTracking: d.cardH * 0.016,
        });
    } else if (card.tagline) {
        drawText(d.ctx, card.tagline, d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.62, {
            font: FONT_HEADING, size: d.cardH * 0.08, color: COLOR_GOLD, align: "center", baseline: "middle",
        });
    }
}

async function renderLuxeFront(d: DrawCtx, card: BusinessCardData) {
    fillBackground(d, COLOR_DARK);
    // Left gold band — extends through bleed
    const bandWidth = d.cardW * 0.32;
    const bandX = d.cardX;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(0, 0, bandX + bandWidth, d.ch); // extend to canvas left edge for bleed

    // Vertical "MILLIONS" in dark green on gold band — rotated 90 deg
    d.ctx.save();
    d.ctx.translate(bandX + bandWidth / 2, d.cardY + d.cardH / 2);
    d.ctx.rotate(-Math.PI / 2);
    drawText(d.ctx, "MILLIONS.", 0, 0, {
        font: FONT_HEADING, size: d.cardH * 0.16, weight: 600, color: COLOR_DARK, align: "center", baseline: "middle",
        letterSpacing: `${d.cardH * 0.008}px`,
    });
    drawText(d.ctx, "THE", 0, -d.cardH * 0.12, {
        font: FONT_HEADING, size: d.cardH * 0.05, weight: 300, color: COLOR_DARK, align: "center", baseline: "middle",
        letterSpacing: `${d.cardH * 0.024}px`,
    });
    d.ctx.restore();

    // Right side content
    const rightX = bandX + bandWidth + d.cardW * 0.06;
    drawText(d.ctx, card.name || "Your Name", rightX, d.cardY + d.cardH * 0.32, {
        font: FONT_HEADING, size: d.cardH * 0.14, weight: 600, color: COLOR_WHITE,
    });
    if (card.title) {
        drawText(d.ctx, card.title.toUpperCase(), rightX, d.cardY + d.cardH * 0.42, {
            font: FONT_BODY, size: d.cardH * 0.045, weight: 500, color: COLOR_GOLD,
            letterSpacing: `${d.cardH * 0.012}px`,
        });
    }

    // Gold rule
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(rightX, d.cardY + d.cardH * 0.55, d.cardW * 0.1, Math.max(1, d.cardH * 0.005));

    // Contact lines — label in gold tracked small caps, value in cream regular.
    // Rendering label + value as separate draw calls keeps the value column
    // visually aligned across rows despite the proportional font.
    const lines: { label: string; value: string }[] = [];
    if (card.phoneMobile) lines.push({ label: "MOBILE", value: card.phoneMobile });
    if (card.phoneOffice) lines.push({ label: "OFFICE", value: card.phoneOffice });
    if (card.email) lines.push({ label: "EMAIL", value: card.email });
    if (card.website) lines.push({ label: "WEB", value: card.website.replace(/^https?:\/\//, "") });

    const lineSize = d.cardH * 0.045;
    const labelSize = lineSize * 0.72;
    const valueColX = rightX + d.cardW * 0.13;
    lines.forEach((ln, i) => {
        const y = d.cardY + d.cardH * 0.66 + i * lineSize * 1.45;
        drawText(d.ctx, ln.label, rightX, y, {
            font: FONT_BODY, size: labelSize, weight: 500, color: COLOR_GOLD,
            letterSpacing: `${labelSize * 0.18}px`,
        });
        drawText(d.ctx, ln.value, valueColX, y, {
            font: FONT_BODY, size: lineSize, weight: 400, color: "#e8e2d3",
        });
    });
}

async function renderLuxeBack(d: DrawCtx, card: BusinessCardData) {
    // Layout: M mark + tagline top half, QR + label bottom half. Mark shrinks
    // from the previous oversize so the QR has room to actually be useful.
    fillBackground(d, COLOR_DARK);

    // M mark — top section, moderate size
    const markSize = d.cardH * 0.24;
    drawMark(d.ctx, d.cardX + d.cardW / 2, d.safeY + markSize / 2 + d.cardH * 0.02, markSize, null, COLOR_GOLD);

    // Short gold underline below mark
    const underlineY = d.safeY + markSize + d.cardH * 0.07;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.cardX + d.cardW / 2 - d.cardW * 0.05, underlineY, d.cardW * 0.1, Math.max(1, d.cardH * 0.005));

    // Tagline below underline — falls back to a sensible default
    const tagline = (card.tagline || "CHARTERED ACCOUNTANTS").toUpperCase();
    drawText(d.ctx, tagline, d.cardX + d.cardW / 2, underlineY + d.cardH * 0.07, {
        font: FONT_BODY, size: d.cardH * 0.034, weight: 500, color: COLOR_GOLD, align: "center",
        letterSpacing: `${d.cardH * 0.018}px`,
    });

    // QR + label in the lower half
    if (card.showQrCode !== false) {
        const qrSize = d.cardH * 0.38;
        await drawQrPanel(d.ctx, card, d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.7, qrSize, {
            padColor: COLOR_CREAM,
            labelText: "SCAN TO CONNECT",
            labelColor: COLOR_GOLD,
            labelSize: d.cardH * 0.03,
            labelTracking: d.cardH * 0.014,
        });
    }
}

async function renderModernFront(d: DrawCtx, card: BusinessCardData) {
    fillBackground(d, COLOR_CREAM);
    // Top-right corner mark
    const markSize = d.cardH * 0.15;
    drawMark(d.ctx, d.safeX + d.safeW - markSize / 2, d.safeY + markSize / 2, markSize, COLOR_GOLD, COLOR_DARK);

    // Name large top-left
    drawText(d.ctx, card.name || "Your Name", d.safeX, d.cardY + d.cardH * 0.32, {
        font: FONT_HEADING, size: d.cardH * 0.16, weight: 600, color: COLOR_DARK,
    });

    // Title
    if (card.title) {
        drawText(d.ctx, card.title, d.safeX, d.cardY + d.cardH * 0.43, {
            font: FONT_HEADING, size: d.cardH * 0.06, weight: 300, color: "#5a5a5a",
        });
    }

    // Gold rule
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.safeX, d.cardY + d.cardH * 0.55, d.cardW * 0.16, Math.max(1, d.cardH * 0.005));

    // Left column: contact
    const contactLines: string[] = [];
    if (card.phoneMobile) contactLines.push(card.phoneMobile);
    if (card.phoneOffice) contactLines.push(card.phoneOffice);
    if (card.email) contactLines.push(card.email);
    if (card.website) contactLines.push(card.website.replace(/^https?:\/\//, ""));
    const lineSize = d.cardH * 0.042;
    contactLines.forEach((ln, i) => {
        drawText(d.ctx, ln, d.safeX, d.cardY + d.cardH * 0.66 + i * lineSize * 1.5, {
            font: FONT_BODY, size: lineSize, weight: 400, color: COLOR_DARK,
        });
    });

    // Right column: address
    (card.address ?? []).slice(0, 4).forEach((ln, i) => {
        drawText(d.ctx, ln, d.safeX + d.safeW, d.cardY + d.cardH * 0.66 + i * lineSize * 1.5, {
            font: FONT_BODY, size: lineSize, weight: 300, color: "#5a5a5a", align: "right",
        });
    });
}

async function renderModernBack(d: DrawCtx, card: BusinessCardData) {
    // Gold field with two zones: M mark left, QR + label right, separated by
    // a vertical dark-green rule. Optional tagline runs above the rule.
    fillBackground(d, COLOR_GOLD);

    // Optional tagline at very top
    if (card.tagline) {
        drawText(d.ctx, card.tagline.toUpperCase(), d.cardX + d.cardW / 2, d.safeY + d.cardH * 0.06, {
            font: FONT_BODY, size: d.cardH * 0.032, weight: 500, color: COLOR_DARK, align: "center",
            letterSpacing: `${d.cardH * 0.018}px`,
        });
    }

    // Left zone: big M
    const markSize = d.cardH * 0.50;
    drawMark(d.ctx, d.cardX + d.cardW * 0.27, d.cardY + d.cardH * 0.52, markSize, null, COLOR_DARK);

    // Vertical rule between zones
    d.ctx.fillStyle = COLOR_DARK;
    d.ctx.fillRect(
        d.cardX + d.cardW * 0.50,
        d.cardY + d.cardH * 0.22,
        Math.max(1, d.cardH * 0.003),
        d.cardH * 0.56
    );

    // Right zone: QR with cream pad + dark "SCAN TO CONNECT" label
    if (card.showQrCode !== false) {
        const qrSize = d.cardH * 0.42;
        await drawQrPanel(d.ctx, card, d.cardX + d.cardW * 0.74, d.cardY + d.cardH * 0.52, qrSize, {
            padColor: COLOR_CREAM,
            labelText: "SCAN TO CONNECT",
            labelColor: COLOR_DARK,
            labelSize: d.cardH * 0.028,
            labelTracking: d.cardH * 0.014,
        });
    }
}

// Main render entrypoint ---------------------------------------------------

export type RenderOpts = {
    /** Full canvas (bleed-inclusive when withBleed=true) width in pixels */
    width: number;
    /** Full canvas height in pixels */
    height: number;
    /** Whether to inset content for a 3mm bleed strip — true for PDF export, false for on-screen preview */
    withBleed: boolean;
};

export async function renderCardSide(
    canvas: HTMLCanvasElement,
    card: BusinessCardData & { showQrCode?: boolean },
    side: Side,
    template: Template,
    opts: RenderOpts
): Promise<void> {
    await ensureFontsLoaded();
    canvas.width = opts.width;
    canvas.height = opts.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, opts.width, opts.height);

    // Bleed strip is 3mm out of 91mm total = 3.297% of width
    const bleedRatio = opts.withBleed ? 3 / 91 : 0;
    const cardX = opts.width * bleedRatio;
    const cardY = opts.height * bleedRatio;
    const cardW = opts.width * (1 - bleedRatio * 2);
    const cardH = opts.height * (1 - bleedRatio * 2);

    // Safe area = card minus 3mm safe inset on each side
    const safeInsetRatio = 3 / 85; // 3mm of 85mm visible width
    const safeX = cardX + cardW * safeInsetRatio;
    const safeY = cardY + cardH * (3 / 55);
    const safeW = cardW - cardW * safeInsetRatio * 2;
    const safeH = cardH - cardH * (3 / 55) * 2;

    const d: DrawCtx = {
        ctx,
        cw: opts.width,
        ch: opts.height,
        cardX,
        cardY,
        cardW,
        cardH,
        safeX,
        safeY,
        safeW,
        safeH,
    };

    if (template === "minimal") {
        side === "front" ? await renderMinimalFront(d, card) : await renderMinimalBack(d, card);
    } else if (template === "luxe") {
        side === "front" ? await renderLuxeFront(d, card) : await renderLuxeBack(d, card);
    } else {
        side === "front" ? await renderModernFront(d, card) : await renderModernBack(d, card);
    }
}

// PDF export ---------------------------------------------------------------

export async function exportCardPdf(card: BusinessCardData & { showQrCode?: boolean }, template: Template) {
    // Page is 91×61mm = 85×55mm trim + 3mm bleed on each side. Print shops
    // trim by the PDF's media-box dimensions, not by drawn crop marks.
    const W_MM = 91;
    const H_MM = 61;
    const DPI = 300;
    const pxW = Math.round((W_MM * DPI) / 25.4);
    const pxH = Math.round((H_MM * DPI) / 25.4);

    const frontCanvas = document.createElement("canvas");
    await renderCardSide(frontCanvas, card, "front", template, { width: pxW, height: pxH, withBleed: true });
    const frontPng = frontCanvas.toDataURL("image/png");

    const backCanvas = document.createElement("canvas");
    await renderCardSide(backCanvas, card, "back", template, { width: pxW, height: pxH, withBleed: true });
    const backPng = backCanvas.toDataURL("image/png");

    const doc = new jsPDF({ unit: "mm", format: [W_MM, H_MM], orientation: "landscape" });
    doc.addImage(frontPng, "PNG", 0, 0, W_MM, H_MM, undefined, "FAST");

    doc.addPage([W_MM, H_MM], "landscape");
    doc.addImage(backPng, "PNG", 0, 0, W_MM, H_MM, undefined, "FAST");

    const filename = `the-millions-card-${card.name.replace(/[^a-z0-9]+/gi, "_") || "untitled"}.pdf`;
    doc.save(filename);
}

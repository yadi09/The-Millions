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
    return QRCode.toDataURL(content, {
        margin: 0,
        width: sizePx,
        errorCorrectionLevel: "M",
        color: { dark, light },
    });
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
    fillBackground(d, COLOR_CREAM);

    // Mark in top-left corner of safe area
    const markSize = d.cardH * 0.18;
    drawMark(d.ctx, d.safeX + markSize / 2, d.safeY + markSize / 2, markSize, COLOR_DARK, COLOR_GOLD);

    // Name centered
    const nameSize = d.cardH * 0.18;
    drawText(d.ctx, card.name || "Your Name", d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.52, {
        font: FONT_HEADING, size: nameSize, weight: 600, color: COLOR_DARK, align: "center", baseline: "middle",
    });

    // Title below name
    if (card.title) {
        drawText(d.ctx, card.title.toUpperCase(), d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.62, {
            font: FONT_BODY, size: d.cardH * 0.045, weight: 500, color: COLOR_GOLD, align: "center",
            letterSpacing: `${d.cardH * 0.012}px`,
        });
    }

    // Gold divider
    const dividerY = d.cardY + d.cardH * 0.72;
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.cardX + d.cardW * 0.4, dividerY, d.cardW * 0.2, Math.max(1, d.cardH * 0.004));

    // Contact lines at bottom — 2 cols if we have enough
    const lines: string[] = [];
    if (card.phoneMobile) lines.push(card.phoneMobile);
    if (card.phoneOffice) lines.push(card.phoneOffice);
    if (card.email) lines.push(card.email);
    if (card.website) lines.push(card.website.replace(/^https?:\/\//, ""));

    const lineSize = d.cardH * 0.045;
    const baselineY = d.cardY + d.cardH * 0.86;
    const lineGap = lineSize * 1.5;
    // Two columns
    const col1 = lines.slice(0, 2);
    const col2 = lines.slice(2);
    col1.forEach((ln, i) => {
        drawText(d.ctx, ln, d.cardX + d.cardW * 0.5 - d.cardW * 0.02, baselineY + i * lineGap, {
            font: FONT_BODY, size: lineSize, weight: 400, color: COLOR_DARK, align: "right",
        });
    });
    col2.forEach((ln, i) => {
        drawText(d.ctx, ln, d.cardX + d.cardW * 0.5 + d.cardW * 0.02, baselineY + i * lineGap, {
            font: FONT_BODY, size: lineSize, weight: 400, color: COLOR_DARK, align: "left",
        });
    });
}

async function renderMinimalBack(d: DrawCtx, card: BusinessCardData) {
    fillBackground(d, COLOR_DARK);
    // Wordmark top-centered
    const wmWidth = d.cardW * 0.45;
    drawWordmark(d.ctx, d.cardX + d.cardW / 2 - wmWidth / 2, d.cardY + d.cardH * 0.1, wmWidth, COLOR_GOLD);

    // QR code center
    if (card.showQrCode !== false) {
        const qrSize = Math.min(d.cardH * 0.46, d.cardW * 0.32);
        const qrUrl = await qrDataUrl(generateVcard(card), Math.round(qrSize * 4), COLOR_DARK, COLOR_GOLD);
        const qr = await loadImage(qrUrl);
        const qrX = d.cardX + d.cardW / 2 - qrSize / 2;
        const qrY = d.cardY + d.cardH * 0.36;
        // Light cream pad behind QR for scan reliability
        d.ctx.fillStyle = COLOR_CREAM;
        d.ctx.fillRect(qrX - qrSize * 0.08, qrY - qrSize * 0.08, qrSize * 1.16, qrSize * 1.16);
        d.ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);

        drawText(d.ctx, "SCAN TO CONNECT", d.cardX + d.cardW / 2, qrY + qrSize + d.cardH * 0.08, {
            font: FONT_BODY, size: d.cardH * 0.035, weight: 500, color: COLOR_GOLD, align: "center",
            letterSpacing: `${d.cardH * 0.014}px`,
        });
    } else if (card.tagline) {
        drawText(d.ctx, card.tagline, d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.6, {
            font: FONT_HEADING, size: d.cardH * 0.07, color: COLOR_GOLD, align: "center", baseline: "middle",
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

    // Contact lines
    const lines: string[] = [];
    if (card.phoneMobile) lines.push(`M  ${card.phoneMobile}`);
    if (card.phoneOffice) lines.push(`T  ${card.phoneOffice}`);
    if (card.email) lines.push(`E  ${card.email}`);
    if (card.website) lines.push(`W  ${card.website.replace(/^https?:\/\//, "")}`);
    const lineSize = d.cardH * 0.045;
    lines.forEach((ln, i) => {
        drawText(d.ctx, ln, rightX, d.cardY + d.cardH * 0.66 + i * lineSize * 1.45, {
            font: FONT_BODY, size: lineSize, weight: 400, color: "#e8e2d3",
        });
    });
}

async function renderLuxeBack(d: DrawCtx, card: BusinessCardData) {
    fillBackground(d, COLOR_DARK);
    // Big M mark center
    const markSize = d.cardH * 0.42;
    drawMark(d.ctx, d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.4, markSize, null, COLOR_GOLD);

    // Underline
    d.ctx.fillStyle = COLOR_GOLD;
    d.ctx.fillRect(d.cardX + d.cardW * 0.42, d.cardY + d.cardH * 0.65, d.cardW * 0.16, Math.max(1, d.cardH * 0.005));

    drawText(d.ctx, "CHARTERED ACCOUNTANTS", d.cardX + d.cardW / 2, d.cardY + d.cardH * 0.74, {
        font: FONT_BODY, size: d.cardH * 0.038, weight: 500, color: COLOR_GOLD, align: "center",
        letterSpacing: `${d.cardH * 0.02}px`,
    });

    if (card.showQrCode !== false) {
        const qrSize = d.cardH * 0.22;
        const qrUrl = await qrDataUrl(generateVcard(card), Math.round(qrSize * 4), COLOR_GOLD, "rgba(0,0,0,0)");
        const qr = await loadImage(qrUrl);
        d.ctx.drawImage(qr, d.safeX + d.safeW - qrSize, d.safeY + d.safeH - qrSize, qrSize, qrSize);
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
    fillBackground(d, COLOR_GOLD);
    // Big M in dark green center-left
    const markSize = d.cardH * 0.55;
    drawMark(d.ctx, d.cardX + d.cardW * 0.32, d.cardY + d.cardH * 0.5, markSize, null, COLOR_DARK);

    if (card.showQrCode !== false) {
        const qrSize = d.cardH * 0.36;
        const qrUrl = await qrDataUrl(generateVcard(card), Math.round(qrSize * 4), COLOR_DARK, "rgba(0,0,0,0)");
        const qr = await loadImage(qrUrl);
        // White pad behind for max contrast
        const padX = d.cardX + d.cardW * 0.62 - qrSize * 0.08;
        const padY = d.cardY + d.cardH / 2 - qrSize / 2 - qrSize * 0.08;
        d.ctx.fillStyle = COLOR_WHITE;
        d.ctx.fillRect(padX, padY, qrSize * 1.16, qrSize * 1.16);
        d.ctx.drawImage(qr, d.cardX + d.cardW * 0.62, d.cardY + d.cardH / 2 - qrSize / 2, qrSize, qrSize);

        drawText(d.ctx, "SCAN TO SAVE CONTACT", d.cardX + d.cardW * 0.62 + qrSize / 2, d.cardY + d.cardH * 0.88, {
            font: FONT_BODY, size: d.cardH * 0.032, weight: 500, color: COLOR_DARK, align: "center",
            letterSpacing: `${d.cardH * 0.012}px`,
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

function addCropMarks(doc: jsPDF, w: number, h: number, bleed: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);
    const armLen = 2; // mm
    const gap = 0.5;
    // Top-left
    doc.line(0, bleed, bleed - gap, bleed);
    doc.line(bleed, 0, bleed, bleed - gap);
    // Top-right
    doc.line(w - bleed + gap, bleed, Math.min(w, w - bleed + armLen + gap), bleed);
    doc.line(w - bleed, 0, w - bleed, bleed - gap);
    // Bottom-left
    doc.line(0, h - bleed, bleed - gap, h - bleed);
    doc.line(bleed, h - bleed + gap, bleed, h);
    // Bottom-right
    doc.line(w - bleed + gap, h - bleed, w - bleed + armLen + gap, h - bleed);
    doc.line(w - bleed, h - bleed + gap, w - bleed, h);
}

export async function exportCardPdf(card: BusinessCardData & { showQrCode?: boolean }, template: Template) {
    const W_MM = 91;
    const H_MM = 61;
    const TRIM_MM = 3;
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
    addCropMarks(doc, W_MM, H_MM, TRIM_MM);

    doc.addPage([W_MM, H_MM], "landscape");
    doc.addImage(backPng, "PNG", 0, 0, W_MM, H_MM, undefined, "FAST");
    addCropMarks(doc, W_MM, H_MM, TRIM_MM);

    const filename = `the-millions-card-${card.name.replace(/[^a-z0-9]+/gi, "_") || "untitled"}.pdf`;
    doc.save(filename);
}

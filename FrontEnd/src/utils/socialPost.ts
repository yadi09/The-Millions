import {
    COLOR_DARK,
    COLOR_GOLD,
    COLOR_WHITE,
    FONT_HEADING,
    FONT_BODY,
    ensureFontsLoaded,
    drawText,
    drawMark,
    drawWordmarkCentered,
    wrapText,
    loadImage,
    downloadBlob,
} from "./canvasUtils";

export type TemplateType = "tip-list" | "quote" | "stat";
export type Platform = "linkedin" | "square" | "story";

export type TipListContent = {
    headline: string;
    items: string[];
    cta: string;
    categoryTag: string;
};

export type QuoteContent = {
    quote: string;
    attribution: string;
    // Optional star count (1–5). When set, the renderer draws a row of
    // gold stars between the quote and the attribution. Auto-populated
    // when the brother picks a real testimonial from the library.
    rating?: number;
    // Tracks which testimonial drove this draft (analytics, future
    // "refresh from source" features). The backend stores it as opaque
    // JSON so no migration needed.
    sourceTestimonialId?: string;
};

export type StatContent = {
    number: string;
    label: string;
    sublabel: string;
};

export type Content = TipListContent | QuoteContent | StatContent;

export type SocialPostData = {
    templateType: TemplateType;
    platform: Platform;
    content: Content;
    imageUrl?: string | null;
};

// Platform-specific export dimensions
export const PLATFORM_DIMENSIONS: Record<Platform, { width: number; height: number; label: string; aspect: string }> = {
    linkedin: { width: 1200, height: 627, label: "LinkedIn Feed", aspect: "1200 × 627" },
    square: { width: 1080, height: 1080, label: "Instagram Square", aspect: "1080 × 1080" },
    story: { width: 1080, height: 1920, label: "Story / Reel", aspect: "1080 × 1920" },
};

// Helper: draw a background — either flat dark or uploaded image with dark overlay
async function fillPostBackground(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    imageUrl: string | null | undefined,
    fallback: string
): Promise<void> {
    if (imageUrl) {
        try {
            const img = await loadImage(imageUrl);
            // Cover-fit the image into the canvas
            const imgAspect = img.width / img.height;
            const canvasAspect = w / h;
            let sx = 0, sy = 0, sw = img.width, sh = img.height;
            if (imgAspect > canvasAspect) {
                // Image wider than canvas — crop sides
                sw = img.height * canvasAspect;
                sx = (img.width - sw) / 2;
            } else {
                // Image taller — crop top/bottom
                sh = img.width / canvasAspect;
                sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
            // Dark overlay so text stays readable
            ctx.fillStyle = "rgba(13, 36, 32, 0.75)";
            ctx.fillRect(0, 0, w, h);
            return;
        } catch {
            // fall through to flat background
        }
    }
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, w, h);
}

// Per-platform layout knobs. Story is portrait so it gets tighter margins
// vertically; LinkedIn is landscape so it gets tighter top/bottom and more
// room for the headline column. Square sits in between.
type Layout = {
    hPad: number; // horizontal padding
    vPad: number; // vertical padding
    markSize: number;
    headlineSize: number;
    bodySize: number;
    accentH: number;
};

function layoutFor(platform: Platform, w: number, h: number): Layout {
    if (platform === "linkedin") {
        return {
            hPad: w * 0.06,
            vPad: h * 0.09,
            markSize: h * 0.075,
            headlineSize: h * 0.095,
            bodySize: h * 0.044,
            accentH: Math.max(4, h * 0.012),
        };
    }
    if (platform === "square") {
        return {
            hPad: w * 0.075,
            vPad: h * 0.075,
            markSize: h * 0.06,
            headlineSize: h * 0.075,
            bodySize: h * 0.04,
            accentH: Math.max(4, h * 0.01),
        };
    }
    // story (1080×1920) — portrait, very tall content area
    return {
        hPad: w * 0.075,
        vPad: h * 0.05,
        markSize: h * 0.045,
        headlineSize: h * 0.05,
        bodySize: h * 0.026,
        accentH: Math.max(4, h * 0.007),
    };
}

// Shared brand strip — small filled-square mark + wordmark, baseline-
// correct so it never collides with the headline below. `accent` is the
// colour of the M-square and the wordmark text (they read as one unit).
// `contrast` is the M letter colour — opposite of the square so the M
// remains visible. Returns the strip's bottom y so callers can position
// content beneath it cleanly.
function drawBrandStrip(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    markSize: number,
    accent: string,
    contrast: string,
    rightLabel?: string,
    rightX?: number
): number {
    // Mark — filled square in `accent`, M letter in `contrast`
    drawMark(ctx, x + markSize / 2, y + markSize / 2, markSize, accent, contrast);
    // Wordmark text — same colour as the M square so they read as one mark
    drawText(ctx, "THE MILLIONS.", x + markSize * 1.45, y + markSize / 2, {
        font: FONT_HEADING,
        size: markSize * 0.5,
        weight: 600,
        color: accent,
        baseline: "middle",
        letterSpacing: `${markSize * 0.03}px`,
    });
    if (rightLabel && rightX !== undefined) {
        drawText(ctx, rightLabel, rightX, y + markSize / 2, {
            font: FONT_BODY,
            size: markSize * 0.35,
            weight: 500,
            color: accent,
            align: "right",
            baseline: "middle",
            letterSpacing: `${markSize * 0.05}px`,
        });
    }
    return y + markSize;
}

// --- TIP LIST ----------------------------------------------------------------
// Dark green background, structured grid: brand strip at top, big white
// headline, bold gold accent block, numbered tips below with generous
// leading, CTA pinned to the bottom edge of the safe area.
async function renderTipList(
    ctx: CanvasRenderingContext2D,
    content: TipListContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);

    const L = layoutFor(platform, w, h);
    const safeX = L.hPad;
    const safeY = L.vPad;
    const safeW = w - L.hPad * 2;
    const safeH = h - L.vPad * 2;

    // Brand strip (top-left mark + word, optional right-aligned category tag).
    // Tag is editable per draft so the same template covers tax tips, payroll
    // tips, VAT guides, year-end reminders, etc. — leave blank to drop it.
    const tag = (content.categoryTag || "").trim().toUpperCase();
    const stripBottom = drawBrandStrip(
        ctx,
        safeX,
        safeY,
        L.markSize,
        COLOR_GOLD,
        COLOR_DARK,
        tag || undefined,
        tag ? safeX + safeW : undefined
    );

    // Headline — top-aligned baseline so the gap above is exactly what we set.
    const headlineTopY = stripBottom + h * 0.06;
    const headlineLineHeight = L.headlineSize * 1.08;
    const headlineLines = wrapText(
        ctx,
        content.headline || "Your Headline",
        safeW,
        FONT_HEADING,
        L.headlineSize,
        600
    );
    headlineLines.forEach((line, i) => {
        drawText(ctx, line, safeX, headlineTopY + i * headlineLineHeight, {
            font: FONT_HEADING,
            size: L.headlineSize,
            weight: 600,
            color: COLOR_WHITE,
            baseline: "top",
        });
    });

    // Gold accent — a real block, not a hairline
    const headlineBottomY = headlineTopY + headlineLines.length * headlineLineHeight;
    const accentY = headlineBottomY + h * 0.025;
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillRect(safeX, accentY, w * 0.08, L.accentH);

    // Numbered tips
    const tipsTopY = accentY + L.accentH + h * 0.04;
    const numberSize = L.bodySize * 1.55;
    const numberColumnW = numberSize * 1.7;
    const items = content.items.filter((s) => s && s.trim()).slice(0, 5);
    let cursorY = tipsTopY;
    const tipGap = h * 0.025;

    items.forEach((item, i) => {
        // Number — italic Cormorant in gold
        drawText(ctx, String(i + 1).padStart(2, "0"), safeX, cursorY, {
            font: FONT_HEADING,
            size: numberSize,
            weight: 400,
            color: COLOR_GOLD,
            baseline: "top",
        });
        // Tip body — wrapped
        const tipLines = wrapText(ctx, item, safeW - numberColumnW, FONT_BODY, L.bodySize, 400);
        const bodyTopOffset = numberSize * 0.18; // align body roughly with the number
        tipLines.forEach((line, j) => {
            drawText(ctx, line, safeX + numberColumnW, cursorY + bodyTopOffset + j * L.bodySize * 1.4, {
                font: FONT_BODY,
                size: L.bodySize,
                weight: 400,
                color: COLOR_WHITE,
                baseline: "top",
            });
        });
        const blockH = Math.max(numberSize, bodyTopOffset + tipLines.length * L.bodySize * 1.4);
        cursorY += blockH + tipGap;
    });

    // CTA pinned to safe bottom — small rule above it for elegance
    if (content.cta) {
        const ctaSize = h * 0.022;
        const ctaY = safeY + safeH;
        // Thin gold rule above the CTA
        ctx.fillStyle = COLOR_GOLD;
        ctx.fillRect(safeX, ctaY - ctaSize * 1.8, w * 0.04, Math.max(1, h * 0.002));
        drawText(ctx, content.cta.toUpperCase(), safeX, ctaY, {
            font: FONT_BODY,
            size: ctaSize,
            weight: 500,
            color: COLOR_GOLD,
            baseline: "bottom",
            letterSpacing: `${ctaSize * 0.22}px`,
        });
    }
}

// --- QUOTE -------------------------------------------------------------------
// Dramatic centered layout on dark green. The opening quote glyph is itself
// a large decorative element. Wordmark anchors the bottom for brand recall
// when the post gets reshared without context.
async function renderQuote(
    ctx: CanvasRenderingContext2D,
    content: QuoteContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    // Layout strategy: ANCHOR the bottom block (wordmark → attribution →
    // accent → stars) at the bottom of the canvas with fixed gaps, ANCHOR
    // the decorative quote glyph near the top, then let the quote text fill
    // the remaining middle. If the quote needs more vertical space than
    // available, shrink the font progressively until it fits — no more
    // attribution colliding with the wordmark on long testimonials.
    await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);

    const L = layoutFor(platform, w, h);
    const safeW = w * 0.78;
    const rating = Math.min(5, Math.max(0, Math.floor(content.rating ?? 0)));

    // ----- BOTTOM BLOCK (anchored upward from the bottom edge) -----
    const wmW = platform === "story" ? w * 0.35 : w * 0.22;
    const wmH = wmW / 4;
    const wmCenterY = h - L.vPad - wmH / 2;
    const wmTopY = wmCenterY - wmH / 2;

    // Attribution — wraps if long
    const attrSize = h * 0.022;
    const attrLines = content.attribution
        ? wrapText(ctx, content.attribution.toUpperCase(), w * 0.82, FONT_BODY, attrSize, 500)
        : [];
    const attrLineH = attrSize * 1.5;
    const attrBlockH = attrLines.length * attrLineH;
    const attrToWmGap = h * 0.045;
    const attrBottomY = wmTopY - attrToWmGap;
    const attrTopY = attrBottomY - attrBlockH;

    // Accent rule
    const accentH = L.accentH;
    const accentToAttrGap = attrLines.length > 0 ? h * 0.025 : h * 0.04;
    const accentBottomY = (attrLines.length > 0 ? attrTopY : attrBottomY) - accentToAttrGap;
    const accentTopY = accentBottomY - accentH;

    // Star row (only when rating > 0)
    const starSize = h * 0.04;
    const starToAccentGap = h * 0.03;
    const starsBottomY = accentTopY - starToAccentGap;
    const starsTopY = starsBottomY - starSize;

    // ----- TOP DECORATIVE QUOTE GLYPH (anchored near top) -----
    const decorSize = Math.min(w, h) * (platform === "story" ? 0.22 : 0.28);
    const decorCenterY = L.vPad + decorSize * 0.4;
    const decorBottomY = decorCenterY + decorSize * 0.2;

    // ----- QUOTE ZONE: the space between the decor and the bottom block -----
    const quoteZoneTopY = decorBottomY + h * 0.02;
    const quoteZoneBottomY = (rating > 0 ? starsTopY : accentTopY) - h * 0.025;
    const quoteZoneHeight = Math.max(h * 0.2, quoteZoneBottomY - quoteZoneTopY);

    // Pick the largest font size that fits within the quote zone. Wrap then
    // shrink iteratively — keeps short quotes big and dramatic, long
    // testimonials legible without ever colliding with the bottom block.
    let quoteSize = platform === "story" ? h * 0.048 : h * 0.072;
    const minQuoteSize = platform === "story" ? h * 0.026 : h * 0.035;
    let quoteLines = wrapText(ctx, content.quote || "Your quote here.", safeW, FONT_HEADING, quoteSize, 400);
    let lineH = quoteSize * 1.18;
    let safety = 0;
    while (quoteLines.length * lineH > quoteZoneHeight && quoteSize > minQuoteSize && safety < 50) {
        quoteSize *= 0.94;
        quoteLines = wrapText(ctx, content.quote || "Your quote here.", safeW, FONT_HEADING, quoteSize, 400);
        lineH = quoteSize * 1.18;
        safety++;
    }
    const quoteBlockH = quoteLines.length * lineH;
    // Vertically center the quote within its zone
    const quoteTopY = quoteZoneTopY + (quoteZoneHeight - quoteBlockH) / 2;

    // ----- DRAW (back to front: decor → quote → stars → accent → attribution → wordmark) -----

    drawText(ctx, "“", w / 2, decorCenterY, {
        font: FONT_HEADING,
        size: decorSize,
        weight: 600,
        color: "rgba(201, 168, 76, 0.18)",
        align: "center",
        baseline: "middle",
    });

    quoteLines.forEach((line, i) => {
        drawText(ctx, line, w / 2, quoteTopY + i * lineH, {
            font: FONT_HEADING,
            size: quoteSize,
            weight: 400,
            color: COLOR_WHITE,
            align: "center",
            baseline: "top",
        });
    });

    if (rating > 0) {
        const stars = "★".repeat(rating);
        drawText(ctx, stars, w / 2, starsTopY, {
            font: FONT_BODY,
            size: starSize,
            weight: 500,
            color: COLOR_GOLD,
            align: "center",
            baseline: "top",
            letterSpacing: `${starSize * 0.15}px`,
        });
    }

    ctx.fillStyle = COLOR_GOLD;
    const accentW = w * 0.06;
    ctx.fillRect(w / 2 - accentW / 2, accentTopY, accentW, accentH);

    attrLines.forEach((line, i) => {
        drawText(ctx, line, w / 2, attrTopY + i * attrLineH, {
            font: FONT_BODY,
            size: attrSize,
            weight: 500,
            color: COLOR_GOLD,
            align: "center",
            baseline: "top",
            letterSpacing: `${h * 0.007}px`,
        });
    });

    drawWordmarkCentered(ctx, w / 2, wmCenterY, wmW, COLOR_GOLD);
}

// --- STAT --------------------------------------------------------------------
// Inverse palette to differentiate from the other two templates: GOLD field,
// dark green ink. Big serif number is the hero. Brand bar in dark on top,
// label + sublabel centered below, brand URL pinned to bottom.
async function renderStat(
    ctx: CanvasRenderingContext2D,
    content: StatContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    if (imageUrl) {
        // With a custom background, fall back to dark so text contrast survives.
        await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);
    } else {
        ctx.fillStyle = COLOR_GOLD;
        ctx.fillRect(0, 0, w, h);
    }

    const inkColor = imageUrl ? COLOR_GOLD : COLOR_DARK;
    const bgInk = imageUrl ? COLOR_DARK : COLOR_GOLD; // for the M-mark's body

    const L = layoutFor(platform, w, h);
    const safeX = L.hPad;
    const safeY = L.vPad;
    const safeW = w - L.hPad * 2;
    const safeH = h - L.vPad * 2;

    // Top brand strip (dark mark on gold bg, no right tag)
    drawBrandStrip(ctx, safeX, safeY, L.markSize, inkColor, bgInk);

    // BIG number — the hero
    const numberSize = platform === "story" ? h * 0.16 : h * 0.24;
    const numberCenterY = h / 2 - h * 0.04;
    drawText(ctx, content.number || "00", w / 2, numberCenterY, {
        font: FONT_HEADING,
        size: numberSize,
        weight: 600,
        color: inkColor,
        align: "center",
        baseline: "middle",
    });

    // Dark accent rule under number
    const accentY = numberCenterY + numberSize * 0.52;
    ctx.fillStyle = inkColor;
    const accentW = w * 0.08;
    ctx.fillRect(w / 2 - accentW / 2, accentY, accentW, L.accentH);

    // Label — italic Cormorant
    const labelSize = platform === "story" ? h * 0.034 : h * 0.05;
    const labelTopY = accentY + L.accentH + h * 0.035;
    const labelLines = wrapText(ctx, content.label || "Your label", safeW * 0.9, FONT_HEADING, labelSize, 400);
    labelLines.forEach((line, i) => {
        drawText(ctx, line, w / 2, labelTopY + i * labelSize * 1.22, {
            font: FONT_HEADING,
            size: labelSize,
            weight: 400,
            color: inkColor,
            align: "center",
            baseline: "top",
        });
    });

    // Sublabel — body type, more muted
    if (content.sublabel) {
        const sublabelSize = platform === "story" ? h * 0.022 : h * 0.026;
        const subTopY = labelTopY + labelLines.length * labelSize * 1.22 + h * 0.03;
        const subLines = wrapText(ctx, content.sublabel, safeW * 0.75, FONT_BODY, sublabelSize, 400);
        subLines.forEach((line, i) => {
            drawText(ctx, line, w / 2, subTopY + i * sublabelSize * 1.45, {
                font: FONT_BODY,
                size: sublabelSize,
                weight: 400,
                color: inkColor,
                align: "center",
                baseline: "top",
            });
        });
    }

    // Bottom URL line, very small
    drawText(ctx, "THE-MILLIONS.CO.UK", w / 2, safeY + safeH, {
        font: FONT_BODY,
        size: h * 0.02,
        weight: 500,
        color: inkColor,
        align: "center",
        baseline: "bottom",
        letterSpacing: `${h * 0.006}px`,
    });
}

// --- ENTRYPOINT --------------------------------------------------------------

export async function renderSocialPost(
    canvas: HTMLCanvasElement,
    data: SocialPostData,
    targetWidth?: number
): Promise<void> {
    await ensureFontsLoaded();

    const dim = PLATFORM_DIMENSIONS[data.platform];
    const scale = targetWidth ? targetWidth / dim.width : 1;
    const w = Math.round(dim.width * scale);
    const h = Math.round(dim.height * scale);
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    if (data.templateType === "tip-list") {
        await renderTipList(ctx, data.content as TipListContent, data.platform, w, h, data.imageUrl);
    } else if (data.templateType === "quote") {
        await renderQuote(ctx, data.content as QuoteContent, data.platform, w, h, data.imageUrl);
    } else {
        await renderStat(ctx, data.content as StatContent, data.platform, w, h, data.imageUrl);
    }
}

export async function exportSocialPostPng(data: SocialPostData): Promise<void> {
    // Render at native platform dimensions for the export
    const canvas = document.createElement("canvas");
    await renderSocialPost(canvas, data);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("Canvas export failed");
    const dim = PLATFORM_DIMENSIONS[data.platform];
    const filename = `the-millions-${data.templateType}-${dim.width}x${dim.height}.png`;
    downloadBlob(blob, filename);
}

// Defaults for new posts ---------------------------------------------------

export function defaultContent(type: TemplateType): Content {
    if (type === "tip-list") {
        return {
            headline: "3 Ways to Cut Your Tax Bill",
            items: [
                "Maximise your pension contributions — tax-free up to £60k a year.",
                "Use your dividend allowance — £500 tax-free in 2025/26.",
                "Don't forget the marriage allowance if your partner earns less than £12,570.",
            ],
            cta: "the-millions.co.uk",
            categoryTag: "TAX TIPS",
        };
    }
    if (type === "quote") {
        return {
            quote: "Most directors overpay on dividends by £2,000 every year.",
            attribution: "The Millions, Chartered Accountants",
        };
    }
    return {
        number: "£12,570",
        label: "The personal allowance most clients forget",
        sublabel: "Use it or lose it before 5th April.",
    };
}

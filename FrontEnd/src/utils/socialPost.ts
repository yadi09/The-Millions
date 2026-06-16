import {
    COLOR_DARK,
    COLOR_GOLD,
    COLOR_CREAM,
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
};

export type QuoteContent = {
    quote: string;
    attribution: string;
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

// --- TIP LIST ----------------------------------------------------------------

async function renderTipList(
    ctx: CanvasRenderingContext2D,
    content: TipListContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);

    // Safe area — 6% inset on each side
    const safeX = w * 0.06;
    const safeY = h * 0.06;
    const safeW = w * 0.88;
    const safeH = h * 0.88;

    // Top brand strip
    const markSize = Math.min(w, h) * 0.07;
    drawMark(ctx, safeX + markSize / 2, safeY + markSize / 2, markSize, COLOR_GOLD, COLOR_DARK);
    drawText(ctx, "THE MILLIONS.", safeX + markSize + markSize * 0.4, safeY + markSize * 0.62, {
        font: FONT_HEADING, size: markSize * 0.42, weight: 600, color: COLOR_GOLD,
        letterSpacing: `${markSize * 0.02}px`,
    });

    // Headline — large, italic Cormorant
    const headlineSize = platform === "story" ? h * 0.05 : h * 0.085;
    const headlineY = safeY + markSize + h * 0.05;
    const headlineLines = wrapText(ctx, content.headline || "Your Headline", safeW, FONT_HEADING, headlineSize, 600);
    headlineLines.forEach((line, i) => {
        drawText(ctx, line, safeX, headlineY + i * headlineSize * 1.05, {
            font: FONT_HEADING, size: headlineSize, weight: 600, color: COLOR_WHITE,
        });
    });

    // Gold accent under headline
    const headlineBlockH = headlineLines.length * headlineSize * 1.05;
    const accentY = headlineY + headlineBlockH + h * 0.025;
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillRect(safeX, accentY, w * 0.1, Math.max(2, h * 0.006));

    // Items — numbered list
    const itemStartY = accentY + h * 0.05;
    const itemSize = platform === "story" ? h * 0.028 : h * 0.045;
    const numberSize = itemSize * 1.2;
    const items = content.items.filter((x) => x && x.trim()).slice(0, 5);
    let cursorY = itemStartY;
    const lineGap = itemSize * 1.5;

    items.forEach((item, i) => {
        // Number
        drawText(ctx, String(i + 1).padStart(2, "0"), safeX, cursorY, {
            font: FONT_HEADING, size: numberSize, weight: 600, color: COLOR_GOLD,
        });
        // Text — wrap if needed
        const textX = safeX + w * 0.075;
        const textWidth = safeW - w * 0.075;
        const itemLines = wrapText(ctx, item, textWidth, FONT_BODY, itemSize, 400);
        itemLines.forEach((line, j) => {
            drawText(ctx, line, textX, cursorY + j * itemSize * 1.3, {
                font: FONT_BODY, size: itemSize, weight: 400, color: COLOR_WHITE,
            });
        });
        cursorY += Math.max(numberSize, itemLines.length * itemSize * 1.3) + lineGap * 0.4;
    });

    // CTA at bottom
    if (content.cta) {
        const ctaSize = h * 0.022;
        drawText(ctx, content.cta.toUpperCase(), safeX, safeY + safeH - ctaSize * 0.5, {
            font: FONT_BODY, size: ctaSize, weight: 500, color: COLOR_GOLD,
            letterSpacing: `${ctaSize * 0.2}px`, baseline: "alphabetic",
        });
    }
}

// --- QUOTE -------------------------------------------------------------------

async function renderQuote(
    ctx: CanvasRenderingContext2D,
    content: QuoteContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);

    const safeX = w * 0.1;
    const safeY = h * 0.1;
    const safeW = w * 0.8;

    // Big decorative quote mark
    const quoteMarkSize = Math.min(w, h) * 0.18;
    drawText(ctx, "“", safeX - quoteMarkSize * 0.1, safeY + quoteMarkSize, {
        font: FONT_HEADING, size: quoteMarkSize, weight: 600, color: COLOR_GOLD,
    });

    // Quote text — centered vertically
    const quoteSize = platform === "story" ? h * 0.045 : h * 0.075;
    const quoteLines = wrapText(ctx, content.quote || "Your quote here.", safeW, FONT_HEADING, quoteSize, 600);
    const totalH = quoteLines.length * quoteSize * 1.15;
    const blockTopY = h / 2 - totalH / 2;
    quoteLines.forEach((line, i) => {
        drawText(ctx, line, w / 2, blockTopY + i * quoteSize * 1.15 + quoteSize * 0.8, {
            font: FONT_HEADING, size: quoteSize, weight: 600, color: COLOR_WHITE, align: "center",
        });
    });

    // Gold accent below quote
    const accentY = blockTopY + totalH + h * 0.05;
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillRect(w / 2 - w * 0.05, accentY, w * 0.1, Math.max(2, h * 0.005));

    // Attribution
    if (content.attribution) {
        drawText(ctx, content.attribution.toUpperCase(), w / 2, accentY + h * 0.045, {
            font: FONT_BODY, size: h * 0.022, weight: 500, color: COLOR_GOLD, align: "center",
            letterSpacing: `${h * 0.006}px`,
        });
    }

    // Wordmark bottom
    drawWordmarkCentered(ctx, w / 2, h - h * 0.08, w * 0.25, COLOR_GOLD);
}

// --- STAT --------------------------------------------------------------------

async function renderStat(
    ctx: CanvasRenderingContext2D,
    content: StatContent,
    platform: Platform,
    w: number,
    h: number,
    imageUrl?: string | null
): Promise<void> {
    await fillPostBackground(ctx, w, h, imageUrl, COLOR_DARK);

    const safeX = w * 0.08;
    const safeY = h * 0.08;
    const safeW = w * 0.84;

    // Top brand mark
    const markSize = Math.min(w, h) * 0.07;
    drawMark(ctx, safeX + markSize / 2, safeY + markSize / 2, markSize, COLOR_GOLD, COLOR_DARK);
    drawText(ctx, "THE MILLIONS.", safeX + markSize + markSize * 0.4, safeY + markSize * 0.62, {
        font: FONT_HEADING, size: markSize * 0.42, weight: 600, color: COLOR_GOLD,
        letterSpacing: `${markSize * 0.02}px`,
    });

    // BIG number — center
    const numberSize = platform === "story" ? h * 0.13 : h * 0.22;
    const centerY = h / 2 - h * 0.05;
    drawText(ctx, content.number || "00", w / 2, centerY, {
        font: FONT_HEADING, size: numberSize, weight: 600, color: COLOR_GOLD, align: "center", baseline: "middle",
    });

    // Gold accent
    const accentY = centerY + numberSize * 0.55;
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillRect(w / 2 - w * 0.06, accentY, w * 0.12, Math.max(2, h * 0.006));

    // Label
    const labelSize = platform === "story" ? h * 0.032 : h * 0.05;
    const labelLines = wrapText(ctx, content.label || "Your label", safeW, FONT_HEADING, labelSize, 400);
    labelLines.forEach((line, i) => {
        drawText(ctx, line, w / 2, accentY + h * 0.06 + i * labelSize * 1.2, {
            font: FONT_HEADING, size: labelSize, weight: 400, color: COLOR_WHITE, align: "center",
        });
    });

    // Sublabel
    if (content.sublabel) {
        const sublabelSize = platform === "story" ? h * 0.02 : h * 0.026;
        const blockEndY = accentY + h * 0.06 + labelLines.length * labelSize * 1.2;
        const sublabelLines = wrapText(ctx, content.sublabel, safeW * 0.85, FONT_BODY, sublabelSize, 400);
        sublabelLines.forEach((line, i) => {
            drawText(ctx, line, w / 2, blockEndY + h * 0.04 + i * sublabelSize * 1.4, {
                font: FONT_BODY, size: sublabelSize, weight: 400, color: COLOR_CREAM, align: "center",
            });
        });
    }
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

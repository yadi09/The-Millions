// Shared canvas primitives. Lives outside any single feature so the brand
// mark, wordmark, typography, and font-loading code is consistent across
// the business card builder, social post builder, and anything else that
// rasterises brand artwork to PNG.

export const COLOR_DARK = "#0d2420";
export const COLOR_GOLD = "#c9a84c";
export const COLOR_CREAM = "#f5f1e8";
export const COLOR_WHITE = "#ffffff";

export const FONT_HEADING = '"Cormorant Garamond", serif';
export const FONT_BODY = '"Jost", sans-serif';

export async function ensureFontsLoaded(): Promise<void> {
    await Promise.all([
        document.fonts.load('300 100px "Cormorant Garamond"'),
        document.fonts.load('400 100px "Cormorant Garamond"'),
        document.fonts.load('600 100px "Cormorant Garamond"'),
        document.fonts.load('400 16px "Jost"'),
        document.fonts.load('500 16px "Jost"'),
        document.fonts.load('600 16px "Jost"'),
    ]);
    await document.fonts.ready;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
): void {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
}

export type TextOpts = {
    font: string;
    size: number;
    weight?: number;
    color: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    letterSpacing?: string;
    maxWidth?: number;
};

export function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    opts: TextOpts
): void {
    ctx.fillStyle = opts.color;
    ctx.font = `${opts.weight ?? 400} ${opts.size}px ${opts.font}`;
    (ctx as any).letterSpacing = opts.letterSpacing ?? "0px";
    ctx.textAlign = opts.align ?? "left";
    ctx.textBaseline = opts.baseline ?? "alphabetic";
    if (opts.maxWidth) ctx.fillText(text, x, y, opts.maxWidth);
    else ctx.fillText(text, x, y);
}

// Wraps text to fit within maxWidth, returning the lines. Caller draws them.
export function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    font: string,
    fontSize: number,
    fontWeight: number = 400
): string[] {
    ctx.font = `${fontWeight} ${fontSize}px ${font}`;
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
        const trial = current ? `${current} ${word}` : word;
        if (ctx.measureText(trial).width <= maxWidth) {
            current = trial;
        } else {
            if (current) lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines;
}

// Brand mark — the "M" in a rounded square (or transparent outline).
export function drawMark(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    bgColor: string | null,
    fgColor: string,
    strokeColor: string | null = null
): void {
    const half = size / 2;
    if (bgColor) {
        ctx.fillStyle = bgColor;
        roundedRect(ctx, cx - half, cy - half, size, size, size * 0.25);
        ctx.fill();
    } else if (strokeColor) {
        const lw = Math.max(2, size * 0.035);
        const inset = lw / 2 + size * 0.01;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lw;
        roundedRect(ctx, cx - half + inset, cy - half + inset, size - inset * 2, size - inset * 2, size * 0.25 - inset);
        ctx.stroke();
    }
    ctx.fillStyle = fgColor;
    ctx.font = `600 ${Math.round(size * 0.75)}px ${FONT_HEADING}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", cx + size * 0.02, cy + size * 0.08);
}

// Wordmark — "the MILLIONS." stacked, left-aligned. Returns the height of
// the rendered block so callers can stack other elements below.
export function drawWordmark(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    fgColor: string,
    subColor: string = fgColor
): number {
    // 4:1 aspect — width is the budget, height derived
    const height = width / 4;
    const theSize = Math.round(height * 0.18);
    ctx.fillStyle = subColor;
    ctx.font = `300 ${theSize}px ${FONT_HEADING}`;
    (ctx as any).letterSpacing = `${Math.round(theSize * 0.25)}px`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("THE", x + width * 0.04, y + height * 0.32);

    const mSize = Math.round(height * 0.62);
    ctx.fillStyle = fgColor;
    ctx.font = `600 ${mSize}px ${FONT_HEADING}`;
    (ctx as any).letterSpacing = "0px";
    ctx.fillText("MILLIONS.", x + width * 0.035, y + height * 0.93);
    return height;
}

// Centered horizontal version of the wordmark — useful for headers.
export function drawWordmarkCentered(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    fgColor: string,
    subColor: string = fgColor
): number {
    const height = width / 4;
    return drawWordmark(ctx, cx - width / 2, cy - height / 2, width, fgColor, subColor);
}

// Util — download blob as a file
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

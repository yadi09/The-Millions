// Helpers shared by the public blog list and post pages.
// All HTML parsing uses DOMParser — safe to call client-side only.

const WORDS_PER_MINUTE = 220;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")     // strip any HTML
    .replace(/[^\w\s-]/g, "")    // strip non-word chars
    .replace(/[\s_-]+/g, "-")    // collapse whitespace + underscores into a hyphen
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}

/**
 * Adds anchor IDs to <h2> and <h3> elements in the sanitised content HTML so
 * the table of contents can link to them and `scroll-to-anchor` works.
 * Idempotent — leaves existing IDs alone.
 */
export function injectHeadingIds(html: string): string {
  if (typeof window === "undefined" || !html) return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("h2, h3").forEach((h) => {
    if (!h.id) {
      const slug = slugify(h.textContent || "");
      if (slug) h.id = slug;
    }
  });
  return doc.body.innerHTML;
}

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractHeadings(html: string): BlogHeading[] {
  if (typeof window === "undefined" || !html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll("h2, h3")).map((h) => ({
    id: h.id || slugify(h.textContent || ""),
    text: (h.textContent || "").trim(),
    level: (h.tagName === "H2" ? 2 : 3) as 2 | 3,
  })).filter((h) => h.id && h.text);
}

/** Rough word-count → minutes estimate. Floors at 1 minute. */
export function calculateReadingTime(html: string): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, " ").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/** "15 May 2026" — stable across locales (en-GB), no time component. */
export function formatBlogDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface ShareUrls {
  x: string;
  linkedin: string;
  facebook: string;
}

export function getShareUrls(title: string, url: string): ShareUrls {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  };
}

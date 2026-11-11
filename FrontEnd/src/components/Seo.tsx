import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://www.the-millions.co.uk";
export const SITE_NAME = "The Millions";

// Defaults match the static tags in index.html (what crawlers and link
// previews see before JavaScript runs).
export const DEFAULT_TITLE = "The Millions | Accountancy, Tax & Business Advisory | Southampton & London";
export const DEFAULT_DESCRIPTION =
    "UK accountancy, tax advisory, business consulting and ACCA professional education. FCCA-led firm in Southampton and London helping businesses, entrepreneurs and professionals grow.";

type SeoProps = {
    title?: string;
    description?: string;
    /** Path for the canonical URL; defaults to the current path (query string dropped). */
    path?: string;
    noindex?: boolean;
};

function setMeta(attr: "name" | "property", key: string, content: string | null) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (content === null) {
        el?.remove();
        return;
    }
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setCanonical(href: string | null) {
    let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (href === null) {
        el?.remove();
        return;
    }
    if (!el) {
        el = document.createElement("link");
        el.rel = "canonical";
        document.head.appendChild(el);
    }
    el.href = href;
}

/**
 * Per-route <head> tags. Updates the tags index.html already ships with,
 * rather than adding duplicates (React 19's <title> hoisting would leave
 * two <title> elements, and the static one wins).
 */
export function Seo({ title, description, path, noindex = false }: SeoProps) {
    const { pathname } = useLocation();
    const fullTitle = title ? `${title}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path ?? pathname}`;

    useEffect(() => {
        document.title = fullTitle;
        setMeta("name", "description", desc);
        setMeta("property", "og:title", fullTitle);
        setMeta("property", "og:description", desc);
        setMeta("property", "og:url", url);
        // noindex pages shouldn't declare a canonical URL.
        setCanonical(noindex ? null : url);
        setMeta("name", "robots", noindex ? "noindex, nofollow" : null);
    }, [fullTitle, desc, url, noindex]);

    return null;
}

import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { getPageVisibilityMap, getSiteMaintenance } from "../visibility/visibility.service.js";

// Live sitemap, served at https://www.the-millions.co.uk/sitemap.xml (nginx
// proxies that exact path here). Built per request from the same
// visibility toggles the site uses, so hidden pages and unpublished posts
// never appear and nothing needs a rebuild when admins change content.

const SITE_URL = "https://www.the-millions.co.uk";

type Entry = { path: string; lastmod?: Date };

function escapeXml(s: string): string {
    return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

export async function buildSitemapEntries(): Promise<Entry[]> {
    // Maintenance mode: every public page shows the holding screen.
    if (await getSiteMaintenance()) return [];

    const pages = await getPageVisibilityMap();
    const entries: Entry[] = [];
    if (pages.home) entries.push({ path: "/" });
    if (pages.contact) entries.push({ path: "/contact" });
    if (pages.testimonials) entries.push({ path: "/testimonials" });
    // Legal pages are always public.
    entries.push({ path: "/privacy" }, { path: "/cookies" }, { path: "/terms" });

    if (pages.blog) {
        entries.push({ path: "/blog" });
        const posts = await prisma.blogPost.findMany({
            where: { status: "PUBLISHED" },
            select: { slug: true, updatedAt: true },
            orderBy: { publishedAt: "desc" },
        });
        for (const p of posts) entries.push({ path: `/blog/${encodeURIComponent(p.slug)}`, lastmod: p.updatedAt });
    }
    return entries;
}

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const entries = await buildSitemapEntries();
        const body = entries
            .map((e) => {
                const lastmod = e.lastmod ? `<lastmod>${e.lastmod.toISOString().slice(0, 10)}</lastmod>` : "";
                return `  <url><loc>${escapeXml(SITE_URL + e.path)}</loc>${lastmod}</url>`;
            })
            .join("\n");
        res
            .type("application/xml")
            .set("Cache-Control", "public, max-age=3600")
            .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
    } catch (error) {
        console.error("[sitemap] build error:", error);
        res.status(500).type("text/plain").send("Sitemap temporarily unavailable");
    }
});

export default router;

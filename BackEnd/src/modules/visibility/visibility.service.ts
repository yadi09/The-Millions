import { prisma } from "../../lib/prisma.js";
import { PAGE_KEYS, type PageKey } from "./visibility.validation.js";

const SETTING_KEY = "page_visibility";
const MAINTENANCE_KEY = "site_maintenance";

// Defaults: every page visible. Used when the setting row doesn't exist yet
// or is missing keys (e.g. after a code change that adds a new page key).
function defaultMap(): Record<PageKey, boolean> {
    return PAGE_KEYS.reduce((acc, k) => {
        acc[k] = true;
        return acc;
    }, {} as Record<PageKey, boolean>);
}

export async function getPageVisibilityMap(): Promise<Record<PageKey, boolean>> {
    const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    const fallback = defaultMap();
    if (!row) return fallback;
    const stored = (row.value ?? {}) as Record<string, unknown>;
    // Merge with defaults so newly added keys are auto-visible.
    return PAGE_KEYS.reduce((acc, k) => {
        acc[k] = stored[k] === false ? false : true;
        return acc;
    }, {} as Record<PageKey, boolean>);
}

export async function setPageVisibility(key: PageKey, visible: boolean) {
    const current = await getPageVisibilityMap();
    const next = { ...current, [key]: visible };
    return prisma.setting.upsert({
        where: { key: SETTING_KEY },
        create: {
            key: SETTING_KEY,
            value: next,
            type: "object",
            group: "site_visibility",
        },
        update: { value: next },
    });
}

export async function getAdminVisibility() {
    const [pageMap, dbPages, maintenance] = await Promise.all([
        getPageVisibilityMap(),
        prisma.page.findMany({
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    select: { id: true, type: true, order: true, visible: true },
                },
            },
        }),
        getSiteMaintenance(),
    ]);
    return {
        maintenance,
        pages: pageMap,
        // Group sections by their parent page slug so the admin UI can render
        // them nested under each toggleable page.
        sectionsByPageSlug: dbPages.reduce((acc, p) => {
            acc[p.slug] = {
                pageId: p.id,
                title: p.title,
                sections: p.sections,
            };
            return acc;
        }, {} as Record<string, { pageId: string; title: string; sections: { id: string; type: string; order: number; visible: boolean }[] }>),
    };
}

export async function setSectionVisibility(sectionId: string, visible: boolean) {
    return prisma.section.update({
        where: { id: sectionId },
        data: { visible },
    });
}

// Site-wide maintenance mode. When ON, the entire public site falls back to
// the ComingSoon page for non-admin visitors. Admins (with a valid JWT and
// ?preview=1) bypass — and we render a sticky banner so they can't forget
// it's on.
export async function getSiteMaintenance(): Promise<boolean> {
    const row = await prisma.setting.findUnique({ where: { key: MAINTENANCE_KEY } });
    if (!row) return false;
    const stored = row.value as { on?: unknown } | unknown;
    if (typeof stored === "object" && stored !== null && "on" in stored) {
        return (stored as { on: unknown }).on === true;
    }
    return false;
}

export async function setSiteMaintenance(on: boolean) {
    return prisma.setting.upsert({
        where: { key: MAINTENANCE_KEY },
        create: {
            key: MAINTENANCE_KEY,
            value: { on },
            type: "object",
            group: "site_visibility",
        },
        update: { value: { on } },
    });
}

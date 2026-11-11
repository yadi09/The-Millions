import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { SITE_SETTINGS, isSiteSettingKey, type SiteSettingKey } from "./site-settings.schemas.js";

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     tags: [Site Settings]
 *     summary: Public site setting (legal-details, privacy-page, cookies-page, terms-page)
 * /api/admin/settings/{key}:
 *   put:
 *     tags: [Site Settings]
 *     summary: Replace a site setting (admin)
 *     security:
 *       - bearerAuth: []
 */

const dbKey = (key: SiteSettingKey) => `site_${key.replace(/-/g, "_")}`;

async function readSetting(key: SiteSettingKey) {
    const { schema, defaults } = SITE_SETTINGS[key];
    const row = await prisma.setting.findUnique({ where: { key: dbKey(key) } });
    if (!row) return defaults;
    // Re-validate on read so a bad row can never break a public page.
    const parsed = schema.safeParse(row.value);
    return parsed.success ? parsed.data : defaults;
}

export const publicSiteSettingsRouter = Router();
publicSiteSettingsRouter.get("/:key", async (req: Request, res: Response) => {
    const key = String(req.params.key);
    if (!isSiteSettingKey(key)) return res.status(404).json({ message: "Unknown setting" });
    try {
        res.json(await readSetting(key));
    } catch (error) {
        console.error("[site-settings] read error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const adminSiteSettingsRouter = Router();
adminSiteSettingsRouter.use(authenticate);
adminSiteSettingsRouter.put("/:key", async (req: Request, res: Response) => {
    const key = String(req.params.key);
    if (!isSiteSettingKey(key)) return res.status(404).json({ message: "Unknown setting" });
    const parsed = SITE_SETTINGS[key].schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation error",
            error: parsed.error.issues[0]?.message ?? "Invalid value",
        });
    }
    try {
        const value = parsed.data;
        await prisma.setting.upsert({
            where: { key: dbKey(key) },
            create: { key: dbKey(key), value, type: "object", group: "site" },
            update: { value },
        });
        res.json(value);
    } catch (error) {
        console.error("[site-settings] write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

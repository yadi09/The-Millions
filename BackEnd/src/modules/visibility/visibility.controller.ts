import { Request, Response } from "express";
import {
    getPageVisibilityMap,
    setPageVisibility,
    getAdminVisibility,
    setSectionVisibility,
} from "./visibility.service.js";
import { togglePageSchema, toggleSectionSchema } from "./visibility.validation.js";

// Public — used by the frontend route gates to decide whether to render
// a page or fall back to the ComingSoon screen.
export async function getPublicVisibilityController(_req: Request, res: Response) {
    try {
        const pages = await getPageVisibilityMap();
        res.json({ pages });
    } catch (error) {
        console.error("[visibility] public read error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Admin — full state including section visibility, used by the Visibility
// admin page to render all toggles.
export async function getAdminVisibilityController(_req: Request, res: Response) {
    try {
        const data = await getAdminVisibility();
        res.json(data);
    } catch (error) {
        console.error("[visibility] admin read error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function setPageVisibilityController(req: Request, res: Response) {
    console.log("[visibility] PUT /page hit. body=", JSON.stringify(req.body));
    const parsed = togglePageSchema.safeParse(req.body);
    if (!parsed.success) {
        console.error("[visibility] page validation failed:", JSON.stringify(parsed.error.format()));
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        const saved = await setPageVisibility(parsed.data.key, parsed.data.visible);
        console.log("[visibility] page upsert ok:", saved.key, "value=", JSON.stringify(saved.value));
        res.json({ key: parsed.data.key, visible: parsed.data.visible });
    } catch (error) {
        console.error("[visibility] page write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function setSectionVisibilityController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    console.log("[visibility] PUT /section/:id hit. id=", id, "body=", JSON.stringify(req.body));
    const parsed = toggleSectionSchema.safeParse(req.body);
    if (!parsed.success) {
        console.error("[visibility] section validation failed:", JSON.stringify(parsed.error.format()));
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        const updated = await setSectionVisibility(id, parsed.data.visible);
        console.log("[visibility] section update ok:", updated.id, "visible=", updated.visible);
        res.json({ id: updated.id, visible: updated.visible });
    } catch (error: any) {
        if (error?.code === "P2025") {
            return res.status(404).json({ message: "Section not found" });
        }
        console.error("[visibility] section write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

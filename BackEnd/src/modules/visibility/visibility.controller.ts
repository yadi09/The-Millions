import { Request, Response } from "express";
import {
    getPageVisibilityMap,
    setPageVisibility,
    getAdminVisibility,
    setSectionVisibility,
    getSiteMaintenance,
    setSiteMaintenance,
} from "./visibility.service.js";
import { togglePageSchema, toggleSectionSchema, toggleMaintenanceSchema } from "./visibility.validation.js";

// Public — used by the frontend route gates to decide whether to render
// a page or fall back to the ComingSoon screen. Includes the site-wide
// maintenance flag so the MaintenanceGate can short-circuit the entire
// public layout in one place.
export async function getPublicVisibilityController(_req: Request, res: Response) {
    try {
        const [pages, maintenance] = await Promise.all([
            getPageVisibilityMap(),
            getSiteMaintenance(),
        ]);
        res.json({ pages, maintenance });
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
    const parsed = togglePageSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        await setPageVisibility(parsed.data.key, parsed.data.visible);
        res.json({ key: parsed.data.key, visible: parsed.data.visible });
    } catch (error) {
        console.error("[visibility] page write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function setMaintenanceController(req: Request, res: Response) {
    const parsed = toggleMaintenanceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        await setSiteMaintenance(parsed.data.on);
        res.json({ on: parsed.data.on });
    } catch (error) {
        console.error("[visibility] maintenance write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function setSectionVisibilityController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const parsed = toggleSectionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        const updated = await setSectionVisibility(id, parsed.data.visible);
        res.json({ id: updated.id, visible: updated.visible });
    } catch (error: any) {
        if (error?.code === "P2025") {
            return res.status(404).json({ message: "Section not found" });
        }
        console.error("[visibility] section write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

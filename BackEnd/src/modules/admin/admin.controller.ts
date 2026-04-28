import { Request, Response } from "express";
import { createPage, updatePage, deletePage } from "./admin.service.js";
import { createPageSchema, updatePageSchema } from "./admin.validation.js";

export async function createPageController(req: Request, res: Response) {
    const validation = createPageSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ message: "Validation error", errors: validation.error.format() });
    }

    try {
        const page = await createPage(validation.data);
        res.status(201).json(page);
    } catch (error: any) {
        if (error.code === "P2002") {
            res.status(409).json({ message: "Slug already exists" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function updatePageController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const validation = updatePageSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ message: "Validation error", errors: validation.error.format() });
    }

    try {
        const page = await updatePage(id, validation.data);
        if (!page) {
            res.status(404).json({ message: "Page not found" });
        } else {
            res.json(page);
        }
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "Page not found" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function deletePageController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
        await deletePage(id);
        res.json({ message: "Page deleted successfully" });
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "Page not found" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
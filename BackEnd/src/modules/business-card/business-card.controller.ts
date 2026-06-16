import { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { getMyCard, upsertMyCard } from "./business-card.service.js";
import { upsertBusinessCardSchema } from "./business-card.validation.js";

export async function getMyCardController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        const card = await getMyCard(userId);
        // Null = user hasn't built one yet. Return 204 so the client can
        // distinguish "no card" from network errors without parsing a body.
        if (!card) return res.status(204).end();
        res.json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function upsertMyCardController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = upsertBusinessCardSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }

    try {
        const card = await upsertMyCard(userId, parsed.data);
        res.json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

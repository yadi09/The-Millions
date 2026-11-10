import { Router, type Request, type Response } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { openingHoursSchema } from "./opening-hours.validation.js";
import { getOpeningHours, setOpeningHours } from "./opening-hours.service.js";

/**
 * @swagger
 * /api/opening-hours:
 *   get:
 *     tags: [Opening Hours]
 *     summary: Public opening hours (weekly schedule, note, special dates)
 * /api/admin/opening-hours:
 *   put:
 *     tags: [Opening Hours]
 *     summary: Replace opening hours (admin)
 *     security:
 *       - bearerAuth: []
 */

export const publicOpeningHoursRouter = Router();
publicOpeningHoursRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.json(await getOpeningHours());
    } catch (error) {
        console.error("[opening-hours] read error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const adminOpeningHoursRouter = Router();
adminOpeningHoursRouter.use(authenticate);
adminOpeningHoursRouter.put("/", async (req: Request, res: Response) => {
    const parsed = openingHoursSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation error",
            error: parsed.error.issues[0]?.message ?? "Invalid opening hours",
        });
    }
    try {
        res.json(await setOpeningHours(parsed.data));
    } catch (error) {
        console.error("[opening-hours] write error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

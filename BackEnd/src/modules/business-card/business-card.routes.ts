import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getMyCardController, upsertMyCardController } from "./business-card.controller.js";

/**
 * @swagger
 * tags:
 *   name: BusinessCard
 *   description: Per-user business-card data (one card per admin user)
 */
const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/business-card/me:
 *   get:
 *     tags: [BusinessCard]
 *     summary: Get the authenticated user's business card
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Card returned }
 *       204: { description: No card created yet }
 *       401: { description: Unauthorized }
 *   put:
 *     tags: [BusinessCard]
 *     summary: Create or update the authenticated user's business card
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Card upserted }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.get("/me", getMyCardController);
router.put("/me", upsertMyCardController);

export default router;

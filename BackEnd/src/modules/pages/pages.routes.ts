import { Router } from "express";
import { getPage } from "./pages.controller.js";

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Page management
 */

/**
 * @swagger
 * /api/pages/{slug}:
 *   get:
 *     tags: [Pages]
 *     summary: Get page content by slug
 *     description: Retrieves a page with all its sections and footer content
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug (home, about, services, contact)
 *     responses:
 *       200:
 *         description: Page content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 title:
 *                   type: string
 *                 sections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Section'
 *                 footer:
 *                   $ref: '#/components/schemas/Footer'
 *       404:
 *         description: Page not found
 *       500:
 *         description: Server error
 */
const router = Router();

router.get("/:slug", getPage);

export default router;

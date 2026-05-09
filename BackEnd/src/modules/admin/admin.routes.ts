import { Router } from "express";
import {
    createPageController,
    updatePageController,
    deletePageController,
} from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes
 */

/**
 * @swagger
 * /api/admin/pages:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new page
 *     description: Creates a new page with sections and content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *               title:
 *                 type: string
 *               sections:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Section'
 *     responses:
 *       201:
 *         description: Page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/pages/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update an existing page
 *     description: Updates a page by ID with new content
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *               title:
 *                 type: string
 *               sections:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Section'
 *     responses:
 *       200:
 *         description: Page updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/pages/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a page
 *     description: Deletes a page by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Page ID
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 */
const router = Router();

router.use(authenticate);

router.post("/pages", createPageController);
router.put("/pages/:id", updatePageController);
router.delete("/pages/:id", deletePageController);

export default router;

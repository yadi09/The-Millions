import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { getAdminSettings, updateAdminSetting } from './settings.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes
 */

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all admin settings
 *     description: Returns all admin settings grouped by category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Setting'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/settings/{key}:
 *   put:
 *     tags: [Admin]
 *     summary: Update an admin setting
 *     description: Updates the value of a specific setting by its key
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key of the setting to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SettingUpdate'
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Setting not found
 *       500:
 *         description: Internal server error
 */
const router = Router();

// GET /api/admin/settings - Fetch all admin settings
router.get('/', authenticate, getAdminSettings);

// PUT /api/admin/settings/:key - Update a specific setting
router.put('/:key', authenticate, updateAdminSetting);

export default router;
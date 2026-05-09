import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getAdminDashboard } from './dashboard.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard widgets
 *     description: Returns the configuration for dashboard widgets in the admin panel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard widgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Widget'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
const router = Router();

// GET /api/admin/dashboard - Fetch admin dashboard widgets
router.get('/', authenticate, getAdminDashboard);

export default router;
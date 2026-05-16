import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { getAdminSidebar } from './sidebar.controller.js';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes
 */

/**
 * @swagger
 * /api/admin/sidebar:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin sidebar configuration
 *     description: Returns the sidebar navigation structure for the admin panel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sidebar configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SidebarItem'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
const router = Router();

// GET /api/admin/sidebar - Fetch admin sidebar configuration
router.get('/', authenticate, getAdminSidebar);

export default router;
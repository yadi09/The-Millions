import { Router } from 'express';
import { getFooter, updateFooterController } from './footer.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Footer
 *   description: Footer management
 */

/**
 * @swagger
 * /api/footer:
 *   get:
 *     tags: [Footer]
 *     summary: Get global footer
 *     description: Returns the global footer configuration
 *     responses:
 *       200:
 *         description: Footer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/footer/{slug}:
 *   get:
 *     tags: [Footer]
 *     summary: Get global footer (slug ignored)
 *     description: Returns the global footer configuration (slug parameter is ignored)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug parameter (ignored, returns global footer anyway)
 *     responses:
 *       200:
 *         description: Footer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/footer:
 *   put:
 *     tags: [Footer]
 *     summary: Update global footer
 *     description: Updates the global footer configuration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Footer'
 *     responses:
 *       200:
 *         description: Footer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/footer/{slug}:
 *   put:
 *     tags: [Footer]
 *     summary: Update global footer (slug ignored)
 *     description: Updates the global footer configuration (slug parameter is ignored)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug parameter (ignored, updates global footer anyway)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Footer'
 *     responses:
 *       200:
 *         description: Footer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */
const router = Router();

// GET /api/footer - Fetch global footer
router.get('/', getFooter);
// GET /api/footer/:slug - Fetch global footer (slug ignored)
router.get('/:slug', getFooter);

// PUT /api/footer - Update global footer
router.put('/', authenticate, updateFooterController);
// PUT /api/footer/:slug - Update global footer (slug ignored)
router.put('/:slug', authenticate, updateFooterController);

export default router;
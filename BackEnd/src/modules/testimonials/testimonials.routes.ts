import { Router } from 'express';
import { getTestimonials } from './testimonials.controller.js';

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonials management
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get all testimonials
 *     description: Returns a list of all testimonials
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 *       404:
 *         description: Testimonials not found
 *       500:
 *         description: Internal server error
 */
const router = Router();

router.get('/', getTestimonials);

export default router;

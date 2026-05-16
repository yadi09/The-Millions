// backend/src/modules/contact/contact.routes.ts
import { Router } from 'express';
import { submitContactForm } from './contact.controller.js';
import { contactRateLimiter } from '../../middlewares/rateLimit.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form submission
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact form
 *     description: Submits a new contact form message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const router = Router();

router.post('/', contactRateLimiter, submitContactForm);

export default router;
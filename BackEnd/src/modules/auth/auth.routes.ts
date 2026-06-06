import { Router } from "express";
import { login, changePasswordController, changeEmailController } from "./auth.controller.js";
import { loginRateLimiter } from "../../middlewares/rateLimit.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     description: Authenticates an admin user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
const router = Router();

router.post("/login", loginRateLimiter, login);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change the authenticated admin's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 12
 *     responses:
 *       200: { description: Password updated }
 *       400: { description: Validation error }
 *       401: { description: Current password incorrect or token invalid }
 */
router.post("/change-password", authenticate, changePasswordController);

/**
 * @swagger
 * /api/auth/change-email:
 *   post:
 *     tags: [Auth]
 *     summary: Change the authenticated admin's email
 *     description: Returns a fresh JWT bound to the new email.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email updated; new token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     email: { type: string }
 *       400: { description: Validation error }
 *       401: { description: Current password incorrect or token invalid }
 *       409: { description: Email already in use }
 */
router.post("/change-email", authenticate, changeEmailController);

export default router;

// backend/src/modules/health/health.routes.ts
import { Router, Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Returns the health status of the backend (does not query database)
 *     responses:
 *       200:
 *         description: Backend is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Uptime in seconds
 *                 message:
 *                   type: string
 *                   example: Backend is running smoothly
 *       500:
 *         description: Internal server error
 */
const router = Router();

router.get('/', (req: Request, res: Response) => {
  // ✅ NO DATABASE QUERY - critical for Neon free tier!
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Backend is running smoothly',
    // Removed database connectivity check
  });
});

export default router;
// backend/src/modules/health/health.routes.ts
import { Router, Request, Response } from 'express';

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
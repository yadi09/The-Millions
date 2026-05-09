import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getAdminDashboard } from './dashboard.controller.js';

const router = Router();

// GET /api/admin/dashboard - Fetch admin dashboard widgets
router.get('/', authenticate, getAdminDashboard);

export default router;
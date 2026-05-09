import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getAdminSidebar } from './sidebar.controller.js';

const router = Router();

// GET /api/admin/sidebar - Fetch admin sidebar configuration
router.get('/', authenticate, getAdminSidebar);

export default router;
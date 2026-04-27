import { Router } from 'express';
import { getFooter, updateFooterController } from './footer.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

// GET /api/footer - Fetch global footer
router.get('/', getFooter);

// PUT /api/footer - Update global footer
router.put('/', authenticate, updateFooterController);

export default router;
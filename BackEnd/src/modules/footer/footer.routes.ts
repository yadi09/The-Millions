import { Router } from 'express';
import { getFooter, updateFooterController } from './footer.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

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
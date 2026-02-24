// backend/src/modules/footer/footer.routes.ts
import { Router } from 'express';
// ✅ IMPORT THE RENAMED CONTROLLER FUNCTION
import { getFooter, updateFooterController } from './footer.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:slug', getFooter);
router.put('/:slug', authenticate, updateFooterController); // ✅ USE RENAMED FUNCTION

export default router;
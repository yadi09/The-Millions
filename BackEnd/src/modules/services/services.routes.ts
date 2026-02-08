import { Router } from 'express';
import { getServices, createService } from './services.controller.js';

const router = Router();

router.get('/', getServices);
router.post('/', createService);

export default router;

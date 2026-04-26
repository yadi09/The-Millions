import { Router } from 'express';
import { getTestimonials } from './testimonials.controller.js';

const router = Router();

router.get('/', getTestimonials);

export default router;

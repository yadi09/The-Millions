import { Router } from 'express';
import { submitContactForm } from './contact.controller.js';

const router = Router();

router.post('/', submitContactForm);

export default router;

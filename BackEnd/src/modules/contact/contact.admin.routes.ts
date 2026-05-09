import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getContactMessages, updateContactMessageStatus } from './contact.admin.controller.js';

const router = Router();

// GET /api/admin/contact-messages - Fetch contact messages with filtering and pagination
router.get('/', authenticate, getContactMessages);

// PUT /api/admin/contact-messages/:id/status - Update contact message status
router.put('/:id/status', authenticate, updateContactMessageStatus);

export default router;
import { Router } from 'express';
import { getBlogs, getBlog, getCategories } from './blog.controller.js';

const router = Router();

router.get('/', getBlogs);                    // GET /api/blogs
router.get('/categories', getCategories);     // GET /api/blogs/categories
router.get('/:slug', getBlog);                // GET /api/blogs/:slug

export default router;
import { Router } from 'express';
import {
    createBlogController,
    updateBlogController,
    deleteBlogController,
    getAllBlogsController,
    getBlogByIdController
} from './admin.blog.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllBlogsController);           // GET /api/admin/blogs
router.get('/:id', getBlogByIdController);        // GET /api/admin/blogs/:id
router.post('/', createBlogController);           // POST /api/admin/blogs
router.put('/:id', updateBlogController);         // PUT /api/admin/blogs/:id
router.delete('/:id', deleteBlogController);      // DELETE /api/admin/blogs/:id

export default router;
import { Router } from 'express';
import {
    createBlogController,
    updateBlogController,
    deleteBlogController,
    getAllBlogsController,
    getBlogByIdController
} from './admin.blog.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /api/admin/blogs:
 *   get:
 *     tags: [Blog]
 *     summary: Get all blog posts (admin)
 *     description: Returns a list of all blog posts (including drafts) for admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   get:
 *     tags: [Blog]
 *     summary: Get blog post by ID (admin)
 *     description: Returns a single blog post by its ID (including drafts) for admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/blogs:
 *   post:
 *     tags: [Blog]
 *     summary: Create a new blog post (admin)
 *     description: Creates a new blog post for admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               author:
 *                 type: string
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   put:
 *     tags: [Blog]
 *     summary: Update blog post by ID (admin)
 *     description: Updates a blog post by its ID for admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               author:
 *                 type: string
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   delete:
 *     tags: [Blog]
 *     summary: Delete blog post by ID (admin)
 *     description: Deletes a blog post by its ID for admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
const router = Router();

router.use(authenticate);

router.get('/', getAllBlogsController);           // GET /api/admin/blogs
router.get('/:id', getBlogByIdController);        // GET /api/admin/blogs/:id
router.post('/', createBlogController);           // POST /api/admin/blogs
router.put('/:id', updateBlogController);         // PUT /api/admin/blogs/:id
router.delete('/:id', deleteBlogController);      // DELETE /api/admin/blogs/:id

export default router;
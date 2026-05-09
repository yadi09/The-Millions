import { Router } from 'express';
import { getBlogs, getBlog, getCategories } from './blog.controller.js';

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     tags: [Blog]
 *     summary: Get all blog posts
 *     description: Returns a list of blog posts (published and drafts, depending on auth)
 *     responses:
 *       200:
 *         description: Blog posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     tags: [Blog]
 *     summary: Create a new blog post
 *     description: Creates a new blog post
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
 * /api/blogs/categories:
 *   get:
 *     tags: [Blog]
 *     summary: Get all blog categories
 *     description: Returns a list of unique categories used in blog posts
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/{slug}:
 *   get:
 *     tags: [Blog]
 *     summary: Get blog post by slug
 *     description: Returns a single blog post by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/{slug}:
 *   put:
 *     tags: [Blog]
 *     summary: Update blog post by slug
 *     description: Updates a blog post by its slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
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
 * /api/blogs/{slug}:
 *   delete:
 *     tags: [Blog]
 *     summary: Delete blog post by slug
 *     description: Deletes a blog post by its slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
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

router.get('/', getBlogs);                    // GET /api/blogs
router.get('/categories', getCategories);     // GET /api/blogs/categories
router.get('/:slug', getBlog);                // GET /api/blogs/:slug

export default router;
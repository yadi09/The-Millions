// backend/src/modules/upload/upload.routes.ts
import { Router, Request, Response } from 'express';
import { uploadImage } from './upload.controller.js';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload endpoints
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload an image
 *     description: Uploads an image file and returns the URL
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional folder path (e.g., pages/home/team)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/image.png
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.use(authenticate);
router.post('/', upload.single('image'), uploadImage);

export default router;
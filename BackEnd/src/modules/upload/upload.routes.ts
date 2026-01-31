// backend/src/modules/upload/upload.routes.ts
import { Router, Request, Response } from 'express';
import { uploadImage } from './upload.controller.js';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth.middleware.js';

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
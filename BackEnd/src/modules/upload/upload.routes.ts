import { Router } from 'express';
import { uploadImage } from './upload.controller.js';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
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
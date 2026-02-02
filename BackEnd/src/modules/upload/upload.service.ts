// backend/src/modules/upload/upload.service.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveImage(file: Express.Multer.File): Promise<string> {
    try {
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;

        // FIX: Add 'data:' prefix for proper base64 format
        const base64DataUri = `data:${mimeType};base64,${base64Image}`;

        const result = await cloudinary.uploader.upload(
            base64DataUri,  // ✅ Correct format
            {
                folder: 'blog-covers',
                resource_type: 'auto',
                public_id: file.originalname.split('.')[0],
                overwrite: false,
            }
        );

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}
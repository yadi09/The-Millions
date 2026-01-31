// backend/src/modules/upload/upload.service.ts
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveImage(file: Express.Multer.File): Promise<string> {
    try {
        // Convert buffer to base64 string
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
            `${mimeType};base64,${base64Image}`,
            {
                folder: 'blog-covers',
                resource_type: 'auto',
                public_id: file.originalname.split('.')[0], // Optional: use original filename
                overwrite: false,
            }
        );

        // Return the secure CDN URL
        return result.secure_url;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}
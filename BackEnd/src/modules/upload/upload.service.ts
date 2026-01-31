// upload.service.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'blog-covers',
                resource_type: 'auto',
            },
            // Fixed: error can be undefined, not null
            (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        // Create stream from buffer without streamifier
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null); // End the stream

        bufferStream.pipe(uploadStream);
    });
}
import { Request, Response } from 'express';
import { saveImage } from './upload.service.js';

export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const url = await saveImage(req.file);

        res.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}
// backend/src/modules/upload/upload.controller.ts
import { Request, Response } from 'express';
import { saveImage } from './upload.service.js';

// Extend Request type to include multer's file property
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export async function uploadImage(req: MulterRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get folder from query params (e.g., ?folder=pages/home/team)
    const folder = (req.query.folder as string) || 'uploads';
    
    const url = await saveImage(req.file, folder);
    res.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
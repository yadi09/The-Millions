// backend/src/modules/upload/upload.controller.ts
import { Request, Response } from 'express';
import { saveImage } from './upload.service.js';

export async function uploadImage(req: Request, res: Response) {
  // Safe type assertion: multer adds req.file BEFORE this controller runs
  const file = req.file as Express.Multer.File | undefined;
  
  try {
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get folder from query params (e.g., ?folder=pages/home/team)
    const folder = (req.query.folder as string) || 'uploads';
    
    const url = await saveImage(file, folder);
    res.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
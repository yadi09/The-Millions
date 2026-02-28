// backend/src/modules/footer/footer.controller.ts
import { Request, Response } from 'express';
import { getFooterByPage, updateFooter } from './footer.service.js';

export async function getFooter(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    
    if (!slug) {
      return res.status(400).json({ error: 'Page slug is required' });
    }

    const page = await getFooterByPage(slug);
    
    if (!page || !page.footer) {
      return res.status(404).json({ error: 'Footer not found' });
    }
    
    res.json(page.footer);
  } catch (error) {
    console.error('Error fetching footer:', error);
    res.status(500).json({ error: 'Failed to fetch footer' });
  }
}

// ✅ CORRECT: Renamed controller function to avoid conflict
export async function updateFooterController(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    
    if (!slug) {
      return res.status(400).json({ error: 'Page slug is required' });
    }

    const footerData = req.body;
    
    const updatedFooter = await updateFooter(slug, footerData);
    res.json(updatedFooter);
  } catch (error: any) {
    console.error('Error updating footer:', error);
    
    if (error.message === "Page not found") {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.status(500).json({ error: 'Failed to update footer' });
  }
}
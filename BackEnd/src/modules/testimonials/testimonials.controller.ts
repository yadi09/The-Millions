import { Request, Response } from 'express';
import { getTestimonialsData } from './testimonials.service.js';

export async function getTestimonials(req: Request, res: Response) {
  try {
    const testimonials = await getTestimonialsData();
    
    if (!testimonials) {
      return res.status(404).json({ error: 'Testimonials not found' });
    }
    
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}

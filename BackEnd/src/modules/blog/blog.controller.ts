import { Request, Response } from 'express';
import {
    getAllPublishedBlogs,
    getBlogBySlug,
    getBlogCategories
} from './blog.service.js';

export async function getBlogs(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getAllPublishedBlogs(page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
}

export async function getBlog(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        // FIX: Cast slug to string
        const blog = await getBlogBySlug(slug as string);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
}

export async function getCategories(req: Request, res: Response) {
    try {
        const categories = await getBlogCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}
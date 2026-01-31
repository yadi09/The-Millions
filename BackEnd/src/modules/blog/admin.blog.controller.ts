import { Request, Response } from 'express';
import {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllBlogPosts,
    getBlogPostById
} from './admin.blog.service.js';
import { createBlogPostSchema, updateBlogPostSchema } from './blog.validation.js';

export async function createBlogController(req: Request, res: Response) {
    const validation = createBlogPostSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.format()
        });
    }

    try {
        const blog = await createBlogPost(validation.data);
        res.status(201).json(blog);
    } catch (error: any) {
        if (error.code === "P2002") {
            res.status(409).json({ message: "Slug already exists" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function updateBlogController(req: Request, res: Response) {
    const { id } = req.params;
    const validation = updateBlogPostSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.format()
        });
    }

    try {
        const blog = await updateBlogPost(id, validation.data);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.json(blog);
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "Blog post not found" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function deleteBlogController(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await deleteBlogPost(id);
        res.json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ message: "Blog post not found" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function getAllBlogsController(req: Request, res: Response) {
    try {
        const blogs = await getAllBlogPosts();
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getBlogByIdController(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const blog = await getBlogPostById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import { z } from 'zod';

// For public queries (pagination)
export const blogQuerySchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
});

// For admin operations
export const createBlogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
    category: z.string().min(1, "Category is required"),
    coverImage: z.string().url().optional().or(z.literal('')),
    excerpt: z.string().min(1, "Excerpt is required").max(255, "Excerpt too long"),
    content: z.string().min(1, "Content is required"),
    status: z.enum(['DRAFT', 'PUBLISHED']),
    author: z.string().min(1, "Author is required"),
    publishedAt: z.string().datetime().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
    slug: z.string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
        .optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});
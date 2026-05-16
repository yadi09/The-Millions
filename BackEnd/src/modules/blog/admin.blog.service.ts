import { prisma } from "../../lib/prisma.js";
import { sanitizeHtmlContent } from "../../utils/sanitize.js";

export async function createBlogPost(data: any) {
    // Sanitize HTML content
    const sanitizedContent = sanitizeHtmlContent(data.content);

    return prisma.blogPost.create({
        data: {
            ...data,
            content: sanitizedContent,
            publishedAt: data.status === 'PUBLISHED' && !data.publishedAt
                ? new Date()
                : data.publishedAt,
        },
    });
}

export async function updateBlogPost(id: string, data: any) {
    // FIXED: Changed sanitizeHtml → sanitizeHtmlContent
    const sanitizedContent = sanitizeHtmlContent(data.content);

    return prisma.blogPost.update({
        where: { id },
        data: {
            ...data,
            content: sanitizedContent,
            publishedAt: data.status === 'PUBLISHED' && !data.publishedAt
                ? new Date()
                : data.publishedAt,
        },
    });
}

export async function deleteBlogPost(id: string) {
    return prisma.blogPost.delete({
        where: { id },
    });
}

export async function getAllBlogPosts() {
    return prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function getBlogPostById(id: string) {
    return prisma.blogPost.findUnique({
        where: { id },
    });
}
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllPublishedBlogs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
        prisma.blogPost.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.blogPost.count({ where: { status: 'PUBLISHED' } })
    ]);

    return {
        blogs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    };
}

export async function getBlogBySlug(slug: string) {
    return prisma.blogPost.findFirst({
        where: {
            slug,
            status: 'PUBLISHED'
        }
    });
}

export async function getBlogCategories() {
    const categories = await prisma.blogPost.groupBy({
        by: ['category'],
        where: { status: 'PUBLISHED' },
        _count: true,
    });

    return categories.map(c => c.category);
}
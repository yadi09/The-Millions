export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    coverImage?: string;
    excerpt: string;
    content: string;
    status: 'DRAFT' | 'PUBLISHED';
    author: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
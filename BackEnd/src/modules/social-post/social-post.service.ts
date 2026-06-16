import { prisma } from "../../lib/prisma.js";
import type { UpsertSocialPostInput } from "./social-post.validation.js";

export async function listMyPosts(userId: string) {
    return prisma.socialPost.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
    });
}

export async function getMyPost(userId: string, id: string) {
    return prisma.socialPost.findFirst({ where: { id, userId } });
}

export async function upsertMyPost(userId: string, data: UpsertSocialPostInput) {
    const { id, ...rest } = data;
    const payload = {
        templateType: rest.templateType,
        platform: rest.platform,
        content: rest.content as any,
        imageUrl: rest.imageUrl,
        title: rest.title,
    };

    if (id) {
        // Update only if the post belongs to the user — otherwise create new
        // (treat the unknown id as "this isn't mine, give me a new row").
        const existing = await prisma.socialPost.findFirst({ where: { id, userId } });
        if (existing) {
            return prisma.socialPost.update({
                where: { id },
                data: payload,
            });
        }
    }
    return prisma.socialPost.create({
        data: { userId, ...payload },
    });
}

export async function deleteMyPost(userId: string, id: string): Promise<boolean> {
    const existing = await prisma.socialPost.findFirst({ where: { id, userId } });
    if (!existing) return false;
    await prisma.socialPost.delete({ where: { id } });
    return true;
}

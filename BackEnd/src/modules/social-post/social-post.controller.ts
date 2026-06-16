import { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { listMyPosts, getMyPost, upsertMyPost, deleteMyPost } from "./social-post.service.js";
import { upsertSocialPostSchema } from "./social-post.validation.js";

export async function listMyPostsController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
        const posts = await listMyPosts(userId);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyPostController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params as { id: string };
    try {
        const post = await getMyPost(userId, id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function upsertMyPostController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const parsed = upsertSocialPostSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        const post = await upsertMyPost(userId, parsed.data);
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteMyPostController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params as { id: string };
    try {
        const ok = await deleteMyPost(userId, id);
        if (!ok) return res.status(404).json({ message: "Post not found" });
        res.json({ id, deleted: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
    listMyPostsController,
    getMyPostController,
    upsertMyPostController,
    deleteMyPostController,
} from "./social-post.controller.js";

/**
 * @swagger
 * tags:
 *   name: SocialPost
 *   description: Per-user social media post drafts
 */
const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/social-posts:
 *   get:
 *     tags: [SocialPost]
 *     summary: List the authenticated user's social-post drafts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Array of posts ordered by most recently updated }
 *   post:
 *     tags: [SocialPost]
 *     summary: Create or update a social-post draft (pass `id` to update)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Created/updated post }
 *
 * /api/social-posts/{id}:
 *   get:
 *     tags: [SocialPost]
 *     summary: Fetch one of the user's drafts
 *     responses:
 *       200: { description: Post returned }
 *       404: { description: Not found }
 *   delete:
 *     tags: [SocialPost]
 *     summary: Delete one of the user's drafts
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.get("/", listMyPostsController);
router.post("/", upsertMyPostController);
router.get("/:id", getMyPostController);
router.delete("/:id", deleteMyPostController);

export default router;

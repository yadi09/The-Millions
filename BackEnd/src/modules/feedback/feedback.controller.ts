import { Request, Response } from "express";
import { createSubmission, listSubmissions, getSubmission, deleteSubmission } from "./feedback.service.js";
import { submitFeedbackSchema } from "./feedback.validation.js";

// Public — anyone with the obscure walkthrough URL can submit. We don't gate
// this because the firm owners' feedback shouldn't require them to log in.
// Rate limit could be added later if abuse becomes a concern.
export async function submitFeedbackController(req: Request, res: Response) {
    const parsed = submitFeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }
    try {
        const submission = await createSubmission(parsed.data);
        res.status(201).json({ id: submission.id, createdAt: submission.createdAt });
    } catch (error) {
        console.error("[feedback] submit error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Admin — list all submissions for the results dashboard.
export async function listFeedbackController(_req: Request, res: Response) {
    try {
        const items = await listSubmissions();
        res.json(items);
    } catch (error) {
        console.error("[feedback] list error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFeedbackController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
        const item = await getSubmission(id);
        if (!item) return res.status(404).json({ message: "Submission not found" });
        res.json(item);
    } catch (error) {
        console.error("[feedback] get error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteFeedbackController(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
        const ok = await deleteSubmission(id);
        if (!ok) return res.status(404).json({ message: "Submission not found" });
        res.json({ id, deleted: true });
    } catch (error) {
        console.error("[feedback] delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

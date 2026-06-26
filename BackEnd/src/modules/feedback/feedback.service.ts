import { prisma } from "../../lib/prisma.js";
import type { SubmitFeedbackInput } from "./feedback.validation.js";

export async function createSubmission(data: SubmitFeedbackInput) {
    return prisma.feedbackSubmission.create({
        data: {
            submittedBy: data.submittedBy,
            overallRating: data.overallRating ?? null,
            overallComment: data.overallComment ?? null,
            responses: data.responses as any,
        },
    });
}

export async function listSubmissions() {
    return prisma.feedbackSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getSubmission(id: string) {
    return prisma.feedbackSubmission.findUnique({ where: { id } });
}

export async function deleteSubmission(id: string): Promise<boolean> {
    const existing = await prisma.feedbackSubmission.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.feedbackSubmission.delete({ where: { id } });
    return true;
}

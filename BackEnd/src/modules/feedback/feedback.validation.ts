import { z } from "zod";

// Per-feature response. Status is one of four states; comment is optional.
const responseSchema = z.object({
    status: z.enum(["worked", "struggled", "broken", "skipped"]),
    comment: z.string().trim().max(2000).optional().nullable().transform((v) => (v ? v : null)),
});

export const submitFeedbackSchema = z.object({
    submittedBy: z.string().trim().min(1, "Name is required").max(120),
    overallRating: z.number().int().min(1).max(5).optional().nullable(),
    overallComment: z.string().trim().max(5000).optional().nullable().transform((v) => (v ? v : null)),
    // Map of featureId → response. Keys are arbitrary strings (the client owns
    // the catalogue) so the backend just stores opaque JSON.
    responses: z.record(z.string(), responseSchema),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;

import { z } from "zod";

// Per-template content shapes. We validate loosely here — the client owns
// rendering and presentation; the backend just stores the JSON.
const tipListContent = z.object({
    headline: z.string().max(120).default(""),
    items: z.array(z.string().max(280)).max(8).default([]),
    cta: z.string().max(80).optional().default(""),
});

const quoteContent = z.object({
    quote: z.string().max(280).default(""),
    attribution: z.string().max(120).optional().default(""),
});

const statContent = z.object({
    number: z.string().max(40).default(""),
    label: z.string().max(140).default(""),
    sublabel: z.string().max(280).optional().default(""),
});

const ContentSchema = z.union([tipListContent, quoteContent, statContent]);

export const upsertSocialPostSchema = z.object({
    id: z.string().uuid().optional(),
    templateType: z.enum(["tip-list", "quote", "stat"]),
    platform: z.enum(["linkedin", "square", "story"]),
    content: ContentSchema,
    imageUrl: z.string().url().optional().nullable().or(z.literal("")).transform((v) => (v ? v : null)),
    title: z.string().max(160).optional().nullable().or(z.literal("")).transform((v) => (v ? v : null)),
});

export type UpsertSocialPostInput = z.infer<typeof upsertSocialPostSchema>;

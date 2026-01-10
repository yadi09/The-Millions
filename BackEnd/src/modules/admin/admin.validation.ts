import { z } from "zod";

export const sectionSchema = z.object({
    type: z.string().min(1),
    order: z.number().int(),
    content: z.any(),
});

export const createPageSchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    sections: z.array(sectionSchema).optional(),
});

export const updatePageSchema = z.object({
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    sections: z.array(sectionSchema).optional(),
});

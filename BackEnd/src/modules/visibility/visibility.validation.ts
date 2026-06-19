import { z } from "zod";

// Keys of pages the brothers can toggle. Hardcoded list — adding a new
// public route is a code change anyway, so this stays in sync.
export const PAGE_KEYS = [
    "home",
    "contact",
    "blog",
    "testimonials",
    "submit-testimonial",
] as const;

export const pageKeySchema = z.enum(PAGE_KEYS);

export const togglePageSchema = z.object({
    key: pageKeySchema,
    visible: z.boolean(),
});

export const toggleSectionSchema = z.object({
    visible: z.boolean(),
});

export const toggleMaintenanceSchema = z.object({
    on: z.boolean(),
});

export type PageKey = z.infer<typeof pageKeySchema>;

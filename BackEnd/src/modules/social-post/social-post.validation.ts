import { z } from "zod";

// Normalize "" / null / undefined to null before validating downstream.
// The previous chained .optional().nullable().or("") form misbehaved in
// some zod paths, so we preprocess upfront and keep the downstream
// schema simple.
const nullableString = (max: number) =>
    z.preprocess(
        (v) => (v === "" || v === undefined || v === null ? null : v),
        z.string().max(max).nullable()
    );

const nullableUrl = z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? null : v),
    z.string().url().nullable()
);

// Backend doesn't render the post — frontend owns presentation. Store the
// content blob as opaque JSON so adding a field on the client (e.g. the
// new categoryTag) doesn't require a backend redeploy and doesn't risk
// the discriminated-union behaviour where one shape silently strips the
// others' fields.
const ContentSchema = z.record(z.string(), z.unknown());

export const upsertSocialPostSchema = z.object({
    id: z.string().uuid().optional(),
    templateType: z.enum(["tip-list", "quote", "stat"]),
    platform: z.enum(["linkedin", "square", "story"]),
    content: ContentSchema,
    imageUrl: nullableUrl,
    title: nullableString(160),
});

export type UpsertSocialPostInput = z.infer<typeof upsertSocialPostSchema>;

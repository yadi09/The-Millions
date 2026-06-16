import { z } from "zod";

const optTrim = z.string().trim().max(200).optional().nullable().transform((v) => v ?? undefined);
const optEmail = z.string().trim().toLowerCase().email().optional().nullable().or(z.literal("")).transform((v) => (v ? v : undefined));

export const upsertBusinessCardSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    title: optTrim,
    tagline: optTrim,
    email: optEmail,
    phoneMobile: optTrim,
    phoneOffice: optTrim,
    website: optTrim,
    address: z.array(z.string().trim().max(200)).max(5).optional().default([]),
    template: z.enum(["minimal", "luxe", "modern"]).default("minimal"),
    showQrCode: z.boolean().default(true),
});

export type UpsertBusinessCardInput = z.infer<typeof upsertBusinessCardSchema>;

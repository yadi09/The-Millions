import { z } from "zod";

// Submit validation — public-facing, so we're strict about lengths.
export const submitTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(160),
  role: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  category: z.string().min(1).max(120),
  content: z.string().min(20).max(2000),
  results: z.string().max(200).optional(),
  location: z.string().max(120).optional(),
  videoTestimonial: z.boolean().optional(),
  // Image may arrive as a base64 data URI from the submission form. Optional.
  // We validate the data: scheme but not byte length here — the upload service
  // applies size limits via Cloudinary's response.
  image: z
    .string()
    .regex(/^data:image\/(jpe?g|png|webp);base64,/i, "Image must be a JPEG, PNG, or WebP data URI.")
    .optional(),
});

export type SubmitTestimonialInput = z.infer<typeof submitTestimonialSchema>;

// Admin update — narrow to mutation surface (status, order, optional content fix).
export const updateTestimonialSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  order: z.number().int().min(0).max(9999).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  name: z.string().min(2).max(100).optional(),
  role: z.string().min(2).max(100).optional(),
  company: z.string().min(2).max(100).optional(),
  category: z.string().min(1).max(120).optional(),
  content: z.string().min(20).max(2000).optional(),
  results: z.string().max(200).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  image: z.string().url().nullable().optional(),
});

export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

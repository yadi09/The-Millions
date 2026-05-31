import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import type { SubmitTestimonialInput, UpdateTestimonialInput } from "./testimonials.validation.js";

// Cloudinary config — same setup as upload.service.ts. Reusing here so we
// can accept a base64 image from an unauthenticated submission without
// exposing the auth-gated /admin/upload endpoint to the public.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function uploadTestimonialImage(dataUri: string): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "testimonials",
    resource_type: "image",
    // Cap dimensions so a 4K headshot doesn't bloat the page.
    transformation: [{ width: 400, height: 400, crop: "limit", quality: "auto" }],
  });
  return result.secure_url;
}

/** Public list — APPROVED only, featured-first (order DESC), newest fallback. */
export async function listApprovedTestimonials() {
  return prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ order: "desc" }, { createdAt: "desc" }],
  });
}

/** Admin list — every status, newest first. */
export async function listAllTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function submitTestimonial(data: SubmitTestimonialInput) {
  let imageUrl: string | undefined;
  if (data.image) {
    try {
      imageUrl = await uploadTestimonialImage(data.image);
    } catch (err) {
      // Don't block the submission if the image upload fails — admins can add
      // an image later via the admin moderation panel. Log for debugging.
      console.warn("Testimonial image upload failed:", err);
    }
  }

  return prisma.testimonial.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      company: data.company,
      rating: data.rating,
      category: data.category,
      content: data.content,
      results: data.results ?? null,
      location: data.location ?? null,
      videoTestimonial: data.videoTestimonial ?? false,
      image: imageUrl,
      status: "PENDING",
      order: 0,
    },
  });
}

export async function updateTestimonial(id: string, data: UpdateTestimonialInput) {
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.company !== undefined && { company: data.company }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.results !== undefined && { results: data.results }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.image !== undefined && { image: data.image }),
    },
  });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

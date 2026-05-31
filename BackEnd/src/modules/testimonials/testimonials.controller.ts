import { Request, Response } from "express";
import {
  listApprovedTestimonials,
  submitTestimonial,
} from "./testimonials.service.js";
import { submitTestimonialSchema } from "./testimonials.validation.js";

export async function getTestimonials(_req: Request, res: Response) {
  try {
    const testimonials = await listApprovedTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
}

export async function postTestimonial(req: Request, res: Response) {
  const validation = submitTestimonialSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  try {
    const created = await submitTestimonial(validation.data);
    res.status(201).json(created);
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ error: "Failed to submit testimonial" });
  }
}

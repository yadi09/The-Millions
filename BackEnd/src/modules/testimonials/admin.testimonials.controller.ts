import { Request, Response } from "express";
import {
  listAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonials.service.js";
import { updateTestimonialSchema } from "./testimonials.validation.js";

export async function adminListTestimonials(_req: Request, res: Response) {
  try {
    const testimonials = await listAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching admin testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
}

export async function adminUpdateTestimonial(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ error: "Missing testimonial id" });

  const validation = updateTestimonialSchema.safeParse(req.body);
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
    const updated = await updateTestimonial(id, validation.data);
    res.json(updated);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
}

export async function adminDeleteTestimonial(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ error: "Missing testimonial id" });

  try {
    await deleteTestimonial(id);
    res.json({ message: "Testimonial deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
}

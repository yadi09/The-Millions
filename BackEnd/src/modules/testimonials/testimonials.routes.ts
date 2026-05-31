import { Router } from "express";
import { getTestimonials, postTestimonial } from "./testimonials.controller.js";
import { testimonialRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

// Public — list APPROVED testimonials for the marketing page
router.get("/", getTestimonials);

// Public — submit a new testimonial (lands in PENDING for admin moderation).
// Rate-limited to mirror the contact form's spam-protection posture.
router.post("/", testimonialRateLimiter, postTestimonial);

export default router;

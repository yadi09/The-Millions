import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  adminListTestimonials,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from "./admin.testimonials.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", adminListTestimonials);
router.put("/:id", adminUpdateTestimonial);
router.delete("/:id", adminDeleteTestimonial);

export default router;

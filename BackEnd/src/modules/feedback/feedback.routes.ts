import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
    submitFeedbackController,
    listFeedbackController,
    getFeedbackController,
    deleteFeedbackController,
} from "./feedback.controller.js";

// Public — used by the walkthrough form. No auth (the obscure URL is the
// access control). Only accepts POST.
export const publicFeedbackRouter = Router();
publicFeedbackRouter.post("/", submitFeedbackController);

// Admin — list + view + delete submissions for the results dashboard.
export const adminFeedbackRouter = Router();
adminFeedbackRouter.use(authenticate);
adminFeedbackRouter.get("/", listFeedbackController);
adminFeedbackRouter.get("/:id", getFeedbackController);
adminFeedbackRouter.delete("/:id", deleteFeedbackController);

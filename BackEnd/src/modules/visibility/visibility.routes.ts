import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
    getPublicVisibilityController,
    getAdminVisibilityController,
    setPageVisibilityController,
    setSectionVisibilityController,
    setMaintenanceController,
} from "./visibility.controller.js";

/**
 * @swagger
 * tags:
 *   name: Visibility
 *   description: Page + section publish toggles
 */

// Public read — used by the frontend's route gates. Returns just the
// page-level visibility map. No auth needed; the brothers don't consider
// section drafts a security secret, just a presentation control.
export const publicVisibilityRouter = Router();
publicVisibilityRouter.get("/", getPublicVisibilityController);

// Admin — read full state + write toggles. Behind the auth middleware.
export const adminVisibilityRouter = Router();
adminVisibilityRouter.use(authenticate);
adminVisibilityRouter.get("/", getAdminVisibilityController);
adminVisibilityRouter.put("/page", setPageVisibilityController);
adminVisibilityRouter.put("/section/:id", setSectionVisibilityController);
adminVisibilityRouter.put("/maintenance", setMaintenanceController);

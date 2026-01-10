import { Router } from "express";
import {
    createPageController,
    updatePageController,
    deletePageController,
} from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/pages", createPageController);
router.put("/pages/:id", updatePageController);
router.delete("/pages/:id", deletePageController);

export default router;

import { Router } from "express";
import { getPage } from "./pages.controller.js";

const router = Router();

router.get("/:slug", getPage);

export default router;

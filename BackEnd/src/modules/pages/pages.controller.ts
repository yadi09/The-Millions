// backend/src/modules/pages/pages.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { getPageBySlug } from "./pages.service.js";

// Preview mode lets logged-in admins see hidden sections from the public
// endpoint. We don't gate the route with the auth middleware (the public
// site uses this same endpoint), but we DO require a valid JWT to honour
// the ?preview=1 query — otherwise anyone could append it and see drafts.
function isPreviewRequest(req: Request): boolean {
  if (req.query.preview !== "1") return false;
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function getPage(req: Request, res: Response) {
  let { slug } = req.params as { slug: string };

  // Fix route mismatch for about page
  if (slug === "absense") slug = "about";

  const includeHidden = isPreviewRequest(req);
  const page = await getPageBySlug(slug, { includeHidden });

  if (!page) {
    return res.status(404).json({ message: "Page not found" });
  }

  res.json(page);
}

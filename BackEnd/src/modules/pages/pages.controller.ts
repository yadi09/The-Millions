// backend/src/modules/pages/pages.controller.ts
import { Request, Response } from "express";
import { getPageBySlug } from "./pages.service.js";

export async function getPage(req: Request, res: Response) {
  let { slug } = req.params as { slug: string };

  // Fix route mismatch for about page
  if (slug === "absense") slug = "about";

  const page = await getPageBySlug(slug);

  if (!page) {
    return res.status(404).json({ message: "Page not found" });
  }

  res.json(page);
}

import { Request, Response } from "express";
import { getPageBySlug } from "./pages.service.js";

export async function getPage(req: Request, res: Response) {
  const { slug } = req.params;

  const page = await getPageBySlug(slug);

  if (!page) {
    return res.status(404).json({ message: "Page not found" });
  }

  res.json(page);
}

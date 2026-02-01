// backend/src/modules/pages/pages.controller.ts
import { Request, Response } from "express";
import { getPageBySlug } from "./pages.service.js";

export async function getPage(req: Request, res: Response) {
  const { slug } = req.params;

  // FIX: Cast slug to string

  //check it
  const page = await getPageBySlug(slug as string);

  if (!page) {
    return res.status(404).json({ message: "Page not found" });
  }

  res.json(page);
}

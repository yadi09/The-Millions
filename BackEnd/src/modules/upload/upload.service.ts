// backend/src/modules/upload/upload.service.ts
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Cloudinary folder paths are slash-delimited namespaces, not filesystem paths,
// but we still constrain them to avoid surprising hierarchies via user input.
const FOLDER_PATTERN = /^[a-zA-Z0-9_\-/]+$/;
const MAX_FOLDER_LENGTH = 100;

export function sanitizeFolder(input: string | undefined): string {
  if (!input) return "uploads";
  const trimmed = input.replace(/^\/+|\/+$/g, "");
  if (
    trimmed.length === 0 ||
    trimmed.length > MAX_FOLDER_LENGTH ||
    !FOLDER_PATTERN.test(trimmed) ||
    trimmed.includes("..")
  ) {
    return "uploads";
  }
  return trimmed;
}

export async function saveImage(
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> {
  const safeFolder = sanitizeFolder(folder);
  const base64Image = file.buffer.toString("base64");
  const mimeType = file.mimetype;
  const base64DataUri = `data:${mimeType};base64,${base64Image}`;

  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder: safeFolder,
    resource_type: "auto",
    public_id: file.originalname.replace(/\.[^/.]+$/, ""),
    overwrite: false,
  });

  return result.secure_url;
}

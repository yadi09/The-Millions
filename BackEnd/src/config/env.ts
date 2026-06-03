import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.url("DATABASE_URL must be a valid connection URL"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  // Long-lived service token for AI-agent / external integration platforms
  // (e.g. WhatsApp bot) hitting POST /api/agent/leads. Authenticate via
  // X-API-Key header. Rotate by editing deploy/.env and restarting backend.
  AGENT_API_KEY: z
    .string()
    .min(32, "AGENT_API_KEY must be at least 32 characters"),

  CORS_ORIGINS: z
    .string()
    .min(1, "CORS_ORIGINS is required (comma-separated origin list)")
    .transform((s) =>
      s
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
    ),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_LOGIN_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_CONTACT_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_CONTACT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 60 * 1000),

  BODY_LIMIT: z.string().default("1mb"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

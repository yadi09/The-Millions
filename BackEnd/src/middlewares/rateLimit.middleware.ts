import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// Login: brute-force protection. Tight window, low cap.
export const loginRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_LOGIN_WINDOW_MS,
  limit: env.RATE_LIMIT_LOGIN_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

// Contact form: spam protection. Looser window, slightly higher cap.
export const contactRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_CONTACT_WINDOW_MS,
  limit: env.RATE_LIMIT_CONTACT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many contact submissions, please try again later" },
});

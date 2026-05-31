import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import pagesRoutes from "./modules/pages/pages.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import contactAdminRoutes from "./modules/contact/contact.admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import servicesRoutes from "./modules/services/services.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import adminBlogRoutes from "./modules/blog/admin.blog.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import footerRoutes from "./modules/footer/footer.routes.js";
import testimonialsRoutes from "./modules/testimonials/testimonials.routes.js";
import adminTestimonialsRoutes from "./modules/testimonials/admin.testimonials.routes.js";
import swaggerRoutes from "./routes/swagger.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { ForbiddenError } from "./utils/errors.js";

const app = express();

// If deployed behind a reverse proxy (nginx, ALB), set trust proxy so that
// rate limit / req.ip read the forwarded client IP, not the proxy IP.
// Set to the number of hops (commonly 1). Configure via env when deploying.
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = new Set(env.CORS_ORIGINS);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server, curl, mobile apps (no Origin header).
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new ForbiddenError(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: env.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.BODY_LIMIT }));

app.use("/api/pages", pagesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.get("/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);
app.use("/api/services", servicesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contact-messages", contactAdminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/admin/testimonials", adminTestimonialsRoutes);
app.use("/api-docs", swaggerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

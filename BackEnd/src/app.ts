import express from "express";
import cors from "cors";
import pagesRoutes from "./modules/pages/pages.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import contactAdminRoutes from './modules/contact/contact.admin.routes.js';
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import servicesRoutes from "./modules/services/services.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import adminBlogRoutes from "./modules/blog/admin.blog.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import footerRoutes from './modules/footer/footer.routes.js';
import testimonialsRoutes from './modules/testimonials/testimonials.routes.js';
import swaggerRoutes from './routes/swagger.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pages", pagesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/services", servicesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contact-messages", contactAdminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api-docs', swaggerRoutes);

import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

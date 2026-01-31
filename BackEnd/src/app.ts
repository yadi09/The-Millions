import express from "express";
import cors from "cors";
import pagesRoutes from "./modules/pages/pages.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import servicesRoutes from "./modules/services/services.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import adminBlogRoutes from "./modules/blog/admin.blog.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pages", pagesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/upload", uploadRoutes);

export default app;

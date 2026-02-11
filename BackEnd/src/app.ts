import express from "express";
import cors from "cors";
import pagesRoutes from "./modules/pages/pages.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import servicesRoutes from "./modules/services/services.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pages", pagesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/contact", contactRoutes);

export default app;

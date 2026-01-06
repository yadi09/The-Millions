import express from "express";
import cors from "cors";
import pagesRoutes from "./modules/pages/pages.routes.js";
import healthRoutes from "./modules/health/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pages", pagesRoutes);
app.use("/api/health", healthRoutes);

export default app;

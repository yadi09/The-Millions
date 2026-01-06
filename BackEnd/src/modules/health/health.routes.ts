import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

export default router;

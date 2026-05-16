import { env } from "./config/env.js";
import app from "./app.js";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${env.PORT} (${env.NODE_ENV})`);
  console.log(`📡 Health check: http://0.0.0.0:${env.PORT}/api/health`);

  setInterval(() => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    console.log(`⏱️  Server uptime: ${hours}h ${minutes}m`);
  }, 300000);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

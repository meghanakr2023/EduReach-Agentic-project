import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error-handler.middleware.js";
import chatRoutes from "./routes/chat.routes.js";
import vapiRoutes from "./routes/vapi.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import testEmailRoutes from "./routes/test-email.routes.js";

const app: Application = express();

app.use(
  cors({
    origin: [
      "https://edu-reach-agentic-project.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/vapi", vapiRoutes);
app.use("/api/webhook", webhookRoutes);

// ⚠️ TEMPORARY — remove this after testing
app.use("/api/test-email", testEmailRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use(errorHandler);

export default app;
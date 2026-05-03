import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.config.js";
import { initializeKnowledgeBase } from "./services/rag.service.js";

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    await initializeKnowledgeBase();

    app.listen(PORT, () => {
      console.log(" Mysore College Server is running!");
      console.log(` Server running on port ${PORT}`);
      console.log(" Node: " + process.version);
      console.log(" Press Ctrl+C to stop");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
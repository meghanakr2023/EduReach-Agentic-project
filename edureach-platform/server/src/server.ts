import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.config.js";
import { initializeKnowledgeBase } from "./services/rag.service.js";
import KnowledgeDoc from "./models/knowledge-doc.model.js";

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    // 1. Connect DB
    await connectDB();

    // 👇 ADD TEST INSERT HERE
    await KnowledgeDoc.create({
      text: "First test document",
      embedding: Array(3072).fill(0.5),
    });

    console.log("Test document inserted ✅");

    // 2. Initialize knowledge base
    await initializeKnowledgeBase();

    app.listen(PORT, () => {
      console.log(" EduReach Server is running!");
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
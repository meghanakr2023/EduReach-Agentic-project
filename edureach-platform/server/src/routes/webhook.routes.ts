import { Router } from "express";
import { handleVapiWebhook } from "../controllers/webhook.controller.ts";

const router = Router();

// Vapi will POST to this URL when a call ends
// Set this URL in your Vapi dashboard under Assistant → Server URL
router.post("/vapi", handleVapiWebhook);

export default router;
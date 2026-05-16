import type { Request, Response, NextFunction } from "express";
import Call from "../models/call.model.ts";
import { generatePersonalizedEmailContent, generateGeneralEmailContent } from "../services/ai-email.service.ts";
import { sendFollowUpEmail } from "../services/email.service.ts";

// POST /api/webhook/vapi
// Vapi calls this automatically when a call ends
export const handleVapiWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    console.log("📞 Vapi Webhook received:", payload?.message?.type);

    // Vapi sends different event types — we only care about end-of-call report
    if (payload?.message?.type !== "end-of-call-report") {
      res.status(200).json({ received: true });
      return;
    }

    const { call, transcript, summary } = payload.message;
    const callId = call?.id;

    if (!callId) {
      res.status(200).json({ received: true });
      return;
    }

    // Find the call record we saved when initiating
    const callRecord = await Call.findOne({ callId });

    if (!callRecord) {
      console.log(`⚠️ No call record found for callId: ${callId}`);
      res.status(200).json({ received: true });
      return;
    }

    // Update call record with transcript and summary
    callRecord.transcript = transcript || summary || "";
    callRecord.status = "completed";
    callRecord.summary = summary || "";
    await callRecord.save();

    console.log(`✅ Call record updated for: ${callRecord.userName}`);

    // Generate personalized email content using AI
    let emailContent: string;

    if (transcript && transcript.length > 50) {
      // Use actual transcript if available
      emailContent = await generatePersonalizedEmailContent({
        transcript,
        studentName: callRecord.userName,
        course: callRecord.preferredCourse,
      });
    } else {
      // Fallback to general email based on course
      emailContent = await generateGeneralEmailContent({
        studentName: callRecord.userName,
        course: callRecord.preferredCourse,
      });
    }

    // Send the personalized follow-up email
    await sendFollowUpEmail({
      to: callRecord.userEmail,
      studentName: callRecord.userName,
      emailContent,
      course: callRecord.preferredCourse,
    });

    // Mark email as sent
    callRecord.emailSent = true;
    await callRecord.save();

    console.log(`📧 Follow-up email sent to: ${callRecord.userEmail}`);

    res.status(200).json({ received: true, emailSent: true });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    // Always return 200 to Vapi so it doesn't retry
    res.status(200).json({ received: true, error: "Processing failed" });
    next(error);
  }
};

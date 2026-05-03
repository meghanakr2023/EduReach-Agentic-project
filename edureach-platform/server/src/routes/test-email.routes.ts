import { Router } from "express";
import { generateGeneralEmailContent } from "../services/ai-email.service.ts";
import { sendFollowUpEmail } from "../services/email.service.ts";

const router = Router();

// GET /api/test-email
// Temporary route to test email sending
router.get("/", async (req, res) => {
  try {
    const testStudent = {
      name: "Test Student",
      email: process.env.EMAIL_USER || "", // sends to yourself for testing
      course: "B.Tech Computer Science & Engineering",
    };

    console.log("🧪 Generating test email content...");

    const emailContent = await generateGeneralEmailContent({
      studentName: testStudent.name,
      course: testStudent.course,
    });

    console.log("📧 Sending test email...");

    await sendFollowUpEmail({
      to: testStudent.email,
      studentName: testStudent.name,
      emailContent,
      course: testStudent.course,
    });

    res.json({
      success: true,
      message: `Test email sent to ${testStudent.email}`,
    });
  } catch (error: any) {
    console.error("❌ Test email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send test email",
    });
  }
});

export default router;
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendFollowUpEmail = async ({
  to,
  studentName,
  emailContent,
  course,
}: {
  to: string;
  studentName: string;
  emailContent: string;
  course: string;
}): Promise<void> => {

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f5ee; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background-color: #1a4731; padding: 30px 40px; text-align: center; border-bottom: 4px solid #f59e0b; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; }
        .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .greeting { padding: 30px 40px 10px; }
        .greeting h2 { color: #1a4731; font-size: 20px; margin: 0 0 8px; }
        .greeting p { color: #555; font-size: 14px; line-height: 1.6; margin: 0; }
        .course-badge { margin: 20px 40px; background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #1a4731; border-radius: 8px; padding: 14px 18px; font-size: 14px; color: #1a4731; font-weight: 600; }
        .content { padding: 10px 40px 30px; color: #444; font-size: 14px; line-height: 1.8; white-space: pre-line; }
        .footer { background: #f3f4f6; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; }
        .footer strong { color: #1a4731; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mysore College</h1>
          <p>Est. 2005 · Mysore, Karnataka</p>
        </div>
        <div class="greeting">
          <h2>Dear ${studentName},</h2>
          <p>Thank you for speaking with our AI counselor. Here is your personalized summary.</p>
        </div>
        <div class="course-badge">📚 Program of Interest: ${course}</div>
        <div class="content">${emailContent}</div>
        <div class="footer">
          <p>© 2024 <strong>Mysore College</strong>, Karnataka. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const { error } = await resend.emails.send({
    from: "Mysore College <onboarding@resend.dev>",
    to,
    subject: `Your Personalized Guide to ${course} at Mysore College`,
    html: htmlBody,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message);
  }

  console.log(`✅ Follow-up email sent to ${to}`);
};

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const generatePersonalizedEmailContent = async ({
  transcript,
  studentName,
  course,
}: {
  transcript: string;
  studentName: string;
  course: string;
}): Promise<string> => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
  });

  const prompt = `
You are an admissions counselor at Mysore College, Mysore, Karnataka.

A student named "${studentName}" just finished a call about "${course}".

Call transcript:
---
${transcript}
---

Write a clean, structured HTML email body based on this conversation.

STRICT RULES:
- Output ONLY the HTML content inside the body — no subject line, no greeting like "Dear", no extracted information section
- Do NOT show any internal analysis or extracted data
- Do NOT use markdown (no **, no *, no #)
- Use only these HTML tags: <h3>, <p>, <ul>, <li>, <strong>, <br>
- Keep it concise — maximum 300 words total
- Only mention information that was actually discussed in the call
- Do NOT ask student to share more details

Structure the email body with exactly these 4 sections:

<h3>📚 About Your Program</h3>
<p>2 sentences about the course they asked about — fees and placement average.</p>

<h3>🎁 Scholarships Available</h3>
<ul>
<li>Merit: 50% tuition waiver for top rankers</li>
<li>Need-based: up to 100% waiver</li>
<li>Sports: 25% waiver</li>
<li>SC/ST/OBC: government reimbursement</li>
</ul>

<h3>📝 Next Steps</h3>
<ul>
<li>Register on the VTU/university counseling portal</li>
<li>Select Mysore College as your preference</li>
<li>Complete document verification on campus</li>
<li>Pay first installment to secure your seat</li>
</ul>

<h3>📞 Contact Us</h3>
<p>admissions@mysorecollege.edu.in | +91-9876543210 | Mon–Sat 9AM–5PM</p>
`;

  const result = await model.invoke(prompt);
  return typeof result.content === "string"
    ? result.content
    : JSON.stringify(result.content);
};

export const generateGeneralEmailContent = async ({
  studentName,
  course,
}: {
  studentName: string;
  course: string;
}): Promise<string> => {

  const feeMap: Record<string, { govt: string; mgmt: string; avg: string }> = {
    "CSE": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,50,000/yr", avg: "Rs.10.2 LPA" },
    "Computer Science": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,50,000/yr", avg: "Rs.10.2 LPA" },
    "AI": { govt: "Rs.1,50,000/yr", mgmt: "Rs.3,00,000/yr", avg: "Rs.11.5 LPA" },
    "Data Science": { govt: "Rs.1,50,000/yr", mgmt: "Rs.3,00,000/yr", avg: "Rs.11.5 LPA" },
    "IT": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,25,000/yr", avg: "Rs.8.8 LPA" },
    "Information Technology": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,25,000/yr", avg: "Rs.8.8 LPA" },
    "ECE": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,00,000/yr", avg: "Rs.7.2 LPA" },
    "Electronics": { govt: "Rs.1,50,000/yr", mgmt: "Rs.2,00,000/yr", avg: "Rs.7.2 LPA" },
    "ME": { govt: "Rs.1,50,000/yr", mgmt: "Rs.1,75,000/yr", avg: "Rs.5.5 LPA" },
    "Mechanical": { govt: "Rs.1,50,000/yr", mgmt: "Rs.1,75,000/yr", avg: "Rs.5.5 LPA" },
    "CE": { govt: "Rs.1,50,000/yr", mgmt: "Rs.1,50,000/yr", avg: "Rs.5.0 LPA" },
    "Civil": { govt: "Rs.1,50,000/yr", mgmt: "Rs.1,50,000/yr", avg: "Rs.5.0 LPA" },
    "MBA": { govt: "Rs.2,00,000/yr", mgmt: "Rs.2,75,000/yr", avg: "Rs.8.0 LPA" },
    "M.Tech": { govt: "Rs.1,00,000/yr", mgmt: "Rs.1,50,000/yr", avg: "Rs.7.0 LPA" },
  };

  const matchedKey = Object.keys(feeMap).find(k =>
    course.toLowerCase().includes(k.toLowerCase())
  );

  const govt = matchedKey ? feeMap[matchedKey]!.govt : "Rs.1,50,000/yr";
  const mgmt = matchedKey ? feeMap[matchedKey]!.mgmt : "Rs.2,00,000/yr";
  const avg = matchedKey ? feeMap[matchedKey]!.avg : "Rs.8.0 LPA";

  return `
<h3>📚 About Your Program</h3>
<p>
  The <strong>${course}</strong> program at Mysore College offers excellent career opportunities
  with an average placement package of <strong>${avg}</strong>.
  Government quota tuition fee is <strong>${govt}</strong> and management quota is <strong>${mgmt}</strong>.
  Hostel accommodation is available at <strong>Rs.80,000/yr</strong>.
</p>

<h3>🎁 Scholarships Available</h3>
<ul>
  <li><strong>Merit Scholarship:</strong> 50% tuition waiver for top rankers</li>
  <li><strong>Need-Based:</strong> Up to 100% tuition waiver</li>
  <li><strong>Sports Scholarship:</strong> 25% tuition waiver</li>
  <li><strong>SC/ST/OBC:</strong> Government reimbursement available</li>
</ul>

<h3>📝 Next Steps</h3>
<ul>
  <li>Register on the counseling portal and select Mysore College</li>
  <li>Complete document verification on campus</li>
  <li>Pay first installment to secure your seat</li>
  <li>Classes begin August 1st</li>
</ul>

<h3>📞 Contact Us</h3>
<p>admissions@mysorecollege.edu.in | +91-9876543210 | Mon–Sat 9AM–5PM</p>
`;
};

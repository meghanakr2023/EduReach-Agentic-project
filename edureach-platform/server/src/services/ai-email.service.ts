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

A student named "${studentName}" just finished a call with our AI counselor about "${course}".

Here is the call transcript:
---
${transcript}
---

Based on this transcript, extract:
1. Student's KCET rank (if mentioned)
2. Student's PGCET rank (if mentioned)
3. Student's 12th grade percentage (if mentioned)
4. The branch they want (if mentioned)
5. Whether they asked about management quota

Then write a warm personalized follow-up email body with these sections:

🎓 YOUR ACADEMIC PROFILE
Summarize their rank and scores from the call.

🌟 OUR RECOMMENDATION FOR YOU
Based on their KCET rank, recommend the best branch using:
- Rank 1-6000: AI and Data Science (Avg: Rs.11.5 LPA)
- Rank 6001-8000: Computer Science (Avg: Rs.10.2 LPA)
- Rank 8001-10000: Information Technology (Avg: Rs.8.8 LPA)
- Rank 10001-15000: Electronics and Communication (Avg: Rs.7.2 LPA)
- Rank 15001-25000: Mechanical Engineering (Avg: Rs.5.5 LPA)
- Rank 25001-35000: Civil Engineering (Avg: Rs.5.0 LPA)
- Rank above 35000: Suggest management quota

💰 FEE DETAILS
Government quota tuition: Rs.1,50,000/year. Hostel: Rs.80,000/year.
If management quota needed:
CSE Rs.2,50,000/yr | AI and DS Rs.3,00,000/yr | IT Rs.2,25,000/yr
ECE Rs.2,00,000/yr | ME Rs.1,75,000/yr | CE Rs.1,50,000/yr
Hostel same: Rs.80,000/yr. Loans via SBI, HDFC, ICICI.

🏆 CAREER SCOPE
2-3 lines about career for their recommended branch.

🎁 SCHOLARSHIPS
Merit: 50% waiver for top rankers. Need-based: up to 100% waiver. Sports: 25% waiver. SC/ST/OBC: government reimbursement.

📝 NEXT STEPS
List 4-5 clear steps to apply.

Warm, encouraging, professional tone. Max 500 words. No subject or greeting — just sections.
`;

  const result = await model.invoke(prompt);
  return typeof result.content === "string"
    ? result.content
    : JSON.stringify(result.content);
};

export const generateGeneralEmailContent = async ({
  studentName,
  course,
  kcetRank,
  pgcetRank,
  twelfthPercentage,
  specificBranch,
}: {
  studentName: string;
  course: string;
  kcetRank?: number;
  pgcetRank?: number;
  twelfthPercentage?: number;
  specificBranch?: string;
}): Promise<string> => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
  });

  let recommendedBranch = "";
  let quotaType = "government";

  if (kcetRank) {
    if (kcetRank <= 6000) recommendedBranch = "AI & Data Science";
    else if (kcetRank <= 8000) recommendedBranch = "Computer Science Engineering";
    else if (kcetRank <= 10000) recommendedBranch = "Information Technology";
    else if (kcetRank <= 15000) recommendedBranch = "Electronics & Communication";
    else if (kcetRank <= 25000) recommendedBranch = "Mechanical Engineering";
    else if (kcetRank <= 35000) recommendedBranch = "Civil Engineering";
    else { recommendedBranch = specificBranch || "CSE"; quotaType = "management"; }
  }

  const mgmtFees: Record<string, string> = {
    "CSE": "Rs.2,50,000/year", "AI & DS": "Rs.3,00,000/year",
    "IT": "Rs.2,25,000/year", "ECE": "Rs.2,00,000/year",
    "ME": "Rs.1,75,000/year", "CE": "Rs.1,50,000/year",
  };
  const branchForFee = specificBranch || recommendedBranch.split(" ")[0];
  const specificFee = mgmtFees[branchForFee as string] || "Rs.2,00,000/year";

  const prompt = `
You are an admissions counselor at Mysore College, Mysore, Karnataka.

Write a warm personalized follow-up email body for "${studentName}".

STUDENT PROFILE:
- Program: ${course}
- KCET Rank: ${kcetRank || "Not provided"}
- PGCET Rank: ${pgcetRank || "Not provided"}
- 12th Percentage: ${twelfthPercentage ? twelfthPercentage + "%" : "Not provided"}
- Specific Branch: ${specificBranch || "None"}
- Recommended Branch: ${recommendedBranch || "To be determined"}
- Quota: ${quotaType}

Write with these sections:

🎓 YOUR ACADEMIC PROFILE
Summarize their scores encouragingly in 2-3 lines.

🌟 OUR RECOMMENDATION FOR YOU
${kcetRank ? `Based on your KCET rank of ${kcetRank}, we recommend ${recommendedBranch}.` : "Based on your profile:"}
Mention placement average and career scope for that branch.
${specificBranch && quotaType === "management" ? `You asked about ${specificBranch}. Management quota fee: ${specificFee}.` : ""}

💰 FEE STRUCTURE
${quotaType === "government" ?
`Government Quota (KCET):
Tuition: Rs.1,50,000/year | Hostel: Rs.80,000/year | Lab: Rs.15,000/year
Total as Hosteller: Rs.2,50,000/year` :
`Management Quota for ${specificBranch || recommendedBranch}:
Tuition: ${specificFee} | Hostel: Rs.80,000/year | Lab: Rs.15,000/year
Loans: SBI, HDFC, ICICI Bank | Payment in 2 installments`}

🏆 CAREER SCOPE
2-3 lines on jobs and companies for the recommended branch.

🎁 SCHOLARSHIPS
Merit: 50% waiver. Need-based: up to 100%. Sports: 25%. SC/ST/OBC: government reimbursement.

📝 NEXT STEPS
1. Register on VTU KCET portal
2. Select Mysore College as preference
3. Document verification on campus
4. Pay first installment to secure seat
5. Classes start August 1st, 2024

Encouraging close. Max 450 words. No subject or greeting.
`;

  const result = await model.invoke(prompt);
  return typeof result.content === "string"
    ? result.content
    : JSON.stringify(result.content);
};
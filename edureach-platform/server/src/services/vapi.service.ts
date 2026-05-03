interface CallPayload {
  phoneNumber: string;
  userName: string;
  userEmail: string;
  preferredCourse?: string;
  preferredTopic?: string;
  kcetRank?: string | null;
  twelfthPercent?: string | null;
}

interface VapiCallResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

export const initiateOutboundCall = async (payload: CallPayload): Promise<VapiCallResponse> => {
  const {
    phoneNumber,
    userName,
    userEmail,
    preferredCourse,
    preferredTopic,
    kcetRank,
    twelfthPercent,
  } = payload;

  const VAPI_API_KEY = process.env.VAPI_API_KEY;
  const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
  const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

  if (!VAPI_API_KEY || !VAPI_PHONE_NUMBER_ID || !VAPI_ASSISTANT_ID) {
    throw new Error("Vapi configuration missing.");
  }

  const formattedPhone = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+91${phoneNumber.replace(/^0+/, "")}`;

  // Build a smart first message using all collected data
  let firstMessage = `Hi ${userName}! This is Ava, your AI admissions counselor from Mysore College. `;

  if (kcetRank && twelfthPercent) {
    firstMessage += `I can see you have a KCET rank of ${kcetRank} and scored ${twelfthPercent}% in your 12th grade. `;
    firstMessage += `Based on your rank, I already have a branch recommendation ready for you! `;
    firstMessage += `You're interested in ${preferredCourse || "our programs"} and want to know about ${preferredTopic || "admissions"}. `;
    firstMessage += `Shall I share your personalized recommendation?`;
  } else if (kcetRank) {
    firstMessage += `I can see your KCET rank is ${kcetRank}. `;
    firstMessage += `I have a branch recommendation ready for you for ${preferredCourse || "engineering programs"}! `;
    firstMessage += `Could you also tell me your 12th grade percentage so I can give you the complete picture?`;
  } else if (twelfthPercent) {
    firstMessage += `I can see you scored ${twelfthPercent}% in your 12th grade — great score! `;
    firstMessage += `You're interested in ${preferredCourse || "our programs"}. `;
    firstMessage += `Could you also share your KCET rank so I can recommend the best branch for you?`;
  } else {
    firstMessage += `You're interested in ${preferredCourse || "our programs"} and want to know about ${preferredTopic || "admissions"}. `;
    firstMessage += `To help you find the best branch, could you share your KCET rank and 12th grade percentage?`;
  }

  // Build variable values to pass all context to the assistant
  const variableValues: Record<string, string> = {
    studentName: userName,
    studentEmail: userEmail,
    preferredCourse: preferredCourse || "Not specified",
    preferredTopic: preferredTopic || "General inquiry",
    kcetRank: kcetRank || "Not provided",
    twelfthPercent: twelfthPercent ? `${twelfthPercent}%` : "Not provided",
  };

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: VAPI_ASSISTANT_ID,
      assistantOverrides: {
        firstMessage,
        variableValues,
      },
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
      customer: {
        number: formattedPhone,
        name: userName,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Vapi API Error:", errorData);
    throw new Error(`Vapi call failed: ${JSON.stringify(errorData)}`);
  }

  return (await response.json()) as VapiCallResponse;
};
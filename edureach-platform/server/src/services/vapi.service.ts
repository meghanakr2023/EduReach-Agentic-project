interface CallPayload {
  phoneNumber: string;
  userName: string;
  userEmail: string;
  preferredCourse?: string;
  preferredTopic?: string;
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

  const firstMessage = `Hi ${userName}! This is Ava, your AI admissions counselor from Mysore College. You are interested in ${preferredCourse || "our programs"} and want to know about ${preferredTopic || "admissions"}. How can I help you today?`;

  const variableValues: Record<string, string> = {
    studentName: userName,
    studentEmail: userEmail,
    preferredCourse: preferredCourse || "Not specified",
    preferredTopic: preferredTopic || "General inquiry",
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

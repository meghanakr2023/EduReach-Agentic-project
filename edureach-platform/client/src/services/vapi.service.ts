import API from "./api";

export const initiateCall = async (data: {
  phone: string;
  course: string;
  topic: string;
  kcetRank?: string;
  twelfthPercent?: string;
  email?: string;
}) => {
  const res = await API.post("/vapi/call", {
    phoneNumber: data.phone,
    preferredCourse: data.course,
    preferredTopic: data.topic,
    kcetRank: data.kcetRank || null,
    twelfthPercent: data.twelfthPercent || null,
    studentEmail: data.email || null,
  });
  return res.data;
};
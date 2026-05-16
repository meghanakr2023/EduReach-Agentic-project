import { useState } from "react";
import { X, Phone, CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { initiateCall } from "../services/vapi.service";
import { vapiFormContent } from "../data/content";

interface CallPopupProps {
  open: boolean;
  onClose: () => void;
}

type CallStatus = "form" | "calling" | "done" | "error";

export default function CallPopup({ open, onClose }: CallPopupProps) {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState<CallStatus>("form");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone || !course || !topic) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setStatus("calling");
    try {
      await initiateCall({
        phone,
        course,
        topic,
        email,
      });
      setStatus("done");
      toast.success("Call initiated!");
    } catch {
      setStatus("error");
      toast.error("Failed to initiate call.");
    }
  };

  const reset = () => {
    setStatus("form");
    setPhone("");
    setCourse("");
    setTopic("");
    setEmail(user?.email || "");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-maroon rounded-t-2xl px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
          <h3 className="font-heading text-xl font-bold text-white">Talk to Our AI Counselor</h3>
          <p className="text-white/70 text-sm mt-1">
            Fill in your details — Ava will already know everything when she calls!
          </p>
        </div>

        <div className="p-6">
          {status === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" value={user?.name || ""} readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address * <span className="text-xs text-gray-400">(personalized summary will be sent here)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm" />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course *</label>
                <select value={course} onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                  <option value="">Select a course</option>
                  {vapiFormContent.courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to know? *</label>
                <select value={topic} onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-sm">
                  <option value="">Select a topic</option>
                  {vapiFormContent.topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button type="submit"
                className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-maroon-dark transition-colors duration-200 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call Me Now
              </button>

              <p className="text-xs text-center text-gray-400">
                After the call, a personalized email with course details will be sent to {email || "your email"}
              </p>
            </form>
          )}

          {status === "calling" && (
            <div className="text-center py-10">
              <Loader2 className="w-10 h-10 text-maroon mx-auto animate-spin mb-3" />
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">Calling you now...</h3>
              <p className="text-gray-500 text-sm">Our AI counselor Ava is dialing {phone}</p>
            </div>
          )}

          {status === "done" && (
            <div className="text-center py-10">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">Call Initiated!</h3>
              <p className="text-gray-500 text-sm mb-2">You'll receive a call shortly on {phone}.</p>
              <p className="text-xs text-gray-400 mb-4">
                After the call, a personalized email with course details will be sent to <span className="font-medium text-maroon">{email}</span>
              </p>
              <button onClick={reset} className="text-maroon font-medium text-sm hover:underline">
                Request Another Call
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">Call Failed</h3>
              <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
              <button onClick={reset}
                className="bg-maroon text-white px-5 py-2 rounded-lg text-sm hover:bg-maroon-dark transition-colors duration-200">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

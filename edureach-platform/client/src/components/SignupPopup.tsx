import { Link } from "react-router-dom";
import { X, GraduationCap } from "lucide-react";

interface SignupPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function SignupPopup({ show, onClose }: SignupPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Top gold accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-maroon/10 border border-maroon/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-maroon" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Unlock Full Access</h3>
          <p className="text-gray-500 text-sm mb-6">
            Sign up to explore our mentors, campus life, placements, and get AI-powered counseling at Mysore College.
          </p>
          <Link to="/signup" onClick={onClose}
            className="block w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-maroon-dark transition-colors duration-200 mb-3">
            Create Free Account
          </Link>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" onClick={onClose} className="text-maroon font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
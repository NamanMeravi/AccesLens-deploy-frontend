import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, login, updateUser } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verifyEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Email verified successfully!");
        // Update user data with isVerified status
        if (data.user) {
          updateUser({ ...user, isVerified: true });
        }
        // Navigate to home page
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resendVerification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Verification email sent successfully!");
      } else {
        toast.error(data.message || "Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Resend error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  // If user is already verified, show a message
  if (user && user.isVerified) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-zinc-800 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Already Verified</h1>
          <p className="text-gray-400">Your email is already verified</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-md py-3 font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Verify Your Email</h1>
          <p className="text-gray-400 text-sm">
            {user ? `We've sent a verification code to ${user.email}` : "Enter the verification code sent to your email"}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="w-full bg-zinc-800 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-400 text-sm"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


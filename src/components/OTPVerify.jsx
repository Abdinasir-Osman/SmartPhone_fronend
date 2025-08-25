import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useRedirectByRole from "../hooks/useRedirectByRole";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OTPVerify({ email, onSuccess, context = "" }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const { redirectByRole } = useRedirectByRole();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      const { access_token, role } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.removeItem("otp_email"); // ✅ Clear
      localStorage.setItem("role", role);

      // ✅ Use the hook to redirect by role
      redirectByRole(role);

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    console.log("Resend OTP email:", email); // Debug log
    try {
      await axios.post(`${API_BASE}/auth/resend-otp`, { email });
      setResendCooldown(30);
    } catch (err) {
      setError("Failed to resend OTP. Try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 font-semibold">No email provided for OTP verification.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleVerify}
      className="max-w-xs w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in"
    >
      <h2 className="text-lg font-bold text-primary text-center mb-2">Verify OTP</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>

      <input
        type="text"
        maxLength={6}
        autoFocus
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
        placeholder="------"
        required
        inputMode="numeric"
        pattern="\d{6}"
      />

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendLoading || resendCooldown > 0}
        className="w-full bg-gray-200 text-primary py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50"
      >
        {resendLoading
          ? "Resending..."
          : resendCooldown > 0
          ? `Resend OTP (${resendCooldown}s)`
          : "Resend OTP"}
      </button>
    </form>
  );
}

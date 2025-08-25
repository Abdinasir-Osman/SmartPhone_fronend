import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEnvelope, FaRegCommentDots } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AppealForm({ defaultEmail }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(defaultEmail || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/auth/appeal`,
        { message, email: email.trim() || undefined },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
      setMessage("");
      toast.success(res.data?.message || "Your appeal has been received. Support will contact you soon.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send appeal");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl shadow-md p-6 text-center mt-6 animate-fade-in">
        <div className="flex justify-center mb-2">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-lg font-bold text-green-700 mb-2">Appeal Sent!</h3>
        <p className="text-green-700">Your appeal has been received. Support will contact you soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto flex flex-col gap-6 mt-6 animate-fade-in"
    >
      <div className="text-center mb-2">
        <div className="flex justify-center mb-2">
          <FaRegCommentDots className="text-primary text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-1">Account Appeal</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Your account is inactive.<br />
          Please explain why you want your account reactivated.<br />
          Support will contact you at <b>mlteamfp161@gmail.com</b>.
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black dark:text-black min-h-[80px]"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          placeholder="Explain your situation..."
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Email (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaRegEnvelope />
          </span>
          <input
            type="email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black dark:text-black"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email-ka aad rabto in lagula soo xiriiro (ikhtiyaari)"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-1">If you don't provide an email, your account email will be used for support to contact you.</p>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Appeal"}
      </button>
    </form>
  );
} 
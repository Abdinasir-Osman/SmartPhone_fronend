import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export default function ChangePasswordForm() {
  const navigate = useNavigate();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [strength, setStrength] = useState("");

  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score <= 1) setStrength("Weak");
    else if (score === 2) setStrength("Medium");
    else setStrength("Strong");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const old_password = e.target.old_password.value;

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    if (strength === "Weak") {
      toast.error("Password is too weak.");
      return;
    }

    try {
      await axios.put(
        `${API}/auth/change-password`,
        {
          old_password,
          new_password: newPass,
          confirm_password: confirmPass,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Password changed successfully. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "❌ Failed to change password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-light dark:bg-dark p-6 rounded-xl shadow-sm text-sm font-segoe"
    >
      <div className="relative">
        <label className="block font-semibold text-primary mb-1 font-segoe">
          Old Password
        </label>
        <input
          type={showOld ? "text" : "password"}
          name="old_password"
          className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={() => setShowOld(!showOld)}
          className="absolute right-4 top-[38px] text-dark dark:text-light"
        >
          {showOld ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="relative">
        <label className="block font-semibold text-primary mb-1 font-segoe">
          New Password
        </label>
        <input
          type={showNew ? "text" : "password"}
          name="new_password"
          value={newPass}
          onChange={(e) => {
            setNewPass(e.target.value);
            checkStrength(e.target.value);
          }}
          className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="absolute right-4 top-[38px] text-dark dark:text-light"
        >
          {showNew ? <FaEyeSlash /> : <FaEye />}
        </button>

        {newPass && (
          <p
            className={`mt-1 text-xs font-segoe ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-600"
            }`}
          >
            Password Strength: {strength}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block font-semibold text-primary mb-1 font-segoe">
          Confirm Password
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          name="confirm_password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-4 top-[38px] text-dark dark:text-light"
        >
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </button>

        {confirmPass && newPass !== confirmPass && (
          <p className="mt-1 text-xs text-red-500 font-segoe">
            Confirm password does not match.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-dark text-light py-2 rounded font-semibold transition font-segoe"
      >
        Change Password
      </button>
    </form>
  );
}

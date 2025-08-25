import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleLoginButton from "../components/GoogleLoginButton";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }
    if (strength === "Weak") {
      setError("Password is too weak. Use more chars, symbols & uppercase.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/signup`, {
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPass
      });
      // ✅ Save email for OTP page fallback
      localStorage.setItem("otp_email", email);
      // ✅ Redirect to OTP page
      navigate(`/otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-10 font-segoe">
      <div className="w-full max-w-md p-6 md:p-8 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg bg-light dark:bg-dark">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">Create Account</h2>
        <form className="space-y-6" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="
              w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg
              bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400
              transition duration-200
            "
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="
              w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg
              bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400
              transition duration-200
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="
                w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg
                bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400
                pr-10 transition duration-200
              "
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkStrength(e.target.value);
              }}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute top-3 right-4 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {password && (
            <p className={`text-xs mt-[-8px] ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-600"
            }`}>
              Password Strength: {strength}
            </p>
          )}

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="
                w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg
                bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400
                pr-10 transition duration-200
              "
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-3 right-4 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {confirmPass && password !== confirmPass && (
            <p className="text-xs text-red-500 mt-[-8px]">
              Confirm password does not match.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-none font-semibold transition
              ${loading 
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-dark text-light"}
            `}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-xs">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <GoogleLoginButton text="Continue with Google" />

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

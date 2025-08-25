import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useRedirectByRole from "../hooks/useRedirectByRole";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AppealForm from "../components/AppealForm";
import GoogleLoginButton from "../components/GoogleLoginButton";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Login() {
  useRedirectByRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("remember_email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [inactive, setInactive] = useState(false);
  // const [inactiveReason, setInactiveReason] = useState(""); // Haddii aad rabto reason

  // Global axios interceptor: logout if user becomes inactive
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.detail === "Your account is not active. Please contact support."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          toast.error("Your account is not active. Please contact support.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      
      // ✅ Debug response
      console.log("Login Response:", res.data);
      
      // ✅ Haddii require_otp laga helo response-ka
      if (res.data.require_otp && res.data.email) {
        localStorage.setItem("otp_email", res.data.email);
        navigate(`/otp?email=${encodeURIComponent(res.data.email)}`);
        return;
      }
      
      // ✅ Handle token response properly
      const { access_token, role, full_name, email: userEmail } = res.data;
      
      // ✅ Use access_token from backend
      if (!access_token) {
        throw new Error("No access_token received from server");
      }
      
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("remember_email", email);
      localStorage.setItem("user", JSON.stringify({ 
        email: userEmail || email, 
        role, 
        full_name 
      }));
      
      toast.success("✅ Login successful");
      
      if (role === "superadmin") navigate("/super/dashboard");
      else if (role === "admin") navigate("/admin");
      else navigate("/profile");
    } catch (err) {
      console.error("Login Error:", err);
      
      // ✅ Handle token errors
      if (err.message === "No access_token received from server") {
        setError("Server did not return a valid access_token. Please try again.");
        toast.error("❌ Server did not return a valid access_token. Please try again.");
        return;
      }
      
      const msg = err.response?.data?.detail || "Login failed. Please try again.";
      setError(msg);
      if (
        err.response &&
        err.response.status === 403 &&
        msg === "Your account is not active. Please contact support."
      ) {
        toast.error("Your account is not active. Please contact support.");
        navigate("/appeal");
      } else {
        toast.error(`❌ ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-10 font-segoe">
      <div className="w-full max-w-md p-6 md:p-8 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg bg-light dark:bg-dark">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">Login</h2>
        <form className="space-y-6" onSubmit={handleLogin} autoComplete="on">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400 transition duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-primary rounded-lg bg-light dark:bg-dark-light text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400 pr-10 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-none font-semibold transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-dark text-light"}`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-xs">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <GoogleLoginButton text="Continue with Google" />
        {error && <p className="text-red-600 text-center mt-4">❌ {error}</p>}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <Link to="/forgot-password" className="text-primary font-medium">
              Forgot Password?
            </Link>
          </p>
          <p className="mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

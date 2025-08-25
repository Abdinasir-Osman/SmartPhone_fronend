import { useSearchParams } from "react-router-dom";
import OTPVerify from "./OTPVerify";

export default function OTPWrapper() {
  const [params] = useSearchParams();
  const urlEmail = params.get("email");
  const email = urlEmail || localStorage.getItem("otp_email"); // ✅ Fallback

  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark px-4 py-10">
      <div className="w-full max-w-md p-6 md:p-8 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg bg-white dark:bg-dark-light">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">OTP Verification</h2>
        <OTPVerify email={email} />
      </div>
    </div>
  );
}

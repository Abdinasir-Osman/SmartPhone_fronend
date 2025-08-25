import AppealForm from "../components/AppealForm";
import { FaRegSadTear } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AppealPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
        <FaRegSadTear className="text-primary text-5xl mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">Account Inactive</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Your account is currently inactive.<br />
          If you believe this is a mistake or want to appeal, please fill the form below.<br />
          Our support team will contact you at <b>mlteamfp161@gmail.com</b>.
        </p>
        <AppealForm />
        <Link to="/login" className="mt-6 text-primary font-semibold hover:underline">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
} 
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 font-segoe">
      <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">🚫 Unauthorized</h1>
      <p className="text-gray-700 dark:text-gray-300 mt-2 text-center">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="
          mt-6 px-6 py-3 rounded-full font-semibold transition
          bg-primary text-white
          hover:bg-dark hover:text-primary
          dark:hover:bg-light dark:hover:text-dark
        "
      >
        Go to Login
      </button>
    </div>
  );
}

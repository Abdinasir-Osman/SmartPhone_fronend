import React from "react";

export default function GoogleLoginButton({ text = "Continue with Google" }) {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  };
  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg bg-white border border-gray-300 shadow hover:bg-gray-100 transition text-gray-700 font-semibold text-base mt-2 mb-2"
      style={{ minHeight: 44 }}
    >
      <svg width="24" height="24" viewBox="0 0 48 48" className="inline-block">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.91 2.36 30.28 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/>
          <path fill="#FBBC05" d="M9.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 17.18-1.13 30.82 1.69 39.91l7.98-6.2z"/>
          <path fill="#EA4335" d="M24 46c6.28 0 11.91-2.36 16.04-6.45l-7.19-5.6c-2.01 1.35-4.6 2.15-7.85 2.15-6.38 0-11.87-3.63-13.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      {text}
    </button>
  );
} 
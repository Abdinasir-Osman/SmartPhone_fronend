import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import UserUpdateProfileForm from "../components/UserUpdateProfileForm";
import UserChangePasswordForm from "../components/UserChangePasswordForm";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("update");
  const { profile } = useOutletContext();

  if (!profile) {
    return <div className="text-center p-10">Loading profile...</div>;
  }

  return (
    <div className="w-full max-w-md mx-1 sm:mx-auto p-4 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-[#0C2338] font-segoe">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <FaUserCircle className="text-primary text-3xl" />
          <h1 className="text-3xl font-bold text-dark dark:text-light">
            Settings
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your personal information and password.
        </p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("update")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "update"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Update Info
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "password"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Change Password
        </button>
      </div>

      <div>
        {activeTab === "update" && <UserUpdateProfileForm profile={profile} />}
        {activeTab === "password" && <UserChangePasswordForm />}
      </div>
    </div>
  );
}

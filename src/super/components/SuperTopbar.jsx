import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../../components/NotificationDropdown";

const API_BASE = import.meta.env.VITE_API_URL;

export default function SuperTopbar({ sidebarOpen, setSidebarOpen, profile }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [pendingCount] = useState(0);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const fallbackLetter = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="bg-light dark:bg-dark p-4 flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 dark:text-gray-300 md:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-light">
            Welcome, <span className="text-primary">{profile?.full_name || "Super Admin"}</span>
          </h1>
          <p className="text-sm text-white">Super Admin Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <NotificationDropdown userId={profile?.id} />
        <button
          onClick={toggleDarkMode}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${isDark ? 'border-primary text-yellow-500' : 'border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300'} hover:border-primary`}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button
          onClick={() => navigate("/super/settings")}
          className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary"
          aria-label="Profile"
        >
          {profile?.profile_image ? (
            <img
              src={
                profile.profile_image.startsWith('http')
                  ? profile.profile_image
                  : `${API_BASE}${profile.profile_image}`
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {fallbackLetter}
            </div>
          )}
        </button>
      </div>
    </div>
  );
} 
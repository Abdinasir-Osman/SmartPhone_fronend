// ✅ AdminTopbar.jsx sax ah (no OutletContext)
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationDropdown from "../../components/NotificationDropdown";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminTopbar({ sidebarOpen, setSidebarOpen, profile }) {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/orders/pending-count`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCount(res.data.pending_count || 0);
      } catch (error) {
        console.error("Failed to fetch pending orders count", error);
      }
    };
    if (token) {
        fetchPending();
    }
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  const fallbackLetter = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="bg-light dark:bg-dark p-4 flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-gray-600 dark:text-gray-300 md:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-light">
              Welcome, <span className="text-primary">{profile?.full_name || "Admin"}</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Dashboard</p>
          </div>
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
          onClick={() => navigate("/admin/profile")}
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

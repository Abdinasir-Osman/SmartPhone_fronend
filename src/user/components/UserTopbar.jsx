import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../../components/NotificationDropdown";

const API_BASE = import.meta.env.VITE_API_URL;

export default function UserTopbar({ sidebarOpen, setSidebarOpen, profile }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const fallbackLetter = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-light dark:bg-dark p-4 flex justify-between items-center w-full shadow-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-gray-600 dark:text-gray-300 md:hidden"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-light">
            Welcome, <span className="text-primary">{profile?.full_name || "User"}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">User Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <NotificationDropdown userId={profile?.id} />
        <button
          onClick={toggleDarkMode}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${isDark ? 'border-primary text-yellow-500' : 'border-gray-400 dark:border-gray-600'} hover:border-primary`}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button
          onClick={() => navigate('/user/profile')}
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
              onError={e => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.profile-fallback').style.display = 'flex'; }}
            />
          ) : null}
          <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center font-semibold profile-fallback" style={{display: profile?.profile_image ? 'none' : 'flex'}}>
            {fallbackLetter}
          </div>
        </button>
      </div>
    </div>
  );
} 
// src/layouts/UserLayout.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useOutletContext, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useUserProfile from "../hooks/useUserProfile";

export default function UserLayout({ search, setSearch }) {
  const { profile, loading, refreshProfile } = useUserProfile();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const location = useLocation();
  const isUserDashboardRoute = location.pathname.startsWith('/user');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  if (isUserDashboardRoute) {
    return <Outlet context={{ profile, loading, refreshProfile }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-light dark:bg-dark text-dark dark:text-light font-segoe">
      <Header
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={profile}
      />
      <main className="flex-1">
        <Outlet context={{ profile, loading, refreshProfile }} />
      </main>
      <Footer />
    </div>
  );
}

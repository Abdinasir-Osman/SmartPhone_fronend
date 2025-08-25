// ✅ AdminLayout.jsx 
import { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import NotificationDropdown from "../../components/NotificationDropdown";
import useUserProfile from "../../hooks/useUserProfile";
import useRedirectByRole from "../../hooks/useRedirectByRole";

export default function AdminLayout() {
  const { profile, loading, refreshProfile } = useUserProfile();
  useRedirectByRole(profile, "admin");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-segoe">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminTopbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          profile={profile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Outlet context={{ profile, refreshProfile }} />
          </div>
        </main>
      </div>
    </div>
  );
}

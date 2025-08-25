// ✅ Updated UserDashboard.jsx with full responsive fix

import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import NotificationDropdown from "../../components/NotificationDropdown";
import useRedirectByRole from "../../hooks/useRedirectByRole";

const UserDashboard = () => {
  const { profile, loading, refreshProfile } = useOutletContext();
  useRedirectByRole(profile, "user");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-segoe">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <UserTopbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          profile={profile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet context={{ profile, refreshProfile }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("✅ Logout successful");
    navigate("/admin-login");
  };

  return (
    <aside>
       <div className="h-screen w-64 bg-white dark:bg-gray-900 border-r shadow fixed top-0 left-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <div className="w-3 h-6 bg-[#FB8C00] rounded-sm" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          <span className="text-[#FB8C00]">Xaliye</span> Phones
        </h1>
      </div>

      <nav className="mt-6 space-y-1 px-4">
        <NavItem to="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        {/* <NavItem to="orders" icon={<ListOrdered size={20} />} label="Orders" /> */}
        <NavItem to="settings" icon={<Settings size={20} />} label="Settings" />

        {/* ✅ Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </div>
    </aside>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition ${
          isActive
            ? "bg-[#FB8C00] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-[#FB8C00] hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

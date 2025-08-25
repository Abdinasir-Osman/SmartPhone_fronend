import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListOrdered, Settings, LogOut, X } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const handleLogout = () => {
    localStorage.clear();
    toast.success("✅ Logout successful");
    window.location.href = "/admin-login";
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-light dark:bg-dark border-r border-dark dark:border-dark shadow z-50 transform transition-transform duration-300 font-segoe ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-dark dark:border-dark">
        <h1 className="text-xl font-bold text-dark dark:text-light font-segoe">
          <span className="text-primary">Xaliye</span> Phones
        </h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-dark dark:text-light"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="mt-4 space-y-2 px-4">
        <NavItem to="" label="Dashboard" icon={<LayoutDashboard size={20} />} onClick={() => setSidebarOpen(false)} />
        <NavItem to="orders" label="Orders" icon={<ListOrdered size={20} />} onClick={() => setSidebarOpen(false)} />
        <NavItem to="settings" label="Settings" icon={<Settings size={20} />} onClick={() => setSidebarOpen(false)} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-light hover:bg-red-600 transition font-segoe"
        >
          <LogOut size={20} /> Logout
        </button>
      </nav>
    </aside>
  );
}

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition font-segoe ${
          isActive
            ? "bg-primary text-light"
            : "text-dark dark:text-light hover:bg-primary hover:text-light"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, User, X } from 'lucide-react';
import { FaHome } from 'react-icons/fa';

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg transition-colors";
  const activeLinkClasses = "bg-primary text-white";

  const getLinkClass = ({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`;

  return (
    <aside
      className={`fixed top-0 left-0 w-64 h-full bg-light dark:bg-dark border-r border-dark dark:border-dark shadow z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col justify-between font-segoe`}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="text-2xl font-bold text-primary">
            Xaliye <span className="text-dark dark:text-light">Phones</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white md:hidden"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/" className={getLinkClass} end onClick={() => setSidebarOpen(false)}>
            <FaHome size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/user/orders" className={getLinkClass} onClick={() => setSidebarOpen(false)}>
            <ShoppingCart size={20} />
            <span>My Orders</span>
          </NavLink>
          <NavLink to="/user/profile" className={getLinkClass} onClick={() => setSidebarOpen(false)}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default UserSidebar;

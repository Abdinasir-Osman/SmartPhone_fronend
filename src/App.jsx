import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

// ✅ Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./admin/layout/AdminLayout";
import SuperAdminLayout from "./super/layout/SuperAdminLayout";

// ✅ Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PhoneDetails from "./pages/PhoneDetails";
import RecommendedPage from "./pages/RecommendedPage";
import Unauthorized from "./pages/Unauthorized";
import OAuthCallback from "./pages/OAuthCallback";
import OTPWrapper from "./components/OTPWrapper";

// ✅ User Pages
import Cart from "./user/pages/Cart";
import MyOrders from "./user/pages/MyOrders";
import Profile from "./user/pages/Profile";
import UserDashboard from "./user/pages/UserDashboard";
import OrderPage from './user/pages/OrderPage';
import PaymentForm from "./user/pages/Checkout";

// ✅ Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminSettings from "./admin/pages/AdminSettings";

// ✅ Super Admin Pages
import SuperDashboard from "./super/pages/SuperDashboard";
import ManageUsers from "./super/pages/ManageUsers";
import Analytics from "./super/pages/Analytics";
import Settings from "./super/pages/Settings";
import AddUser from "./super/pages/AddUser";
import Reports from "./super/pages/Reports";

// ✅ Route Protection
import PrivateRoute from "./routes/PrivateRoute";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDark ? "true" : "false");
  }, [isDark]);

  return [isDark, setIsDark];
}

export default function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");

  return (
    <>
      <Routes>
        {/* ✅ Public routes OUTSIDE UserLayout for OTP and OAuthCallback */}
        <Route path="/otp" element={<OTPWrapper />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* ✅ Public Routes inside UserLayout */}
        <Route
          element={
            <UserLayout search={search} setSearch={setSearch} brand={brand} setBrand={setBrand} />
          }
        >
          <Route path="/" element={<Home search={search} brand={brand} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/phone/:model" element={<PhoneDetails />} />
          <Route path="/recommended" element={<RecommendedPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ✅ User Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/checkout" element={<PaymentForm />} />
            <Route path="/phones/:id" element={<PhoneDetails />} />
            <Route path="/user" element={<UserDashboard />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={
                <div className="bg-light dark:bg-dark-light p-6 rounded-lg shadow-md">
                  <p className="text-dark dark:text-light">
                    Welcome to your dashboard! Select an option from the menu to manage your orders or profile.
                  </p>
                </div>
              } />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
            </Route>
          </Route>
        </Route>

        {/* ✅ Admin Panel Protected */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index  element={<AdminDashboard />} />
            <Route path="profile" element={<AdminSettings />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* ✅ Super Admin Panel Protected */}
        <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
          <Route path="/super" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<SuperDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>
        </Route>

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Toasts */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

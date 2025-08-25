import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoute({ allowedRoles }) {
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("token");
  const context = useOutletContext();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <p className="text-center mt-10 text-gray-500">🔄 Checking access...</p>; // loading
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet context={context} />;
}

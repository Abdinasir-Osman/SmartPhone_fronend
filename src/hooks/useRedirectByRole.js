// src/hooks/useRedirectByRole.js
import { useNavigate } from "react-router-dom";

export default function useRedirectByRole() {
  const navigate = useNavigate();
  const redirectByRole = (role) => {
    if (role === "superadmin") navigate("/super/dashboard");
    else if (role === "admin") navigate("/admin");
    else navigate("/user/dashboard");
  };
  return { redirectByRole };
}

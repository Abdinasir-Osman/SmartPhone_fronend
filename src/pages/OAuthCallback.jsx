import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const role = params.get("role");
  const email = params.get("email");
  const full_name = params.get("full_name");
  const profile_image = params.get("profile_image");

  useEffect(() => {
    // Haddii user horey u jiray (active/verified): dashboard sax ah
    if (token && role && email && full_name) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify({
        email,
        role,
        full_name,
        profile_image: profile_image || ""
      }));
      if (role === "superadmin") navigate("/super/dashboard");
      else if (role === "admin") navigate("/admin");
      else navigate("/user/dashboard");
    }
    // Haddii user cusub/inactive/otp_verified=False: OTP page
    else if (email) {
      localStorage.setItem("otp_email", email);
      navigate(`/otp?email=${encodeURIComponent(email)}`);
    } else {
      navigate("/login");
    }
  }, [email, token, role, full_name, profile_image, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}

// ✅ src/hooks/useUserProfile.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function useUserProfile() {
  const [profile, setProfile] = useState(null); // Always start as null, never from localStorage
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data); // Always use backend data
    } catch (err) {
      toast.error("Failed to load profile. Please login again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, []);

  return { profile, refreshProfile: fetchProfile };
}

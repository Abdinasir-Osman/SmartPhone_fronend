import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddUser() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "user",
    phone: "",
    profile_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [confirmMatch, setConfirmMatch] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setForm({ ...form, profile_image: files[0] });
      setProfileImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm({ ...form, [name]: value });
      if (name === "password") checkStrength(value);
      if (name === "confirm_password") setConfirmMatch(value === form.password);
      if (name === "password" && form.confirm_password) setConfirmMatch(value === form.confirm_password);
    }
  };

  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (score <= 1) setPasswordStrength("Weak");
    else if (score === 2) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    // Live validation for required fields
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirm_password) newErrors.confirm_password = "Confirm password is required";
    if (form.password !== form.confirm_password) newErrors.confirm_password = "Passwords do not match";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.profile_image) newErrors.profile_image = "Profile image is required";
    if (!form.role) newErrors.role = "Role is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await axios.post(`${API_BASE}/super/add-user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User created successfully. OTP sent to their email.");
      setForm({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "user",
        phone: "",
        profile_image: null,
      });
      setProfileImagePreview(null);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-4 sm:p-6 bg-white dark:bg-dark rounded-xl shadow font-segoe">
      <h2 className="text-2xl font-bold mb-4 text-primary">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="relative w-24 h-24 mx-auto">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary text-4xl text-gray-400">
                <span>+</span>
              </div>
            )}
            <input
              id="profile-image-upload"
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              required
            />
            <button
              type="button"
              onClick={() => document.getElementById('profile-image-upload').click()}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white shadow hover:bg-orange-700"
              tabIndex={-1}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
            </button>
          </div>
          {errors.profile_image && <p className="text-xs text-red-500 mt-1">{errors.profile_image}</p>}
        </div>
        <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className={`w-full px-4 py-2 border rounded ${errors.full_name ? 'border-red-500' : ''}`} required />
        {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={`w-full px-4 py-2 border rounded ${errors.email ? 'border-red-500' : ''}`} required />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded pr-10 ${errors.password ? 'border-red-500' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-2.5 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        {form.password && (
          <p className={`mt-1 text-xs font-segoe ${
            passwordStrength === "Weak"
              ? "text-red-500"
              : passwordStrength === "Medium"
              ? "text-yellow-500"
              : "text-green-600"
          }`}>
            Password Strength: {passwordStrength}
          </p>
        )}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`w-full px-4 py-2 border rounded pr-10 ${errors.confirm_password ? 'border-red-500' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-2.5 text-gray-500"
            tabIndex={-1}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password}</p>}
        {form.confirm_password && confirmMatch === false && (
          <p className="mt-1 text-xs text-red-500 font-segoe">Passwords do not match.</p>
        )}
        {form.confirm_password && confirmMatch === true && (
          <p className="mt-1 text-xs text-green-600 font-segoe">Passwords match.</p>
        )}
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={`w-full px-4 py-2 border rounded ${errors.phone ? 'border-red-500' : ''}`} required />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        <select name="role" value={form.role} onChange={handleChange} className={`w-full px-4 py-2 border rounded ${errors.role ? 'border-red-500' : ''}`} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-orange-700 transition disabled:opacity-50">
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
} 
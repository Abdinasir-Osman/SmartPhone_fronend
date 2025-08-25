import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function UpdateProfileForm({ profile, refreshProfile, token }) {
  console.log("PROFILE:", profile); // DEBUG: show profile data in console
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle image change when clicking pencil
  const handleImageClick = () => {
    if (!editing) {
      setEditing(true);
    } else {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        setFile(e.target.files[0]);
      };
      input.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      if (file) formData.append("file", file);

      await axios.put(`${API}/auth/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully");
      setEditing(false);
      setFile(null);
      refreshProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const role = profile.role || "admin";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 bg-light dark:bg-dark p-6 rounded-xl shadow font-segoe"
    >
      <div className="relative">
        <img
          src={`${API}${profile.profile_image}`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-dark dark:border-light"
        />
        <FaEdit
          onClick={handleImageClick}
          className="absolute bottom-1 right-1 text-light bg-primary rounded-full p-1 cursor-pointer hover:bg-dark"
          size={20}
        />
      </div>

      <h3 className="font-bold text-dark dark:text-light font-segoe">{profile.full_name}</h3>
      <p className="text-dark dark:text-light text-sm font-segoe">{profile.email}</p>

      {editing ? (
        <>
          <input
            type="text"
            className="input input-bordered w-full bg-light dark:bg-dark text-dark dark:text-light border-dark dark:border-light font-segoe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            className="input input-bordered w-full bg-light dark:bg-dark text-dark dark:text-light border-dark dark:border-light font-segoe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="input input-bordered w-full bg-light dark:bg-dark text-dark dark:text-light border-dark dark:border-light font-segoe"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full space-y-3 text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Profile Information</h2>
          <h3 className="font-bold text-xl text-dark dark:text-light">{profile.full_name}</h3>
          <p className="text-dark dark:text-light text-sm">{profile.email}</p>
          <p className="text-dark dark:text-light text-sm">{profile.phone || "N/A"}</p>
          {/* Status and Role */}
          <div className="flex flex-col items-center gap-2 mt-2">
            {/* Status Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${profile.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {profile.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            {/* Force Role Badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Admin
            </span>
          </div>
        </div>
      )}

      {editing && (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-light py-2 rounded hover:bg-dark disabled:opacity-50 font-segoe"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      )}
    </form>
  );
}

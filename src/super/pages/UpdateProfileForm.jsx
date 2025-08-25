import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function UpdateProfileForm({ profile, refreshProfile }) {
  const token = localStorage.getItem("token");
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

  const handleCancel = () => {
    setEditing(false);
    setFullName(profile.full_name);
    setEmail(profile.email);
    setPhone(profile.phone || "");
    setFile(null);
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

  // Debug log to see what values are being used for the profile image
  console.log("Profile image:", file, profile.profile_image);

  return (
    <div className="w-full max-w-md mx-auto font-segoe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="relative">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : profile.profile_image
                  ? profile.profile_image.startsWith('http')
                    ? profile.profile_image
                    : `${API}${profile.profile_image}`
                  : undefined
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary"
            />
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-orange-700"
            >
              <FaEdit size={16} />
            </button>
          </div>
        </div>
        {editing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-light dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
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
              {/* Role Label */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${profile.role === 'superadmin' ? 'bg-orange-100 text-orange-700' : profile.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                {profile.role === 'superadmin' ? 'Superadmin' : profile.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

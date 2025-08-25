import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminProfileCard({ profile, refreshProfile }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditClick = () => {
    if (editing) {
      document.getElementById('admin-profile-image-upload').click();
    } else {
      setEditing(true);
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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      if (file) {
        formData.append("file", file);
      }

      await axios.put(`${API_BASE}/auth/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
      setFile(null);
      if (refreshProfile) {
        refreshProfile();
      }
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-segoe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="relative">
            <img
              src={file ? URL.createObjectURL(file) : `${API_BASE}${profile.profile_image}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary"
            />
            <button
              type="button"
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-orange-700"
            >
              <FaEdit size={16} />
            </button>
            <input
              id="admin-profile-image-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-xs mx-auto sm:mx-auto my-6 sm:my-8 text-center space-y-3 px-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Profile Information</h2>
            <h3 className="font-bold text-xl text-dark dark:text-light">{profile.full_name}</h3>
            <p className="text-dark dark:text-light text-sm">{profile.email}</p>
            <p className="text-dark dark:text-light text-sm">{profile.phone || "N/A"}</p>
            <p className={`text-sm font-semibold mt-2 ${profile.status === "active" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              Status: {profile.status}
            </p>
            {/* Role Badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mt-1">
              Admin
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

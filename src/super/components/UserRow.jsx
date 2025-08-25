import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmInactiveModal from "../../components/ConfirmInactiveModal";

const API_BASE = import.meta.env.VITE_API_URL;

export default function UserRow({ user, refresh, mobile }) {
  const token = localStorage.getItem("token");
  const doRefresh = typeof refresh === "function" ? refresh : () => {
    console.warn("⚠️ refresh is not a function for user:", user.email);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  const toggleStatus = async (reason = null) => {
    try {
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Mar walba dir object, xitaa activate
      let data = {};
      if (user.status === "active" && reason) {
        data = { reason };
      }
      const res = await axios.patch(
        `${API_BASE}/super/toggle-status/${user.id}`,
        data, // <-- mar walba object
        config
      );
      if (res.status === 200 && res.data?.success === true) {
        toast.success("✅ Status updated");
        doRefresh();
      } else {
        toast.error("❌ Failed to update status");
      }
    } catch (err) {
      toast.error("❌ Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/super/delete-user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success("User deleted successfully!");
        doRefresh();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete user");
    }
    setShowDeleteModal(false);
  };

  const handleToggleClick = () => {
    if (user.status === "active") {
      setShowInactiveModal(true); 
    } else {
      toggleStatus(); 
    }
  };

  if (mobile) {
    return (
      <div className="bg-light dark:bg-dark rounded p-4 shadow text-dark dark:text-light font-segoe flex items-center gap-4">
        {user.profile_image ? (
          <img src={API_BASE + user.profile_image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div className="flex-1">
          <p><b>Name:</b> {user.full_name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Status:</b> <span className={user.status === "active" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>{user.status}</span></p>
          {user.status === "inactive" && user.inactive_reason && (
            <div className="text-xs text-red-500 mt-1">Sababta loo xannibay: {user.inactive_reason}</div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleToggleClick}
              className={`${user.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-3 py-1 rounded text-xs font-segoe`}
            >
              {user.status === "active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded flex items-center gap-1 text-xs font-segoe"
              title="Delete User"
            >
              <FaTrash /> Delete
            </button>
            <ConfirmDeleteModal
              open={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleDelete}
              user={user}
              blurBg={true}
            />
            <ConfirmInactiveModal
              open={showInactiveModal}
              onClose={() => setShowInactiveModal(false)}
              onConfirm={reason => toggleStatus(reason)}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <tr className="text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-800 font-segoe">
      <td className="p-2 border dark:border-gray-700 text-center">
        {user.profile_image ? (
          <img src={API_BASE + user.profile_image} alt="Profile" className="w-10 h-10 rounded-full object-cover mx-auto" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto font-bold">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </td>
      <td className="p-2 border dark:border-gray-700">{user.full_name}</td>
      <td className="p-2 border dark:border-gray-700">{user.email}</td>
      <td className="p-2 border dark:border-gray-700 capitalize">{user.role}</td>
      <td className={`p-2 border dark:border-gray-700 font-semibold ${user.status === "active" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>{user.status}</td>
      {user.status === "inactive" && user.inactive_reason && (
        <td className="p-2 border dark:border-gray-700 text-xs text-red-500">Sababta loo xannibay: {user.inactive_reason}</td>
      )}
      <td className="p-2 border dark:border-gray-700 flex gap-2 flex-wrap">
        <button
          onClick={handleToggleClick}
          className={`${user.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-3 py-1 rounded`}
        >
          {user.status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded flex items-center gap-1"
          title="Delete User"
        >
          <FaTrash /> Delete
        </button>
        <ConfirmDeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          user={user}
        />
        <ConfirmInactiveModal
          open={showInactiveModal}
          onClose={() => setShowInactiveModal(false)}
          onConfirm={reason => toggleStatus(reason)}
        />
      </td>
    </tr>
  );
}

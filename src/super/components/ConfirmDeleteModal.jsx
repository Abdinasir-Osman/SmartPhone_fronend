import React from "react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, user, blurBg }) {
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${blurBg ? 'backdrop-blur-sm' : ''}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-4 animate-fade-in">
        <h2 className="text-lg font-bold text-center text-red-600 mb-2">Delete User</h2>
        <p className="text-center text-gray-700 dark:text-gray-200 mb-4">
          Are you sure you want to delete user <b className="text-primary">{user.full_name}</b> (ID: <b>{user.id}</b>)?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold shadow"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold shadow"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 
import React from "react";

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Delete Order" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2 text-[#EC6325]">{title}</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-200">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 rounded-full bg-[#EC6325] text-white hover:bg-orange-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 
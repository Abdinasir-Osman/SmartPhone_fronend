import React, { useState } from "react";

const REASONS = [
  "Changed my mind",
  "Found better price elsewhere",
  "Ordered by mistake",
  "Shipping time too long",
  "Other"
];

export default function ConfirmCancelModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    onConfirm(finalReason);
    onClose();
    setReason(REASONS[0]);
    setCustomReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold mb-2 text-[#EC6325]">Cancel Order</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Please select a reason for cancelling this order:
        </p>
        <select
          className="w-full mb-4 px-3 py-2 rounded border"
          value={reason}
          onChange={e => setReason(e.target.value)}
        >
          {REASONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {reason === "Other" && (
          <input
            className="w-full mb-4 px-3 py-2 rounded border"
            placeholder="Enter your reason"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
          />
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-full bg-[#EC6325] text-white hover:bg-orange-700"
            disabled={reason === "Other" && !customReason.trim()}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from "react";

const REASONS = [
  {
    label: "Violation of terms",
    description: "User violated the platform's rules or terms of service."
  },
  {
    label: "Suspicious activity",
    description: "Unusual or potentially harmful activity detected on the account."
  },
  {
    label: "Requested by user",
    description: "User requested to deactivate their own account."
  },
  {
    label: "Inactivity",
    description: "Account has been inactive for a long period."
  },
  {
    label: "Other",
    description: "Provide a custom reason."
  }
];

export default function ConfirmInactiveModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState(REASONS[0].label);
  const [customReason, setCustomReason] = useState("");

  if (!open) return null;

  const selectedReasonObj = REASONS.find(r => r.label === reason);

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    onConfirm(finalReason);
    onClose();
    setReason(REASONS[0].label);
    setCustomReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl shadow-lg p-6 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-4 relative">
        <h2 className="text-lg font-bold mb-2 text-red-600">Deactivate User</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Please select a reason for deactivating this user:
        </p>
        <select
          className="w-full mb-2 px-3 py-2 rounded border border-[#EC6325] focus:border-[#EC6325] focus:ring-2 focus:ring-[#EC6325]"
          value={reason}
          onChange={e => setReason(e.target.value)}
        >
          {REASONS.map(r => (
            <option key={r.label} value={r.label}>{r.label}</option>
          ))}
        </select>
        <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 min-h-[18px]">
          {selectedReasonObj?.description}
        </div>
        {reason === "Other" && (
          <input
            className="w-full mb-4 px-3 py-2 rounded border border-[#EC6325] focus:border-[#EC6325] focus:ring-2 focus:ring-[#EC6325]"
            placeholder="Enter your reason"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            style={{ outlineColor: '#EC6325' }}
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
            className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
            disabled={reason === "Other" && !customReason.trim()}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
} 
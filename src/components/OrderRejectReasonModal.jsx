// Usage Example:
// <OrderRejectReasonModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleReject} loading={loading} />
// function handleReject(reason) { ... }

import React, { useState } from "react";

const REASONS = [
  "Out of stock",
  "Invalid payment",
  "Suspicious order",
  "Incorrect address",
  "Other"
];

export default function OrderRejectReasonModal({ open, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    if (finalReason && finalReason.trim().length > 2) {
      onSubmit(finalReason.trim());
      setReason("");
      setCustomReason("");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-segoe">
      <div className="bg-white dark:bg-[#0C2338] rounded-2xl p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-[#0C2338] dark:text-white font-segoe">Reject Order</h2>
        <label className="block mb-2 text-sm font-medium text-[#0C2338] dark:text-white font-segoe">Reason for rejection</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4 bg-light dark:bg-[#0C2338] text-[#0C2338] dark:text-white font-segoe focus:ring-2 focus:ring-[#EC6325]"
          value={reason}
          onChange={e => setReason(e.target.value)}
        >
          <option value="">Select reason</option>
          {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {reason === "Other" && (
          <input
            className="w-full border rounded px-3 py-2 mb-4 bg-light dark:bg-[#0C2338] text-[#0C2338] dark:text-white font-segoe focus:ring-2 focus:ring-[#EC6325]"
            placeholder="Enter custom reason"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
          />
        )}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-[#0C2338] dark:text-white rounded font-segoe hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#EC6325] text-white rounded font-segoe font-bold hover:bg-[#d95a1e] transition disabled:opacity-50"
            disabled={loading || !(reason && (reason !== "Other" || customReason.trim().length > 2))}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
} 
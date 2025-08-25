import React, { useState } from "react";
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';

const REASONS = [
  "Out of stock",
  "Invalid information",
  "Payment issue",
  "Order not allowed",
  "Other"
];

export default function ConfirmRejectModal({ open, onClose, onConfirm }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 relative">
        <h2 className="text-lg font-bold mb-2 text-red-600">Reject Order</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Please select a reason for rejecting this order:
        </p>
        <Listbox value={reason} onChange={setReason}>
          <div className="relative mb-4">
            <Listbox.Button className="w-full px-3 py-2 border border-[#EC6325] rounded flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#EC6325]">
              <span>{reason}</span>
              <ChevronUpDownIcon className="w-5 h-5 text-[#EC6325]" />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-full bg-white border border-[#EC6325] rounded shadow-lg z-10">
              {REASONS.map((r) => (
                <Listbox.Option
                  key={r}
                  value={r}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-[#EC6325] text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {r}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
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
            Reject Order
          </button>
        </div>
      </div>
    </div>
  );
} 
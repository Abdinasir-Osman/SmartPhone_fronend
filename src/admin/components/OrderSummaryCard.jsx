import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OrderSummaryCard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/admin/orders/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setSummary(res.data))
    .catch(err => console.error("Summary fetch failed:", err));
  }, []);

  if (!summary) return <p className="text-gray-500 dark:text-gray-300">Loading summary...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Orders */}
      <div className="rounded shadow p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Orders</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
      </div>

      {/* Pending */}
      <div className="rounded shadow p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Pending</h3>
        <p className="text-2xl font-bold text-yellow-500">{summary.pending}</p>
      </div>

      {/* Approved */}
      <div className="rounded shadow p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Approved</h3>
        <p className="text-2xl font-bold text-green-500">{summary.approved}</p>
      </div>

      {/* Rejected */}
      <div className="rounded shadow p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Rejected</h3>
        <p className="text-2xl font-bold text-red-500">{summary.rejected}</p>
      </div>
      {/* cancelled */}
      <div className="rounded shadow p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">cancelled</h3>
        <p className="text-2xl font-bold text-red-500">{summary.cancelled}</p>
      </div>
    </div>
  );
}

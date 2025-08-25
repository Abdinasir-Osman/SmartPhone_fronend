import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

  if (!summary) return <p className="text-dark dark:text-light font-segoe">Loading summary...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-segoe">
      {/* Total Orders */}
      <div className="rounded shadow p-4 flex flex-col items-start justify-center min-h-[90px] bg-[#FF9800] dark:bg-[#FFB74D]">
        <div className="flex items-center gap-2 mb-1">
          <FaClipboardList className="text-white text-xl md:text-2xl" />
          <h3 className="text-sm text-white font-segoe">Total Orders</h3>
        </div>
        <p className="text-2xl font-bold text-white font-segoe">{summary.total}</p>
      </div>
      {/* Pending */}
      <div className="rounded shadow p-4 flex flex-col items-start justify-center min-h-[90px] bg-[#FFC107] dark:bg-[#FFD54F]">
        <div className="flex items-center gap-2 mb-1">
          <FaHourglassHalf className="text-yellow-900 text-xl md:text-2xl" />
          <h3 className="text-sm text-yellow-900 font-segoe">Pending</h3>
        </div>
        <p className="text-2xl font-bold text-yellow-900 font-segoe">{summary.pending}</p>
      </div>
      {/* Approved */}
      <div className="rounded shadow p-4 flex flex-col items-start justify-center min-h-[90px] bg-[#2ECC40] dark:bg-[#27ae60]">
        <div className="flex items-center gap-2 mb-1">
          <FaCheckCircle className="text-white text-xl md:text-2xl" />
          <h3 className="text-sm text-white font-segoe">Approved</h3>
        </div>
        <p className="text-2xl font-bold text-white font-segoe">{summary.approved}</p>
      </div>
      {/* Rejected */}
      <div className="rounded shadow p-4 flex flex-col items-start justify-center min-h-[90px] bg-[#F44336] dark:bg-[#E57373]">
        <div className="flex items-center gap-2 mb-1">
          <FaTimesCircle className="text-white text-xl md:text-2xl" />
          <h3 className="text-sm text-white font-segoe">Rejected</h3>
        </div>
        <p className="text-2xl font-bold text-white font-segoe">{summary.rejected}</p>
      </div>
    </div>
  );
}

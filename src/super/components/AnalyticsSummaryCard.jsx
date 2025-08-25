// ✅ AnalyticsSummaryCard.jsx (styled with your style guide)
import React from "react";
import { FaUsers, FaClipboardList, FaDollarSign } from "react-icons/fa";

export default function AnalyticsSummaryCard({ data }) {
  return (
    <div className="bg-white dark:bg-dark shadow rounded-xl p-6 col-span-3 font-segoe">
      <h2 className="text-xl font-bold mb-4 text-dark dark:text-white">📊 Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-white hover:bg-dark hover:text-white dark:bg-primary dark:text-white dark:hover:bg-[#000223] dark:hover:text-white p-4 rounded-xl transition flex items-center gap-4">
          <FaUsers className="text-3xl md:text-4xl text-white opacity-90" />
          <div>
            <p className="text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{data.total_users}</h3>
          </div>
        </div>
        <div className="bg-[#FFA000] text-white hover:bg-dark hover:text-white dark:bg-[#C9A879] dark:text-white dark:hover:bg-primary dark:hover:text-white p-4 rounded-xl transition flex items-center gap-4">
          <FaClipboardList className="text-3xl md:text-4xl text-white opacity-90" />
          <div>
            <p className="text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold">{data.total_orders}</h3>
          </div>
        </div>
        <div className="bg-[#000223] text-white hover:bg-dark hover:text-white dark:bg-[#000223] dark:text-white dark:hover:bg-[#C9A879] dark:hover:text-white p-4 rounded-xl transition flex items-center gap-4">
          <FaDollarSign className="text-3xl md:text-4xl text-white opacity-90" />
          <div>
            <p className="text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold">${data.total_revenue}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

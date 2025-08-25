import React, { useEffect, useState, useRef } from "react";
import AnalyticsSummaryCard from "../components/AnalyticsSummaryCard";
import UserStatusChart from "../components/UsersStatusChart";
import OrdersTrendChart from "../components/OrdersTrendChart";
import TopPhonesChart from "../components/TopPhonesChart";
import { FaDownload, FaFilePdf, FaFileCsv, FaImage } from "react-icons/fa";
import axios from "axios";

export default function SuperAnalytics() {
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [orderTrend, setOrderTrend] = useState([]);
  const [topPhones, setTopPhones] = useState([]);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef();

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const handleExport = (type) => {
    setExportMenuOpen(false);
    // ...fetch file from backend and trigger download...
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statusRes, trendRes, phonesRes] = await Promise.all([
          axios.get(`${API}/super/analytics/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/super/analytics/user-status`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/super/analytics/orders-trend`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/super/analytics/top-phones`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSummary(summaryRes.data);
        setStatusData(statusRes.data);
        setOrderTrend(trendRes.data);
        setTopPhones(phonesRes.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-gray-100 dark:bg-dark min-h-screen font-poppins">
      {/* Export Button - moved to top right */}
      <div className="flex justify-end mb-4">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setExportMenuOpen((v) => !v)}
            className="btn-secondary flex items-center gap-2"
            title="Export Report"
          >
            <FaDownload /> Export
          </button>
          {exportMenuOpen && (
            <div ref={exportMenuRef} className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 animate-fade-in">
              <button onClick={() => handleExport('pdf')} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <FaFilePdf className="text-red-600" /> Download PDF
              </button>
              <button onClick={() => handleExport('csv')} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <FaFileCsv className="text-green-600" /> Download CSV
              </button>
              <button onClick={() => handleExport('image')} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <FaImage className="text-blue-600" /> Download Image
              </button>
            </div>
          )}
        </div>
      </div>
      {summary && <AnalyticsSummaryCard data={summary} />}

      {/* Orders Trend Chart (full width) */}
      <div className="w-full">
        {orderTrend.length > 0 && <OrdersTrendChart data={orderTrend} />}
      </div>
      {/* Top Phones Chart (full width, below Orders Trend) */}
      <div className="w-full">
        {topPhones.length > 0 && <TopPhonesChart data={topPhones} />}
      </div>
      {/* User Status Chart (full width, now at the bottom) */}
      <div className="w-full">
        {statusData && <UserStatusChart data={statusData} />}
      </div>
    </div>
  );
}


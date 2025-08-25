import React, { useState, useEffect, forwardRef } from "react";
import { FaDownload, FaFilePdf, FaFileCsv, FaImage, FaRegFile, FaSpinner, FaRegCalendar } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = import.meta.env.VITE_API_URL;

// Custom CSS for white calendar icon in dark mode and black in light mode
const calendarStyle = `
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: none;
    opacity: 1;
  }
  .dark input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(2);
    opacity: 1;
  }
  input[type="date"] {
    color: #222;
    background: #fff !important;
    border: 1.5px solid #FB8C00 !important;
    border-radius: 0.5rem;
    min-width: 120px;
    min-height: 3rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    box-shadow: none;
  }
  .dark input[type="date"] {
    color: #fff;
    background: #1e293b !important;
    border: 1.5px solid #FB8C00 !important;
  }
  input[type="date"]::placeholder {
    color: #111;
    opacity: 1;
    font-weight: 500;
  }
  .dark input[type="date"]::placeholder {
    color: #fff;
    opacity: 1;
    font-weight: 500;
  }
`;

// Custom input for react-datepicker with clickable calendar icon
const CustomDateInput = forwardRef(({ value, onClick, placeholder, onChange }, ref) => (
  <div className="relative w-full flex items-center">
    <input
      type="text"
      ref={ref}
      value={value || ""}
      onClick={onClick}
      onChange={onChange}
      placeholder={placeholder}
      className="input rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white min-w-[120px] w-full focus:outline-none focus:ring-2 focus:ring-primary pr-12"
      readOnly
    />
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 p-0 m-0 bg-transparent border-none cursor-pointer focus:outline-none"
      aria-label="Open calendar"
      style={{ pointerEvents: 'auto' }}
    >
      <FaRegCalendar
        className="text-gray-400 dark:text-gray-200 text-xl"
        aria-hidden="true"
      />
    </button>
  </div>
));

export default function Reports() {
  const [admin, setAdmin] = useState("");
  const [action, setAction] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${API_BASE}/super/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data.filter((u) => u.role === "admin"));
      } catch {
        setAdmins([]);
      }
    };
    fetchAdmins();
  }, [token]);

  const fetchReport = async () => {
    if (!startDate && !endDate) {
      toast.error("Please fill at least Start Date or End Date.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let endDateParam = undefined;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        endDateParam = end.toISOString();
      }
      const res = await axios.get(`${API_BASE}/super/reports/data`, {
        params: {
          admin_id: admin || undefined,
          action: action || undefined,
          start_date: startDate ? startDate.toISOString() : undefined,
          end_date: endDateParam,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response:", res.data); // <-- Best practice: log response
      setReportData(res.data);
      if (Array.isArray(res.data) && res.data.length === 0) {
        toast.info("No data found for the selected filter.");
      }
    } catch (err) {
      setError("Failed to fetch report data");
      setReportData([]);
      toast.error("Failed to fetch report data");
    }
    setLoading(false);
  };

  const handleExport = async (type) => {
    setExportMenuOpen(false);
    try {
      let endDateParam = undefined;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        endDateParam = end.toISOString();
      }
      const res = await axios.get(`${API_BASE}/super/reports/export/${type}`, {
        params: {
          admin_id: admin || undefined,
          action: action || undefined,
          start_date: startDate ? startDate.toISOString() : undefined,
          end_date: endDateParam,
        },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `admin_report.${type === "csv" ? "csv" : type === "pdf" ? "pdf" : "png"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Failed to export report");
    }
  };

  return (
    <>
      <style>{calendarStyle}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-2 pt-2 pb-8 sm:px-6 font-segoe mx-auto max-w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-primary text-left">Admin Reports</h1>

        {/* Filter Bar */}
        <div className="w-full flex justify-center">
          <div className="bg-white dark:bg-dark rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm mx-auto mb-6 flex flex-col gap-3 items-stretch
            sm:max-w-4xl sm:mx-auto sm:w-full sm:flex-row sm:flex-wrap sm:gap-6 sm:items-end">
            <div className="w-full sm:w-auto">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Admin</label>
              <select
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
                className="input rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px] w-full sm:w-auto"
                style={{ minHeight: 44, lineHeight: '1.5', paddingRight: 32 }}
              >
                <option value="">All</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="input rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px] w-full sm:w-auto"
                style={{ minHeight: 44, lineHeight: '1.5', paddingRight: 32 }}
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                placeholderText="mm/dd/yyyy"
                calendarClassName="dark:bg-gray-900 dark:text-white"
                dateFormat="MM/dd/yyyy"
                popperPlacement="bottom"
                customInput={<CustomDateInput placeholder="mm/dd/yyyy" />}
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                placeholderText="mm/dd/yyyy"
                calendarClassName="dark:bg-gray-900 dark:text-white"
                dateFormat="MM/dd/yyyy"
                popperPlacement="bottom"
                customInput={<CustomDateInput placeholder="mm/dd/yyyy" />}
              />
            </div>
            <button onClick={fetchReport} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition h-10 w-full sm:w-auto">Apply Filter</button>
            <div className="relative inline-block text-left w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={() => setExportMenuOpen((v) => !v)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto"
                title="Export Report"
              >
                <FaDownload /> Export
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button onClick={() => handleExport("pdf")} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                    <FaFilePdf className="text-red-600" /> Download PDF
                  </button>
                  <button onClick={() => handleExport("csv")} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                    <FaFileCsv className="text-green-600" /> Download CSV
                  </button>
                  <button onClick={() => handleExport("image")} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                    <FaImage className="text-blue-600" /> Download Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Preview */}
        <div className="overflow-x-auto bg-white dark:bg-dark rounded-xl shadow mt-2 min-w-[340px] mb-8 max-w-sm mx-auto
          sm:max-w-4xl sm:mx-auto sm:w-full">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <th className="p-3 font-bold text-left">Admin Name</th>
                <th className="p-3 font-bold text-center">Order ID</th>
                <th className="p-3 font-bold text-left">Model Name</th>
                <th className="p-3 font-bold text-center">Status</th>
                <th className="p-3 font-bold text-left">Reason</th>
                <th className="p-3 font-bold text-center">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-gray-400 flex flex-col items-center justify-center h-[220px]">
                    <FaSpinner className="text-3xl animate-spin mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="align-middle">
                    <div className="flex flex-col items-center justify-center w-full h-[220px] bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <FaRegFile className="text-5xl mb-3 text-red-400" />
                      <span className="text-base font-semibold text-red-500 dark:text-red-400">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="align-middle">
                    <div className="flex flex-col items-center justify-center w-full h-[220px] bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <FaRegFile className="text-5xl mb-3 text-gray-400" />
                      <span className="text-base font-semibold text-gray-500 dark:text-gray-300">No data found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reportData.map((row, i) => (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-dark"} hover:bg-orange-50 dark:hover:bg-gray-800 transition`}
                  >
                    <td className="p-3 text-left">{row.admin_name || "-"}</td>
                    <td className="p-3 text-center">{row.order_id || "-"}</td>
                    <td className="p-3 text-left">{row.model_name || "-"}</td>
                    <td className="p-3 text-center capitalize">{row.status || "-"}</td>
                    <td className="p-3 text-left">{row.reason || "-"}</td>
                    <td className="p-3 text-center">{moment(row.admin_action_time).format("YYYY-MM-DD HH:mm")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-gray-400 text-right mt-4">Designed by: <span className="text-primary font-semibold">Xaliye Phones</span></div>
      </div>
    </>
  );
}

// Usage Example:
// <NotificationDropdown userId={userId} />

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Sun, Moon } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_URL;

export default function NotificationDropdown({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [refresh, setRefresh] = useState(0);

  // Fetch notifications on mount and when userId changes
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/notifications/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (Array.isArray(res.data.notifications)) {
          setNotifications(res.data.notifications);
        } else {
          setNotifications([]);
        }
      })
      .finally(() => setLoading(false));
  }, [userId, refresh]);

  // Existing: Fetch notifications when dropdown is opened
  useEffect(() => {
    if (!userId) return;
    if (open) {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios.get(`${API_BASE}/notifications/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (Array.isArray(res.data)) {
            setNotifications(res.data);
          } else if (Array.isArray(res.data.notifications)) {
            setNotifications(res.data.notifications);
          } else {
            setNotifications([]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, userId, refresh]);

  const markAllRead = () => {
    const token = localStorage.getItem("token");
    axios.put(`${API_BASE}/notifications/all/${userId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setRefresh(r => r + 1);
    });
  };

  // Mark a single notification as read
  const markOneRead = (notifId) => {
    const token = localStorage.getItem("token");
    axios.put(`${API_BASE}/notifications/${notifId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    });
  };

  // Helper: get profile image
  const getProfileImage = (obj) => {
    if (!obj) return null;
    if (obj.profile_image) return `${API_BASE}${obj.profile_image}`;
    return null;
  };

  // Helper: fallback letter
  const getFallbackLetter = (obj) => {
    if (!obj) return "?";
    return obj.full_name ? obj.full_name.charAt(0).toUpperCase() : "?";
  };

  // Helper: notification content by role/type
  const renderNotificationContent = (n) => {
    // Helper to get phone/address from sender or extra_data.user
    const getPhone = () => n.sender?.phone || n.extra_data?.user?.phone || "N/A";
    const getAddress = () => n.sender?.address || n.extra_data?.user?.address || "N/A";
    // USER
    if (role === "user") {
      if (n.type === "approve") {
        return (
          <>
            <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1"><span>✔️</span>Order Approved</span>
            <div className="text-xs mt-1">Order: <b>{n.order?.model_name}</b> (x{n.order?.quantity})</div>
            <div className="text-xs">Status: <span className="text-green-600 font-bold">Approved</span></div>
          </>
        );
      }
      if (n.type === "reject") {
        return (
          <>
            <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1"><span>❌</span>Order Rejected</span>
            <div className="text-xs mt-1">Reason: <b>{n.extra_data?.reason}</b></div>
            {n.extra_data?.refund && <div className="text-xs text-green-600 font-bold">Refund processed</div>}
          </>
        );
      }
      if (n.type === "update") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><span>📝</span>Profile updated</span>
            <div className="text-xs mt-1">{n.extra_data?.update_type}</div>
          </>
        );
      }
      if (n.type === "update" && n.extra_data?.update_type === "password") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><span>🔑</span>Password updated</span>
            <div className="text-xs mt-1">Your password was successfully updated.</div>
          </>
        );
      }
      if (n.type === "update" && n.extra_data?.update_type === "profile_image") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><Camera size={16} />Profile image updated</span>
            <div className="text-xs mt-1">Your profile picture was successfully updated.</div>
          </>
        );
      }
      // fallback
      return <span>{n.message}</span>;
    }
    // ADMIN & SUPERADMIN
    if (role === "admin" || role === "superadmin") {
      if (n.type === "order") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><span>🆕</span>New Order</span>
            <div className="text-xs mt-1">User: <b>{n.sender?.full_name || n.extra_data?.user?.full_name}</b> ({n.sender?.email || n.extra_data?.user?.email})</div>
            <div className="text-xs">Phone: {getPhone()} | Address: {getAddress()}</div>
            <div className="text-xs">Order: <b>{n.order?.model_name || n.extra_data?.order?.model_name}</b> (x{n.order?.quantity || n.extra_data?.order?.quantity}) [{n.order?.order_type || n.extra_data?.order?.order_type}]</div>
            <div className="text-xs">Paid: {n.order?.paid || n.extra_data?.order?.paid ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>}</div>
          </>
        );
      }
      if (n.type === "order_cancelled") {
        return (
          <>
            <span className="font-semibold text-red-600 flex items-center gap-1"><span>🚫</span>Order Cancelled</span>
            <div className="text-xs mt-1">User: <b>{n.extra_data?.user}</b> ({n.extra_data?.user_email})</div>
            <div className="text-xs">Order ID: <b>{n.extra_data?.order_id}</b> | Model: <b>{n.extra_data?.model}</b></div>
            <div className="text-xs mt-1 text-red-600 font-bold">Reason: {n.extra_data?.reason}</div>
          </>
        );
      }
      if (n.type === "appeal") {
        return (
          <>
            <span className="font-semibold text-blue-600 flex items-center gap-1">📩 New Account Appeal</span>
            <div className="text-xs mt-1"><b>Message:</b> {n.extra_data?.appeal_message || n.message}</div>
            {n.extra_data?.contact_email && (
              <div className="text-xs"><b>Email:</b> {n.extra_data.contact_email}</div>
            )}
            {n.extra_data?.inactive_reason && (
              <div className="text-xs text-red-500"><b>Inactive Reason:</b> {n.extra_data.inactive_reason}</div>
            )}
          </>
        );
      }
      if (n.type === "update") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><span>📝</span>User Profile Updated</span>
            <div className="text-xs mt-1">{n.sender?.full_name || n.extra_data?.user?.full_name} updated {n.extra_data?.update_type}</div>
          </>
        );
      }
      if (n.type === "update" && n.extra_data?.update_type === "password") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><span>🔑</span>Password updated</span>
            <div className="text-xs mt-1">Your password was successfully updated.</div>
          </>
        );
      }
      if (n.type === "update" && n.extra_data?.update_type === "profile_image") {
        return (
          <>
            <span className="font-semibold text-[#EC6325] flex items-center gap-1"><Camera size={16} />Profile image updated</span>
            <div className="text-xs mt-1">Your profile picture was successfully updated.</div>
          </>
        );
      }
      // fallback
      return <span>{n.message}</span>;
    }
    // fallback universal
    return <span>{n.message}</span>;
  };

  // Helper: navigation by role/type
  const handleNotificationClick = (n) => {
    if (role === "user") {
      if (n.type === "approve" || n.type === "reject") {
        if (n.order?.id) navigate(`/user/orders/${n.order.id}`);
        else navigate("/user/orders");
      } else if (n.type === "update") {
        navigate("/user/profile");
      } else {
        navigate("/user/dashboard");
      }
    } else if (role === "admin") {
      if (n.type === "order" && n.order?.id) {
        navigate(`/admin/orders?orderId=${n.order.id}`);
      } else if (n.type === "update") {
        navigate("/admin/profile");
      } else {
        navigate("/admin/dashboard");
      }
    } else if (role === "superadmin") {
      if (n.type === "order" && n.order?.id) {
        navigate(`/super/orders?orderId=${n.order.id}`);
      } else if (n.type === "update") {
        navigate("/super/settings");
      } else {
        navigate("/super/dashboard");
      }
    } else {
      navigate("/");
    }
    setOpen(false);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    axios.put(`${API_BASE}/notifications/all/${userId}/read`).then(() => {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    });
  };

  // Helper: render notification card with relative time
  function renderNotificationCard(n) {
    return (
      <div
        key={n.id}
        className="w-full max-w-[400px] px-6 py-4 rounded-2xl mb-4 shadow-lg bg-white dark:bg-[#1e293b] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:bg-orange-50 dark:hover:bg-orange-900/20"
        onClick={() => {
          if (!n.is_read) markOneRead(n.id);
          handleNotificationClick(n);
        }}
        style={{ minWidth: 0 }}
      >
        {/* Profile Image */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {getProfileImage(role === "user" ? n.sender : n.sender) ? (
            <img
              src={getProfileImage(role === "user" ? n.sender : n.sender)}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-lg font-bold text-[#EC6325]">{getFallbackLetter(role === "user" ? n.sender : n.sender)}</span>
          )}
        </div>
        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#0C2338] dark:text-white font-segoe">
              {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
            </span>
            <span className="text-xs text-gray-400 font-segoe">
              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-segoe">
            {renderNotificationContent(n)}
          </div>
        </div>
      </div>
    );
  }

  // Helper: render notification card content
  function renderNotificationCardContent(n) {
    return <>
      {/* Profile Image */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {getProfileImage(role === "user" ? n.sender : n.sender) ? (
          <img
            src={getProfileImage(role === "user" ? n.sender : n.sender)}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-lg font-bold text-[#EC6325]">{getFallbackLetter(role === "user" ? n.sender : n.sender)}</span>
        )}
      </div>
      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#0C2338] dark:text-white font-segoe">
            {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
          </span>
          <span className="text-xs text-gray-400 font-segoe">
            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-segoe">
          {renderNotificationContent(n)}
        </div>
      </div>
    </>;
  }

  // Only render if userId is valid
  if (!userId) return null;

  return (
    <div className="relative font-segoe">
      <button onClick={() => setOpen(!open)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#EC6325" viewBox="0 0 24 24" width="28" height="28" className="inline-block align-middle">
          <path d="M12 2C8.13 2 5 5.13 5 9v5.28l-1.36 2.72A1 1 0 0 0 4.53 19h14.94a1 1 0 0 0 .89-1.47L19 14.28V9c0-3.87-3.13-7-7-7zm0 18c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
        </svg>
        {Array.isArray(notifications) && notifications.filter(n => !n.is_read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </button>
      {open && (
        <>
          {/* Overlay for click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            aria-hidden="true"
          />
          {/* SVG Arrow/Flare connecting bell and dropdown (desktop only) */}
          <div className="absolute right-12 top-full z-50 hidden sm:block" style={{ marginTop: '-8px' }}>
            <svg width="36" height="18" viewBox="0 0 36 18" className="block">
              <polygon points="18,0 36,18 0,18" fill="#fff" className="dark:fill-[#0C2338]" />
              <polygon points="18,2 33,17 3,17" fill="#fff" className="dark:fill-[#0C2338]" />
            </svg>
          </div>
          {/* Responsive dropdown */}
          <div
            className="sm:absolute sm:left-auto sm:right-8 sm:top-full sm:mt-2 sm:translate-x-0 sm:w-96 sm:max-w-md sm:rounded-2xl fixed left-4 right-4 top-16 mx-auto w-auto max-w-md rounded-2xl bg-white dark:bg-[#0C2338] shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
            style={{ maxWidth: '100vw' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#0C2338] dark:text-white font-segoe">Notifications</span>
              <button onClick={markAllRead} className="text-[#EC6325] text-sm font-bold hover:underline">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar flex flex-col items-center">
              {loading && <div className="text-gray-400">Loading...</div>}
              {!loading && Array.isArray(notifications) && notifications.length === 0 && <div className="text-gray-400">No notifications</div>}
              {Array.isArray(notifications) && (() => {
                // Group notifications by Today, Yesterday, Earlier
                const today = [];
                const yesterday = [];
                const earlier = [];
                [...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(n => {
                  const date = new Date(n.created_at);
                  if (isToday(date)) today.push(n);
                  else if (isYesterday(date)) yesterday.push(n);
                  else earlier.push(n);
                });
                return (
                  <>
                    {today.length > 0 && <div className="text-xs font-bold text-gray-500 mt-2 mb-1">Today</div>}
                    {today.map(n => renderNotificationCard(n))}
                    {yesterday.length > 0 && <div className="text-xs font-bold text-gray-500 mt-2 mb-1">Yesterday</div>}
                    {yesterday.map(n => renderNotificationCard(n))}
                    {earlier.length > 0 && <div className="text-xs font-bold text-gray-500 mt-2 mb-1">Earlier</div>}
                    {earlier.map(n => renderNotificationCard(n))}
                  </>
                );
              })()}
            </div>
            {/* Clear all notifications button */}
            <div className="pt-2 text-center">
              <button onClick={clearAllNotifications} className="text-red-500 text-sm font-bold hover:underline">Clear all Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
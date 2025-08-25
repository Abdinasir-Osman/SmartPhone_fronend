// src/pages/MyOrders.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { toast } from "react-toastify";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [phoneDetails, setPhoneDetails] = useState({});
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch orders
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Fetch phone details for each unique model_name
  useEffect(() => {
    const uniqueModels = [...new Set(orders.map(order => order.model_name))];
    uniqueModels.forEach(model => {
      if (!phoneDetails[model]) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/recommend/one`, { params: { model } })
          .then(res => {
            setPhoneDetails(prev => ({ ...prev, [model]: res.data }));
          })
          .catch(err => {
            console.error("Error fetching phone details for", model, err);
          });
      }
    });
    // eslint-disable-next-line
  }, [orders]);

  // Cancel order handler
  const handleCancelOrder = async (orderId, reason) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: "cancelled", reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order cancelled successfully");
      setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  // View function for order card
  function OrderCard({ order, phone }) {
    const isCancelled = order.status === "cancelled";
    const isPending = order.status === "pending";
    return (
      <div
        className={`flex items-center gap-4 p-5 rounded-xl shadow-md transition-all duration-300 border 
          ${order.status === "cancelled"
            ? "bg-yellow-50 border-yellow-200"
            : order.status === "rejected"
            ? "bg-red-50 border-red-200"
            : order.status === "approved"
            ? "bg-green-50 border-green-200"
            : order.status === "pending"
            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg"}
        `}
      >
        {/* Phone Image */}
        <div>
          {phone?.Image_URL ? (
            <img
              src={phone.Image_URL}
              alt={phone.model}
              className={`w-16 h-16 object-cover rounded shadow ${isCancelled ? "grayscale opacity-70" : ""}`}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded" />
          )}
        </div>
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-800 dark:text-white">{phone?.model || order.model_name}</span>
            {/* Status Badge */}
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${order.status === "pending"
                ? "bg-yellow-200 text-yellow-800"
                : order.status === "approved"
                ? "bg-green-200 text-green-800"
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700 border border-red-400 shadow-sm"
                : order.status === "rejected"
                ? "bg-gray-200 text-red-700 border border-red-400 shadow-sm"
                : "bg-gray-300 text-gray-700"
              }`
            }>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-1">
            <span className="font-semibold text-xs text-gray-400">Order #{order.id}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>
          {/* Cancel Order Button */}
          {isPending && (
            <button
              className="mt-2 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
              onClick={() => { setCancelOrderId(order.id); setCancelModalOpen(true); }}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-[#FB8C00] flex items-center gap-2">
        📦 <span><span className="text-[#FB8C00]">My</span> <span className="text-black dark:text-white">Orders</span></span>
      </h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const phone = phoneDetails[order.model_name];
            return <OrderCard key={order.id} order={order} phone={phone} />;
          })}
        </div>
      )}
      {/* Confirm Cancel Modal */}
      <ConfirmCancelModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={(reason) => handleCancelOrder(cancelOrderId, reason)}
      />
    </div>
  );
}

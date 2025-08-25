import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";
import ConfirmRejectModal from "../../components/ConfirmRejectModal";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OrderRow({ order, refresh }) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/admin/orders/${order.id}/status`,
        {
          new_status: action,
          reason: action === "approved" ? "Order approved" : "Order rejected",
          admin_action_time: new Date().toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order ${action}ed successfully`);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("❌ Action failed");
    }
  };

  return (
    <tr className="text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <td className="p-2 text-center">{order.id}</td>
      <td className="p-2">{order.full_name || "N/A"}</td>
      <td className="p-2">{order.model_name || "N/A"}</td>
      <td className="p-2 text-center">{order.quantity}</td>
      <td className="p-2">{order.phone_No || "N/A"}</td>
      <td className="p-2">{order.address || "N/A"}</td>
      <td className="p-2 capitalize text-center">{order.status}</td>
      <td className="p-2 text-center">{order.reason || "-"}</td>
      <td className="p-2 text-center">
        {order.created_at
          ? new Date(order.created_at).toLocaleString()
          : "N/A"}
      </td>
      <td className="p-2 flex gap-1 justify-center flex-wrap">
        {order.status === 'pending' && (
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => handleAction("approved")}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button 
              onClick={() => setRejectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              <XCircle size={18} />
              Reject
            </button>
            <ConfirmRejectModal
              open={rejectModalOpen}
              onClose={() => setRejectModalOpen(false)}
              onConfirm={async (reason) => {
                setLoading(true);
                try {
                  const token = localStorage.getItem("token");
                  await axios.put(
                    `${API_BASE}/admin/orders/${order.id}/status`,
                    {
                      new_status: "rejected",
                      reason: reason,
                      admin_action_time: new Date().toISOString(),
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Order Rejected");
                  refresh();
                } catch (err) {
                  toast.error("Failed to reject order!");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>
        )}
      </td>
    </tr>
  );
}

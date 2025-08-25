import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";

export default function PaymentForm() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");

  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (order_id) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${order_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAmount(res.data.total_price || 0);
        } catch (err) {
          console.error("Failed to load order:", err);
          toast.error("❌ Could not load order amount");
        }
      }
    };

    fetchOrder();

    const data = JSON.parse(localStorage.getItem("paymentUserData"));
    if (data) {
      setFullName(data.full_name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setAccountNo(data.phone_No || data.phone || "");
    }
  }, [order_id]);

  const handlePayment = async () => {
    if (!accountNo || !amount || !fullName || !email || !address) {
      toast.error("❌ Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const reference_id = "REF" + Date.now();
      const invoice_id = "INV" + Date.now();

      // ✅ Payment API call with proper response handling
      // Expected response structure from backend:
      // {
      //   success: boolean,
      //   message: string,
      //   data: { responseMsg: string, ... }
      // }
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/checkout`,
        null,
        {
          params: {
            account_no: accountNo,
            reference_id,
            invoice_id,
            amount: amount.toFixed(2)
          }
        }
      );
      
      // ✅ Log response for debugging
      console.log("Payment Response:", paymentRes.data);

      // ✅ Handle payment response properly
      if (paymentRes.data.success === false) {
        // Show only one error message
        let errorMessage = "❌ Payment failed";
        
        if (paymentRes.data.description && paymentRes.data.data && paymentRes.data.data.responseMsg) {
          // Show both description and responseMsg
          errorMessage = "❌ " + paymentRes.data.description + " - " + paymentRes.data.data.responseMsg;
        } else if (paymentRes.data.description) {
          errorMessage = "❌ " + paymentRes.data.description;
        } else if (paymentRes.data.data && paymentRes.data.data.responseMsg) {
          errorMessage = "❌ " + paymentRes.data.data.responseMsg;
        } else if (paymentRes.data.message) {
          errorMessage = "❌ " + paymentRes.data.message;
        }
        
        // ✅ Log the actual response for debugging
        console.log("Backend Response:", paymentRes.data);
        
        toast.error(errorMessage);
      } else if (paymentRes.data.success === true) {
        // Show success message
        let successMessage = "✅ Payment successful";
        if (paymentRes.data.message) {
          successMessage = "✅ " + paymentRes.data.message;
        }
        
        toast.success(successMessage);
        clearCart();
        localStorage.removeItem("paymentUserData");
      } else {
        // Fallback for unknown response format
        let fallbackMessage = "✅ Payment processed";
        if (paymentRes.data.responseMsg) {
          fallbackMessage = "✅ " + paymentRes.data.responseMsg;
        }
        
        toast.success(fallbackMessage);
        clearCart();
        localStorage.removeItem("paymentUserData");
      }


      clearCart();
      localStorage.removeItem("paymentUserData");
    } catch (error) {
      console.error("Payment error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        if (errorData.payload && errorData.payload.description) {
          toast.error("❌ " + errorData.payload.description);
        } else if (errorData.errorMessage) {
          toast.error("❌ " + errorData.errorMessage);
        } else if (errorData.message) {
          toast.error("❌ " + errorData.message);
        } else {
          toast.error("❌ Payment failed. Please try again.");
        }
      } else if (error.request) {
        // Network error
        toast.error("❌ Network error. Please check your connection.");
      } else {
        // Other error
        toast.error("❌ Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-[#0C2338] font-segoe">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Pay Now
        </h2>

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring dark:bg-[#1e293b] dark:text-white"
        />

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring dark:bg-[#1e293b] dark:text-white"
        />

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Phone Number</label>
        <input
          type="text"
          placeholder="2526xxxxxxx"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring dark:bg-[#1e293b] dark:text-white"
        />

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring dark:bg-[#1e293b] dark:text-white"
        />

        <div className="flex justify-between items-center bg-[#FFF8F2] dark:bg-[#1e293b] px-4 py-2 rounded mb-4">
          <span className="text-gray-700 dark:text-gray-200">💰 Total:</span>
          <span className="text-[#EC6325] font-semibold">
            ${parseFloat(amount).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#EC6325] text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

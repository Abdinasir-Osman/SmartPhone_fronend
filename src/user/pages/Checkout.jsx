import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { cart, clearCart, discount, discountRate, originalTotal, discountedTotal } = useCart();
  const [searchParams] = useSearchParams();

  // ✅ Get saved data from localStorage (OrderModal)
  const savedData = JSON.parse(localStorage.getItem("paymentUserData")) || {};

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    model_name: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      full_name: savedData.full_name || "",
      email: savedData.email || "",
      phone: savedData.phone || savedData.phone_No || "",
      address: savedData.address || "",
      model_name: savedData.model_name || "",
    });
  }, []);

  // Detect if this is a single phone order (from OrderModal)
  const isSingleOrder = cart.length === 0 && savedData.model_name;
  const totalAmount = isSingleOrder
    ? savedData.total_price || 0
    : (discount > 0 ? discountedTotal : originalTotal);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    const { full_name, email, phone, address } = formData;

    if (!full_name || !email || !phone || !address) {
      toast.error("❌ Please fill all fields");
      return;
    }

    const reference_id = "REF" + Date.now();
    const invoice_id = "INV" + Date.now();

    try {
      setLoading(true);

      // ✅ Payment API call with proper response handling
      // Expected response structure from backend:
      // {
      //   success: boolean,
      //   message: string,
      //   data: { responseMsg: string, ... }
      // }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/checkout`,
        null,
        {
          params: {
            account_no: phone,
            reference_id,
            invoice_id,
            amount: totalAmount.toFixed(2),
          },
        }
      );
      
      // ✅ Log response for debugging
      console.log("Payment Response:", res.data);

      // ✅ Handle payment response properly
      if (res.data.success === false) {
        // Show both description and responseMsg if available
        let errorMessage = "❌ Payment failed";
        
        if (res.data.description && res.data.data && res.data.data.responseMsg) {
          // Show both description and responseMsg
          errorMessage = "❌ " + res.data.description + " - " + res.data.data.responseMsg;
        } else if (res.data.description) {
          errorMessage = "❌ " + res.data.description;
        } else if (res.data.data && res.data.data.responseMsg) {
          errorMessage = "❌ " + res.data.data.responseMsg;
        } else if (res.data.message) {
          errorMessage = "❌ " + res.data.message;
        }
        
        // ✅ Log the actual response for debugging
        console.log("Backend Response:", res.data);
        
        toast.error(errorMessage);
      } else if (res.data.success === true) {
        // Show success message
        let successMessage = "✅ Payment successful";
        if (res.data.message) {
          successMessage = "✅ " + res.data.message;
        }
        
        toast.success(successMessage);
        clearCart();
        localStorage.removeItem("paymentUserData");
      } else {
        // Fallback for unknown response format
        let fallbackMessage = "✅ Payment processed";
        if (res.data.responseMsg) {
          fallbackMessage = "✅ " + res.data.responseMsg;
        }
        
        toast.success(fallbackMessage);
        clearCart();
        localStorage.removeItem("paymentUserData");
      }

    } catch (err) {
      console.error("Payment error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data;
        if (errorData.payload && errorData.payload.description) {
          toast.error("❌ " + errorData.payload.description);
        } else if (errorData.errorMessage) {
          toast.error("❌ " + errorData.errorMessage);
        } else if (errorData.message) {
          toast.error("❌ " + errorData.message);
        } else {
          toast.error("❌ Payment failed. Try again.");
        }
      } else if (err.request) {
        // Network error
        toast.error("❌ Network error. Please check your connection.");
      } else {
        // Other error
        toast.error("❌ Payment failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Pay Now
        </h2>

        {formData.model_name && (
          <div className="mb-3">
            <strong className="text-[#FB8C00]">📱 Model: </strong>
            <span className="text-gray-700 dark:text-gray-200">
              {formData.model_name}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            <input
              name="full_name"
              type="text"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Phone Number
            </label>
            <input
              name="phone"
              type="text"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.phone}
              onChange={handleChange}
              placeholder="2526xxxxxxx"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mt-4 text-right">
            {isSingleOrder ? (
              <span className="text-sm text-gray-700 dark:text-gray-200 mr-2">
                💰 <strong>Total:</strong> ${totalAmount.toFixed(2)}
              </span>
            ) : discount > 0 ? (
              <>
                <div className="text-gray-500 line-through text-base">
                  Original: ${originalTotal.toFixed(2)}
                </div>
                <div className="text-green-600 text-base">
                  Discount ({Math.round(discountRate * 100)}%): -${discount.toFixed(2)}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-200 mr-2">
                  💰 <strong>Total:</strong> ${discountedTotal.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-700 dark:text-gray-200 mr-2">
                💰 <strong>Total:</strong> ${totalAmount.toFixed(2)}
              </span>
            )}
          </div>

          <button
            disabled={loading}
            onClick={handlePayment}
            className="w-full bg-[#FB8C00] text-white py-2 rounded font-semibold"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

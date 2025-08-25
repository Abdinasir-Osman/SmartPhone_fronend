// ✅ src/pages/CartPage.jsx
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import BulkOrderModal from "../../components/BulkOrderModal";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, increment, decrement, discount, discountRate, originalTotal, discountedTotal } = useCart();
  const [isBulkOrderModalOpen, setIsBulkOrderModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <span className="text-[#FB8C00]">🛒</span>
        <span>
          <span className="text-black dark:text-white">Your</span>{" "}
          <span className="text-[#FB8C00]">Cart</span>
        </span>
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          <p>Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-[#FB8C00] text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Browse Phones
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded shadow-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <img
                  src={item.Image_URL}
                  alt={item.Model}
                  className="w-24 h-24 object-contain rounded mx-auto sm:mx-0"
                />
                <div className="flex-1 w-full">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-center sm:text-left">
                    {item.Brand} - {item.Model}
                  </h2>
                  <p className="text-sm text-[#FB8C00] text-center sm:text-left">
                    Price: ${item.Price}
                  </p>
                  <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                      onClick={() => decrement(item.Model)}
                      aria-label="Decrement"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-dark dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                      onClick={() => increment(item.Model)}
                      aria-label="Increment"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.Model)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Remove
              </button>
            </div>
          ))}

          {/* ✅ Show total, discount, and original price */}
          <div className="flex flex-col items-center gap-1 mt-4 rounded-lg bg-white dark:bg-gray-900 w-full max-w-xs mx-auto p-3 shadow-none">
            {discount > 0 ? (
              <>
                <div className="text-gray-500 line-through text-base">
                  Original: ${originalTotal.toFixed(2)}
                </div>
                <div className="text-green-600 text-base">
                  Discount ({Math.round(discountRate * 100)}%): -${discount.toFixed(2)}
                </div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Total: <span className="ml-2 text-[#FB8C00]">${discountedTotal.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Total: <span className="ml-2 text-[#FB8C00]">${originalTotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* ✅ Actions */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-6 w-full">
            <button
              onClick={clearCart}
              className="bg-[#FB8C00] hover:bg-[#fb7f00] text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              Clear Cart
            </button>

            <button
              onClick={() => setIsBulkOrderModalOpen(true)}
              className="bg-[#FB8C00] hover:bg-[#fb7f00] text-white px-6 py-3 rounded-lg w-full sm:w-auto text-center"
            >
              Place Bulk Order
            </button>
          </div>
        </div>
      )}
      
      {/* ✅ Bulk Order Modal */}
      {isBulkOrderModalOpen && (
        <BulkOrderModal onClose={() => setIsBulkOrderModalOpen(false)} />
      )}
    </div>
  );
}

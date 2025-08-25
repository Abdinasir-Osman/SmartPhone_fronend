// ✅ src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load from localStorage once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const exists = cart.find((x) => x.Model === item.Model);
    let updated;
    if (exists) {
      updated = cart.map((x) =>
        x.Model === item.Model ? { ...x, quantity: x.quantity + 1 } : x
      );
    } else {
      updated = [...cart, { ...item, quantity: 1 }];
    }
    setCart(updated);
  };

  const removeFromCart = (model) => {
    const updated = cart.filter((x) => x.Model !== model);
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  // ✅ Auto calculate total amount in USD
  const originalTotal = cart.reduce(
    (acc, item) => acc + item.Price * item.quantity,
    0
  );

  // Discount: 2% per item above 1, max 20%
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountRate = totalItems > 1 ? Math.min((totalItems - 1) * 0.02, 0.2) : 0;
  const discount = originalTotal * discountRate;
  const discountedTotal = originalTotal - discount;

  const increment = (model) => {
    setCart(cart => cart.map(x => x.Model === model ? { ...x, quantity: x.quantity + 1 } : x));
  };

  const decrement = (model) => {
    setCart(cart => cart.map(x => x.Model === model ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalAmount: discountedTotal, increment, decrement, discount, discountRate, originalTotal, discountedTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ Easy hook
export const useCart = () => useContext(CartContext);

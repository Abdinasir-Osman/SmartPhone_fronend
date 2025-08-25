import React, { useContext, useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserProfile from '../../hooks/useUserProfile';
import { toast } from 'react-toastify';
import axios from 'axios';
import PaymentModal from '../../components/PaymentModal';

const API_URL = import.meta.env.VITE_API_URL;

const OrderPage = () => {
  const { cart: cartItems, discount, getCartTotal, clearCart } = useCart();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const [orderInfo, setOrderInfo] = useState({ items: [], subtotal: 0, total: 0 });
  const [isSingleItemOrder, setIsSingleItemOrder] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', address: '' });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderDataForPayment, setOrderDataForPayment] = useState(null);

  // STRONG GUARD: Prevent any logic or render if single order and cart not empty
  const singleItem = location.state?.item;
  if (singleItem && cartItems.length > 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">You must clear your cart before placing a single order.</h2>
        <button onClick={() => navigate('/cart')} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">
          Go to Cart
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (singleItem) {
      setIsSingleItemOrder(true);
      const subtotal = singleItem.price * (singleItem.quantity || 1);
      const tax = subtotal * 0.05;
      setOrderInfo({
        items: [{...singleItem, quantity: singleItem.quantity || 1}],
        subtotal: subtotal,
        tax: tax,
        total: subtotal + tax,
      });
    } else {
      setIsSingleItemOrder(false);
      const subtotal = getCartTotal();
      const discountAmount = subtotal * discount;
      const subtotalAfterDiscount = subtotal - discountAmount;
      const tax = subtotalAfterDiscount * 0.05;
      setOrderInfo({
        items: cartItems,
        subtotal: subtotal,
        discountAmount: discountAmount,
        tax: tax,
        total: subtotalAfterDiscount + tax,
      });
    }
  }, [location.state, cartItems, discount, getCartTotal]);

  useEffect(() => {
    if (isSingleItemOrder && userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone_number || '',
        address: userProfile.address || '',
      });
    }
  }, [userProfile, isSingleItemOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSingleItemOrder && cartItems.length > 0) {
      toast.error('Please clear your cart before placing a single order.');
      return;
    }
    if (!formData.full_name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill all required fields.');
      return;
    }
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    const orderPayload = {
      ...formData,
      total_price: orderInfo.total,
      items: orderInfo.items.map(item => ({
        phone_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const { data: createdOrderResponse } = await axios.post(`${API_URL}/orders/bulk`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order details confirmed. Please proceed to payment.');
      const newOrder = Array.isArray(createdOrderResponse) ? createdOrderResponse[0] : createdOrderResponse;
      if (!newOrder || !newOrder.id) {
        toast.error("Could not get Order ID from server.");
        setIsProcessing(false);
        return;
      }
      if (isSingleItemOrder) {
        localStorage.setItem('paymentUserData', JSON.stringify({
          model_name: orderInfo.items[0]?.model,
          total_price: orderInfo.total,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }));
      }
      setOrderDataForPayment({
        invoice_id: newOrder.id,
        reference_id: newOrder.id,
        amount: orderInfo.total,
      });
      setIsPaymentModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    if (!isSingleItemOrder) {
      clearCart();
    }
    navigate('/user/orders');
    toast.success("Your order and payment were successful!");
  };

  if (orderInfo.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">There are no items to order.</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light dark:bg-dark min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light mb-8 text-center">Confirm Your Order</h1>
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="lg:order-last bg-white dark:bg-dark-light rounded-lg shadow-md p-8 h-fit">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {orderInfo.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={`${API_URL}${item.image}`} alt={item.model} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-dark dark:text-light">{item.model}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-dark dark:text-light">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-2">
                 <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${orderInfo.subtotal.toFixed(2)}</span>
                  </div>
                  {!isSingleItemOrder && orderInfo.discountAmount > 0 && (
                     <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-${orderInfo.discountAmount.toFixed(2)}</span>
                     </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Tax (5%)</span>
                    <span>${orderInfo.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-dark dark:text-light mt-2 pt-2 border-t dark:border-gray-600">
                    <span>Total</span>
                    <span>${orderInfo.total.toFixed(2)}</span>
                  </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">Shipping Information</h2>
              {profileLoading && isSingleItemOrder ? <p>Loading your details...</p> : (
                <div className="space-y-4">
                  {/* Form fields */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" name="full_name" id="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg bg-light dark:bg-dark" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg bg-light dark:bg-dark" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg bg-light dark:bg-dark" placeholder="e.g. 61xxxxxxx" required />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <textarea name="address" id="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg bg-light dark:bg-dark" required></textarea>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isProcessing || (profileLoading && isSingleItemOrder)}
                className="w-full mt-8 bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
              >
                {isProcessing ? 'Confirming...' : 'Confirm & Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isPaymentModalOpen && (
        <PaymentModal
          orderData={orderDataForPayment}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default OrderPage; 
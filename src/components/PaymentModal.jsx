import React from 'react';
import PaymentForm from './PaymentForm';
import { X } from 'lucide-react';

const PaymentModal = ({ orderData, onClose, onPaymentSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-2">
      <div className="bg-white dark:bg-dark-light rounded-lg shadow-xl w-full max-w-sm px-6 py-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-dark dark:text-light mb-6 text-center">
          Complete Your Payment
        </h2>
        <PaymentForm
          amount={orderData.amount}
          invoice_id={orderData.invoice_id}
          reference_id={orderData.reference_id}
          onSuccess={onPaymentSuccess}
        />
        <button
          onClick={onClose}
          className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

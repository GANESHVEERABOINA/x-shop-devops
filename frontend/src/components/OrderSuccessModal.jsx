import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessModal = ({ isOpen, onpåClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl scale-100 animate-scale-up">
        
        {/* Animated Checkmark Circle */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-[#ffc200]/20 rounded-full animate-ping"></div>
          <div className="relative w-full h-full bg-[#ffc200] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,194,0,0.5)]">
            <svg 
              className="w-10 h-10 text-black animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">
            Order <span className="text-[#ffc200]">Placed!</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Woohoo! Your order has been successfully confirmed and sent to our warehouse.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              navigate('/orders');
              window.scrollTo(0, 0);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
          >
            Track Order Status
          </button>
          
          <button
            onClick={() => {
              navigate('/');
              window.scrollTo(0, 0);
            }}
            className="w-full py-3 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-gray-500 text-gray-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessModal;
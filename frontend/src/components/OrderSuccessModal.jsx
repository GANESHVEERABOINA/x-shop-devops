import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

if (typeof document !== 'undefined' && !document.getElementById('xshop-order-modal-anim')) {
  const style = document.createElement('style');
  style.id = 'xshop-order-modal-anim';
  style.innerHTML = `
    @keyframes xshopModalIn {
      0% { opacity: 0; transform: scale(0.92) translateY(14px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes xshopCheckDraw {
      0% { stroke-dashoffset: 48; }
      100% { stroke-dashoffset: 0; }
    }
    .xshop-modal-enter {
      animation: xshopModalIn 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .xshop-check-stroke {
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: xshopCheckDraw 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.16s forwards;
    }
  `;
  document.head.appendChild(style);
}

const OrderSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTrackOrder = () => {
    onClose?.();
    navigate('/orders');
    window.scrollTo(0, 0);
  };

  const handleContinueShopping = () => {
    onClose?.();
    navigate('/collection');
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="xshop-modal-enter relative w-full max-w-[420px] rounded-[30px] overflow-hidden bg-[#08080f]/95 backdrop-blur-2xl border border-white/15 shadow-[0_32px_90px_-12px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.16)] p-7 sm:p-8 text-center"
      >
        {/* Ambient Electric Violet + Emerald Top Glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-44 rounded-full opacity-45"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.75) 0%, rgba(16,185,129,0.28) 50%, rgba(0,0,0,0) 75%)',
            filter: 'blur(38px)',
          }}
        />

        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass-pill flex items-center justify-center text-zinc-400 hover:text-white text-xs cursor-pointer"
        >
          ✕
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-5">
          {/* Brand Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-bold tracking-[0.22em] text-zinc-300 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>X·SHOP ORDER CONFIRMED</span>
          </div>

          {/* Animated Glowing Check Ring */}
          <div className="relative flex items-center justify-center pt-1">
            <span className="absolute w-24 h-24 rounded-full bg-violet-500/20 animate-ping" style={{ animationDuration: '2.4s' }} />
            <div className="relative w-20 h-20 rounded-full btn-violet flex items-center justify-center shadow-[0_0_45px_-6px_rgba(139,92,246,0.85)]">
              <svg
                className="w-9 h-9 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="xshop-check-stroke" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white">
              Order{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-violet-400 to-emerald-300">
                Placed!
              </span>
            </h2>
            <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed max-w-[300px] mx-auto">
              Your order is confirmed and sent straight to our warehouse for packing.
            </p>
          </div>

          {/* Mini Live Status Stepper */}
          <div className="w-full rounded-2xl bg-white/[0.035] border border-white/[0.08] px-4 py-3">
            <div className="flex items-center justify-between text-[10px] font-semibold">
              <div className="flex flex-col items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span>Confirmed</span>
              </div>

              <div className="flex-1 h-[2px] mx-2 -mt-4 bg-gradient-to-r from-emerald-400/70 to-violet-500/30 rounded-full" />

              <div className="flex flex-col items-center gap-1.5 text-violet-300">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400/40 border border-violet-400" />
                <span>Packing</span>
              </div>

              <div className="flex-1 h-[2px] mx-2 -mt-4 bg-white/10 rounded-full" />

              <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span>Shipped</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleTrackOrder}
              className="w-full py-3.5 px-5 rounded-2xl btn-violet text-xs sm:text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Track Order Status</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full py-3 px-5 rounded-2xl glass-pill text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
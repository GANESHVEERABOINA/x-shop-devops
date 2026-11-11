import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount, token } = useContext(ShopContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-[#0f0f0f] border-t border-neutral-800 py-2.5 px-6 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      
      <button
        onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          isActive('/') ? 'text-[#ffc200]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">🏠</span>
        <span className="text-[10px] font-bold tracking-wide">Home</span>
      </button>

      <button
        onClick={() => { navigate('/collection'); window.scrollTo(0, 0); }}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          isActive('/collection') ? 'text-[#ffc200]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">🛍️</span>
        <span className="text-[10px] font-bold tracking-wide">Collection</span>
      </button>

      <button
        onClick={() => { navigate(token ? '/orders' : '/login'); window.scrollTo(0, 0); }}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          isActive('/orders') ? 'text-[#ffc200]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">📦</span>
        <span className="text-[10px] font-bold tracking-wide">Orders</span>
      </button>

      <button
        onClick={() => { navigate(token ? '/profile' : '/login'); window.scrollTo(0, 0); }}
        className={`flex flex-col items-center gap-1 cursor-pointer transition ${
          isActive('/profile') ? 'text-[#ffc200]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">👤</span>
        <span className="text-[10px] font-bold tracking-wide">Account</span>
      </button>

      <button
        onClick={() => { navigate('/cart'); window.scrollTo(0, 0); }}
        className={`relative flex flex-col items-center gap-1 cursor-pointer transition ${
          isActive('/cart') ? 'text-[#ffc200]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">🛒</span>
        <span className="text-[10px] font-bold tracking-wide">Cart</span>
        {getCartCount() > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 bg-[#ffc200] text-black font-extrabold rounded-full text-[9px] flex items-center justify-center shadow">
            {getCartCount()}
          </span>
        )}
      </button>

    </div>
  );
};

export default MobileNav;
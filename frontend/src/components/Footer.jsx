import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#09090b] border-t border-neutral-800 text-white mt-16 pt-16 pb-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#ffc200] text-black font-extrabold px-2.5 py-1 rounded text-base tracking-wider shadow">
              X
            </div>
            <span className="text-lg font-extrabold tracking-widest text-white">
              SHOP
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            X-Shop is your ultimate destination for high-end fashion, clothing, and lifestyle products, powered by secure cloud architecture.
          </p>
        </div>

        {/* Col 2: Company */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#ffc200]">
            COMPANY
          </p>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
            <li><Link to="/" className="hover:text-[#ffc200] transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-[#ffc200] transition">About Us</Link></li>
            <li><Link to="/collection" className="hover:text-[#ffc200] transition">Delivery & Collection</Link></li>
            <li><Link to="/contact" className="hover:text-[#ffc200] transition">Contact Center</Link></li>
          </ul>
        </div>

        {/* Col 3: Get in Touch */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#ffc200]">
            GET IN TOUCH
          </p>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
            <li>📞 +91 (40) 555-0132</li>
            <li>✉️ support@xshop.com</li>
            <li>📍 Hyderabad, India</li>
          </ul>
        </div>

        {/* Col 4: X-Shop Plus */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#ffc200]">
            X-SHOP PLUS
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Subscribe to get instant alerts on flash sales and exclusive voucher codes.
          </p>
          <div className="inline-block bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase">
            ⚡ SECURE CLOUD STORE
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 X-Shop. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-[#ffc200] cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-[#ffc200] cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-[#ffc200] cursor-pointer transition">Cookie Preferences</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
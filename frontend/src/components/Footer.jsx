import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-6 md:mt-16 pb-20 md:pb-0 border-t border-white/[0.08] bg-black/75 backdrop-blur-xl text-zinc-400">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-7 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg btn-violet flex items-center justify-center font-extrabold text-xs md:text-sm">
                X
              </div>
              <span className="text-sm md:text-base font-bold tracking-tight text-white">
                X-Shop
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              X-Shop is your destination for modern fashion, clothing, and everyday essentials, powered by secure cloud architecture.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-200 uppercase">
              Company
            </p>
            <ul className="flex flex-wrap sm:flex-col gap-x-4 gap-y-1.5 text-xs">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collection" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-200 uppercase">
              Get in Touch
            </p>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li>+91 (40) 555-0132</li>
              <li>support@xshop.com</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 md:mt-10 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <p>© 2026 X-Shop. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-zinc-300 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-20 text-zinc-100 space-y-10">
      <div className="border-b border-white/[0.08] pb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          Support
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Contact Us
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {assets.contact_img && (
          <div className="lg:col-span-5 glass-card rounded-3xl overflow-hidden">
            <img
              src={assets.contact_img}
              alt="Contact X-Shop"
              className="w-full h-full object-cover max-h-[400px]"
            />
          </div>
        )}

        <div className={`${assets.contact_img ? 'lg:col-span-7' : 'lg:col-span-12'} glass-card rounded-3xl p-6 sm:p-10 space-y-6`}>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Headquarters
            </p>
            <h2 className="text-xl font-bold text-white">X-Shop Studio, Hyderabad</h2>
            <p className="text-sm text-zinc-400">
              HITEC City, Hyderabad, Telangana 500081, India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.08]">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-1">
              <p className="text-[11px] text-zinc-500 uppercase font-semibold">Phone</p>
              <p className="text-sm font-semibold text-white">+91 (40) 555-0132</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-1">
              <p className="text-[11px] text-zinc-500 uppercase font-semibold">Email</p>
              <p className="text-sm font-semibold text-white">support@xshop.com</p>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Support hours: Monday to Saturday, 9:00 AM – 7:00 PM IST.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
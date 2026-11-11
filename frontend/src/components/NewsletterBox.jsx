import React from 'react';
import { toast } from 'react-toastify';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast.success('Successfully subscribed to X-Shop alerts!');
  };

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl my-12">
      <div className="space-y-2 max-w-xl mx-auto">
        <span className="bg-[#ffc200]/10 text-[#ffc200] text-[11px] font-bold px-3 py-1 rounded-full uppercase">
          ⚡ STAY UPDATED
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          Get 20% Off Your First Order
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Subscribe to our newsletter and never miss out on exclusive drops and limited-time deals.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          className="w-full sm:flex-1 bg-black border border-neutral-700 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#ffc200]"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl cursor-pointer transition shadow-lg shrink-0"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
import React from 'react';

const OurPolicy = () => {
  return (
    <div className="my-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
      
      <div className="bg-[#111111] border border-neutral-800 hover:border-[#ffc200]/50 rounded-3xl p-6 text-center space-y-3 transition shadow-xl group">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#ffc200]/10 text-[#ffc200] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition">
          🔄
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-white">Easy Exchange Policy</h4>
        <p className="text-xs text-gray-400">We offer hassle free 10-day exchange policy on all fashion items.</p>
      </div>

      <div className="bg-[#111111] border border-neutral-800 hover:border-[#ffc200]/50 rounded-3xl p-6 text-center space-y-3 transition shadow-xl group">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#ffc200]/10 text-[#ffc200] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition">
          🛡️
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-white">7 Days Return Policy</h4>
        <p className="text-xs text-gray-400">We provide 7 days free return policy with instant bank refunds.</p>
      </div>

      <div className="bg-[#111111] border border-neutral-800 hover:border-[#ffc200]/50 rounded-3xl p-6 text-center space-y-3 transition shadow-xl group">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#ffc200]/10 text-[#ffc200] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition">
          🎧
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-white">Best Customer Support</h4>
        <p className="text-xs text-gray-400">We provide 24/7 dedicated customer support via chat and calls.</p>
      </div>

    </div>
  );
};

export default OurPolicy;
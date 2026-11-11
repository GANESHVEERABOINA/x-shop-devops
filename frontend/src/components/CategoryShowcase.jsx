import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CategoryShowcase = ({ title = '', items = [] }) => {
  const { navigate } = useContext(ShopContext);

  if (!items || items.length === 0) return null;

  const words = title.trim().split(' ');
  const lastWord = words.pop();
  const firstPart = words.join(' ');

  return (
    <div className="bg-[#0b0b0b] border border-neutral-800 rounded-3xl overflow-hidden shadow-xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-800 bg-[#111111]">
        <div className="inline-flex items-center gap-3">
          <h2 className="text-base sm:text-2xl font-extrabold tracking-wide text-white uppercase truncate">
            {firstPart} <span className="text-[#ffc200]">{lastWord}</span>
          </h2>
          <span className="w-6 sm:w-9 h-[3px] bg-[#ffc200] rounded-full shrink-0"></span>
        </div>

        <button
          onClick={() => navigate('/collection')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ffc200] hover:bg-[#ffcf33] text-black flex items-center justify-center text-sm font-extrabold transition cursor-pointer shadow shrink-0"
        >
          →
        </button>
      </div>

      {/* Fully Responsive Grid without side cuts */}
      <div className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 w-full">
        {items.slice(0, 4).map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => {
              navigate(`/product/${item.id}`);
              window.scrollTo(0, 0);
            }}
            className="group bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#ffc200] transition cursor-pointer flex flex-col justify-between"
          >
            <div className="w-full aspect-[3/4] bg-neutral-900 overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                {item.title}
              </p>
              <p className="text-xs sm:text-base font-extrabold text-[#ffc200] mt-1">
                {item.offer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;
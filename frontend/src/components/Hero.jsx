import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Hero = () => {
  const { products, navigate } = useContext(ShopContext);
  const showcaseItems = products.slice(0, 5);

  return (
    <div className="w-full pt-2 text-white">
      {/* Clean Hero Banner Only - No Category Bars */}
      <div className="w-full bg-gradient-to-r from-[#0d0d0d] via-[#131313] to-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-5/12 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-[2px] bg-[#ffc200]"></span>
              <span className="text-xs tracking-[0.22em] text-[#ffc200] font-semibold uppercase">
                FESTIVE OFFERS
              </span>
            </div>

            <h1 className="prata-regular text-3xl sm:text-5xl text-white leading-tight">
              Latest Arrivals
            </h1>

            <p className="text-xs sm:text-sm text-gray-400">
              Big Saving Days Special • Top brands at up to 70% off
            </p>

            <button
              onClick={() => navigate('/collection')}
              className="mt-2 bg-[#ffc200] hover:bg-[#ffcf33] text-black font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md transition cursor-pointer"
            >
              SHOP NOW
            </button>
          </div>

          {/* Right Product Preview Showcase */}
          <div className="w-full lg:w-7/12 flex items-center justify-center gap-2 sm:gap-3 h-[260px] sm:h-[320px] overflow-hidden">
            {showcaseItems.length > 0 ? (
              showcaseItems.map((item, idx) => {
                const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
                return (
                  <div
                    key={item._id || idx}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="relative h-full w-[18%] hover:w-[50%] rounded-3xl overflow-hidden cursor-pointer border border-neutral-800 transition-all duration-500 ease-in-out"
                  >
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-xs uppercase tracking-widest">
                Loading Showcase...
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
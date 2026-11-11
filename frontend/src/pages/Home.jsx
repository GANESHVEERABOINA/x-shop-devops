import React, { useContext } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import CategoryShowcase from '../components/CategoryShowcase';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { products, currency, userData, navigate } = useContext(ShopContext);

  const mensProducts = products ? products.filter((item) => item.category === 'Men').slice(0, 8) : [];
  const formattedMens = mensProducts.map((item) => ({
    id: item._id,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    title: item.name,
    offer: `${currency}${item.price}`,
  }));

  const dealsProducts = products ? products.filter((item) => item.bestseller).slice(0, 8) : [];
  const formattedDeals = dealsProducts.map((item) => ({
    id: item._id,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    title: item.name,
    offer: `Hot Deal: ${currency}${item.price}`,
  }));

  const userFirstName = userData?.name ? userData.name.split(' ')[0].toUpperCase() : 'USER';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <Hero />

      {products && products.length > 0 && (
        <div className="bg-gradient-to-b from-[#1a1333] via-[#111111] to-[#0b0b0b] border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-extrabold tracking-wide text-white uppercase">
                DEALS ENDING SOON, <span className="text-[#ffc200]">{userFirstName}!</span>
              </h2>
              <span className="w-8 h-[3px] bg-[#ffc200] rounded-full"></span>
            </div>
            <span className="bg-[#ffc200] text-black text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase">
              ⚡ Limited Time
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {products.slice(0, 5).map((item, idx) => {
              const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
              const sellingPrice = Number(item.price) || 499;
              const mrpPrice = Math.round(sellingPrice * 2.4);
              const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);

              return (
                <div
                  key={item._id || idx}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group relative bg-[#141414] border border-neutral-800 hover:border-[#ffc200] rounded-2xl overflow-hidden cursor-pointer transition"
                >
                  <span className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                    ↓{discountPercent}%
                  </span>
                  <div className="w-full aspect-[3/4] bg-neutral-900 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-extrabold text-[#ffc200]">
                        {currency}{sellingPrice}
                      </span>
                      <span className="text-[10px] text-gray-500 line-through">
                        {currency}{mrpPrice}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <LatestCollection />

      {products && products.length > 0 && (
        <div className="my-8 space-y-8">
          {formattedMens.length > 0 && (
            <CategoryShowcase title="TOP MEN'S COLLECTION" items={formattedMens} />
          )}
          {formattedDeals.length > 0 && (
            <CategoryShowcase title="TODAY'S HOT DEALS" items={formattedDeals} />
          )}
        </div>
      )}

      <BestSeller />
      <OurPolicy />
    </div>
  );
};

export default Home;
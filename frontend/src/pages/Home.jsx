import React, { useContext, useMemo, useState } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import ProductItem from '../components/ProductItem';
import ProductSkeleton from '../components/ProductSkeleton';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { products, productsLoading, search, navigate } = useContext(ShopContext);
  const [mobileTab, setMobileTab] = useState('All');

  const isLoading = productsLoading || !products || products.length === 0;

  const filteredMobileProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((item) => {
      const matchesTab =
        mobileTab === 'All' ||
        item.category === mobileTab ||
        item.subCategory === mobileTab;
      const matchesSearch =
        !search ||
        (item.name && item.name.toLowerCase().includes(search.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [products, mobileTab, search]);

  // Keep 2-column mobile grid balanced without an orphaned half-row gap
  const balancedMobileProducts = useMemo(() => {
    const total = filteredMobileProducts.length;
    if (total <= 1) return filteredMobileProducts;
    const evenCount = total % 2 === 0 ? total : total - 1;
    return filteredMobileProducts.slice(0, evenCount);
  }, [filteredMobileProducts]);

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pb-8 md:pb-6 space-y-2.5 md:space-y-4">
      <Hero selectedMobileTab={mobileTab} onSelectMobileTab={setMobileTab} />

      {/* MOBILE (< 768px): Balanced 2-Column Grid + No Orphan Gap */}
      <div className="md:hidden pt-1 space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">
            {mobileTab === 'All' ? 'Latest Arrivals' : mobileTab}
          </h2>
          {!isLoading && (
            <button
              type="button"
              onClick={() => {
                navigate('/collection');
                window.scrollTo(0, 0);
              }}
              className="text-[11px] font-semibold text-violet-300 hover:text-white transition cursor-pointer tabular-nums"
            >
              See all ({filteredMobileProducts.length}) →
            </button>
          )}
        </div>

        {!isLoading && filteredMobileProducts.length === 0 ? (
          <div className="glass-card rounded-2xl py-8 px-4 text-center space-y-2">
            <p className="text-xs font-semibold text-white">No products in {mobileTab}</p>
            <button
              type="button"
              onClick={() => setMobileTab('All')}
              className="text-xs text-violet-400 font-semibold cursor-pointer"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : balancedMobileProducts.map((item, index) => (
                  <ProductItem
                    key={item._id || index}
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                  />
                ))}
          </div>
        )}
      </div>

      {/* DESKTOP & TABLET (>= 768px): Full Storefront Sections */}
      <div className="hidden md:block space-y-4">
        <LatestCollection />
        <BestSeller />
        <OurPolicy />
      </div>
    </div>
  );
};

export default Home;
import React, { useContext, useMemo, useState } from 'react';
import Hero from '../components/Hero';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import ProductItem from '../components/ProductItem';
import ProductSkeleton from '../components/ProductSkeleton';
import { ShopContext } from '../context/ShopContext';

const FILTER_TABS = [
  'All',
  'Men',
  'Women',
  'Kids',
  'Topwear',
  'Bottomwear',
  'Winterwear',
];

const Home = () => {
  const { products, productsLoading, search, setSearch, navigate } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('All');

  const isLoading = productsLoading || !products || products.length === 0;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((item) => {
      const matchesTab =
        activeTab === 'All' ||
        item.category === activeTab ||
        item.subCategory === activeTab;
      const matchesSearch =
        !search ||
        (item.name && item.name.toLowerCase().includes(search.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, search]);

  const balancedMobileProducts = useMemo(() => {
    const total = filteredProducts.length;
    if (total <= 1) return filteredProducts;
    const evenCount = total % 2 === 0 ? total : total - 1;
    return filteredProducts.slice(0, evenCount);
  }, [filteredProducts]);

  return (
    <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 pb-8 space-y-8 md:space-y-10">
      <Hero />

      {/* Explore Our Collection */}
      <section id="explore-collection" className="space-y-5 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
              Curated Catalog
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Explore Our Collection
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              navigate('/collection');
              window.scrollTo(0, 0);
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer self-start sm:self-auto"
          >
            View All ({filteredProducts.length}) →
          </button>
        </div>

        {/* Filter Pills Left + Search Pill Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'btn-primary'
                      : 'glass-pill text-zinc-300 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 glass-input rounded-full px-4 py-2 w-full lg:w-72 shrink-0">
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Product..."
              className="w-full bg-transparent outline-none text-xs text-white placeholder:text-zinc-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {!isLoading && filteredProducts.length === 0 ? (
          <div className="glass-card rounded-3xl py-14 px-6 text-center space-y-2.5">
            <p className="text-sm font-semibold text-white">
              No products found for "{search || activeTab}"
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('All');
                setSearch('');
              }}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Balanced 2-Column Grid */}
            <div className="grid grid-cols-2 gap-2.5 md:hidden">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                : balancedMobileProducts.slice(0, 8).map((item, index) => (
                    <ProductItem
                      key={item._id || index}
                      id={item._id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
            </div>

            {/* Desktop & Tablet Compact 5-Column Grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {isLoading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                : filteredProducts.slice(0, 10).map((item, index) => (
                    <ProductItem
                      key={item._id || index}
                      id={item._id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
            </div>
          </>
        )}
      </section>

      <div className="hidden md:block space-y-6">
        <BestSeller />
        <OurPolicy />
      </div>
    </div>
  );
};

export default Home;
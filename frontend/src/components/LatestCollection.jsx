import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import ProductSkeleton from './ProductSkeleton';

const LatestCollection = () => {
  const { products, productsLoading, navigate } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  const isLoading = productsLoading || !products || products.length === 0;

  return (
    <section className="py-10 space-y-6 text-zinc-100">
      {/* Minimal Header */}
      <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
            New Arrivals
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Latest Collection
          </h2>
        </div>

        <button
          onClick={() => {
            navigate('/collection');
            window.scrollTo(0, 0);
          }}
          className="glass-pill text-xs font-semibold text-zinc-300 hover:text-white px-4 py-2 rounded-xl cursor-pointer shrink-0"
        >
          View All →
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : latestProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
      </div>
    </section>
  );
};

export default LatestCollection;
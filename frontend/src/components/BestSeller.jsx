import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import ProductSkeleton from './ProductSkeleton';

const BestSeller = () => {
  const { products, productsLoading } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  const isLoading = productsLoading || !products || products.length === 0;

  if (!isLoading && bestSeller.length === 0) return null;

  return (
    <section className="py-10 space-y-6 text-zinc-100">
      {/* Minimal Header */}
      <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
            Most Popular
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Best Sellers
          </h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : bestSeller.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))}
      </div>
    </section>
  );
};

export default BestSeller;
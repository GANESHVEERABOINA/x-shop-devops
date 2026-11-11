import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10 space-y-8 text-white">
      {/* Unified Website Heading */}
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase">
          🔥 X-SHOP TOP PICKS
        </span>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="text-xs sm:text-sm text-emerald-400 font-medium">
          Most Loved Styles by X-Shop Customers
        </p>
      </div>

      {/* Product Grid */}
      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {bestSeller.map((item, index) => (
            <ProductItem
              key={item._id || index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
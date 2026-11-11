import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  if (related.length === 0) return null;

  return (
    <div className="my-10 space-y-8 text-white">
      {/* Unified Website Heading */}
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase">
          ✨ YOU MIGHT ALSO LIKE
        </span>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      {/* Product Grid */}
      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {related.map((item, index) => (
            <ProductItem
              key={item._id || index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
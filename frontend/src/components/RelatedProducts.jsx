import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      if (category) {
        productsCopy = productsCopy.filter((item) => category === item.category);
      }
      if (subCategory) {
        productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      }
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-white/[0.08] space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          More Like This
        </p>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Related Products
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </section>
  );
};

export default RelatedProducts;
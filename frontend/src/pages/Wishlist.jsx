import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Wishlist = () => {
  const { products, wishlist, navigate } = useContext(ShopContext);
  const wishlistedProducts = products.filter(item => wishlist.includes(item._id));

  return (
    <div className="max-w-7xl mx-auto pt-6 pb-20 px-4 sm:px-6 text-white">
      <div className="mb-8">
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
          <p className="text-base font-bold text-gray-300">Your wishlist is empty.</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-[#ffc200] text-black font-extrabold text-xs px-6 py-3 rounded-2xl cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {wishlistedProducts.map((item, index) => (
            <ProductItem
              key={item._id || index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
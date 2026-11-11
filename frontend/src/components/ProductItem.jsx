import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency, wishlist, toggleWishlist } = useContext(ShopContext);
  const imgUrl = Array.isArray(image) ? image[0] : image;
  const isWishlisted = wishlist.includes(id);

  return (
    <div className="relative group bg-[#141414] border border-neutral-800 hover:border-[#ffc200] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg w-full">
      
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(id);
        }}
        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-sm shadow cursor-pointer transition hover:scale-110"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>

      <Link onClick={() => window.scrollTo(0, 0)} to={`/product/${id}`} className="cursor-pointer">
        <div className="w-full aspect-[3/4] bg-neutral-900 overflow-hidden relative">
          <img
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            src={imgUrl}
            alt={name}
          />
        </div>
        <div className="p-3.5 space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-200 truncate">{name}</p>
          <p className="text-sm sm:text-base font-extrabold text-[#ffc200]">
            {currency}{price}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
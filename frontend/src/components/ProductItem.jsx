import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { products, currency, wishlist, toggleWishlist } = useContext(ShopContext);
  const imgUrl = Array.isArray(image) ? image[0] : image;
  const isWishlisted = wishlist.includes(id);
  const productMeta = products.find((p) => p._id === id);
  const isSoldOut = Boolean(productMeta?.soldOut);

  return (
    <div className="relative group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between w-full min-w-0">
      {isSoldOut && (
        <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow">
          Sold Out
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(id);
        }}
        aria-label="Toggle wishlist"
        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/15 hover:border-violet-400/60 flex items-center justify-center cursor-pointer transition-all hover:scale-110"
      >
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
            isWishlisted ? 'text-violet-400 fill-violet-400' : 'text-zinc-300 fill-none'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <Link onClick={() => window.scrollTo(0, 0)} to={`/product/${id}`} className="cursor-pointer block">
        <div className="w-full aspect-[3/4] bg-zinc-950 overflow-hidden relative">
          <img
            className={`w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ${
              isSoldOut ? 'opacity-50 grayscale' : ''
            }`}
            src={imgUrl}
            alt={name}
            loading="lazy"
          />
        </div>
        <div className="p-2.5 sm:p-3.5 space-y-1">
          <p className="text-[11px] sm:text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
            {name}
          </p>
          <div className="flex items-center justify-between gap-1.5">
            <p className="text-xs sm:text-base font-bold text-white tabular-nums shrink-0">
              {currency}{price}
            </p>
            <span className={`text-[10px] sm:text-[11px] font-medium truncate transition-colors ${isSoldOut ? 'text-rose-400' : 'text-zinc-500 group-hover:text-violet-400'}`}>
              {isSoldOut ? 'Sold out' : 'View →'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
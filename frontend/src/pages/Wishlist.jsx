import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const Wishlist = () => {
  const { products, wishlist, navigate } = useContext(ShopContext);
  const wishlistedProducts = products.filter((item) => wishlist.includes(item._id));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-20 text-zinc-100">
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
            Saved
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Wishlist
          </h1>
        </div>
        <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-zinc-400 tabular-nums">
          {wishlistedProducts.length} saved
        </span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="glass-card rounded-3xl py-20 px-6 text-center space-y-5 max-w-2xl mx-auto">
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-white">No saved items yet</p>
            <p className="text-xs text-zinc-500">
              Tap the heart icon on any product to save it here for later.
            </p>
          </div>
          <button
            onClick={() => {
              navigate('/collection');
              window.scrollTo(0, 0);
            }}
            className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Browse Collection →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistedProducts.map((item, index) => (
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
  );
};

export default Wishlist;
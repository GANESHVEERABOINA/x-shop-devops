import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleProceedToCheckout = () => {
    const isLoggedIn = Boolean(token || localStorage.getItem('token'));
    if (!isLoggedIn) {
      toast.info('Please sign in to proceed to checkout');
      navigate('/login', { state: { from: '/place-order' } });
      window.scrollTo(0, 0);
      return;
    }
    navigate('/place-order');
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-20 text-zinc-100">
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
            Bag
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Cart
          </h1>
        </div>
        {cartData.length > 0 && (
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-zinc-400 tabular-nums">
            {cartData.length} item{cartData.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {cartData.length === 0 ? (
        <div className="glass-card rounded-3xl py-20 px-6 text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-white">Your cart is empty</p>
            <p className="text-xs text-zinc-500">
              Looks like you have not added any products yet.
            </p>
          </div>
          <button
            onClick={() => {
              navigate('/collection');
              window.scrollTo(0, 0);
            }}
            className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Explore Collection →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-3">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;
              const imgUrl = Array.isArray(productData.image)
                ? productData.image[0]
                : productData.image;

              return (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      onClick={() => navigate(`/product/${productData._id}`)}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover object-top rounded-xl border border-white/10 cursor-pointer shrink-0 bg-zinc-950"
                      src={imgUrl}
                      alt={productData.name}
                    />
                    <div className="space-y-1.5 min-w-0">
                      <p
                        onClick={() => navigate(`/product/${productData._id}`)}
                        className="text-sm sm:text-base font-semibold text-white truncate cursor-pointer hover:text-violet-300 transition"
                      >
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="font-bold text-white tabular-nums">
                          {currency}{productData.price}
                        </span>
                        <span className="glass-pill px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-zinc-300">
                          Size {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper + Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-1 glass-pill rounded-xl p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, Math.max(0, item.quantity - 1))
                        }
                        className="w-7 h-7 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      aria-label="Remove item"
                      className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 flex items-center justify-center cursor-pointer transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 space-y-6 lg:sticky lg:top-24">
            <CartTotal />
            <button
              onClick={handleProceedToCheckout}
              className="w-full btn-primary py-3.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
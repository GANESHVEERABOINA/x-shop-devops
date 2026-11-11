import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let tempData = [];
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

  const getSubtotal = () => {
    let total = 0;
    cartData.forEach((cartItem) => {
      const productData = products.find((product) => product._id === cartItem._id);
      if (productData) {
        total += productData.price * cartItem.quantity;
      }
    });
    return total;
  };

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 0 ? 50 : 0;
  const totalAmount = subtotal > 0 ? subtotal + shippingFee : 0;

  return (
    <div className="pt-6 pb-20 text-white max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="mb-8">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
          <p className="text-lg font-bold text-gray-300">Your X-Shop cart is currently empty.</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-sm px-6 py-3 rounded-2xl transition cursor-pointer shadow-lg"
          >
            Explore Collection →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Cart Items List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;
              const imgUrl = Array.isArray(productData.image) ? productData.image[0] : productData.image;

              return (
                <div
                  key={index}
                  className="bg-[#111111] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl hover:border-neutral-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={imgUrl}
                      alt={productData.name}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                        {productData.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-extrabold text-[#ffc200]">
                          {currency}{productData.price}
                        </span>
                        <span className="bg-neutral-900 border border-neutral-700 text-gray-300 text-xs px-2.5 py-0.5 rounded-lg font-bold">
                          {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="text-gray-500 hover:text-red-400 transition cursor-pointer p-1"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                    
                    <div className="flex items-center bg-black border border-neutral-700 rounded-xl overflow-hidden shadow">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item._id, item.size, item.quantity - 1);
                          }
                        }}
                        className="px-3 py-1.5 text-gray-400 hover:text-white transition font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-extrabold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-400 hover:text-white transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Cart Totals & Checkout Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-800 pb-4">
              <Title text1={'CART'} text2={'TOTALS'} />
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex justify-between py-2 border-b border-neutral-900">
                <span>Subtotal</span>
                <span className="font-bold text-white">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-900">
                <span>Shipping Fee</span>
                <span className="font-bold text-white">{currency}{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-[#ffc200] text-lg">{currency}{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/place-order')}
              className="w-full py-4 rounded-2xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-sm tracking-wider uppercase transition cursor-pointer shadow-[0_4px_20px_rgba(255,194,0,0.25)]"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
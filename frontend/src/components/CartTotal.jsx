import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full space-y-4 text-zinc-100">
      <h3 className="text-base font-semibold text-white">Order Summary</h3>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="text-zinc-200 font-medium tabular-nums">
            {currency}{subtotal}.00
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-400">
          <span>Shipping</span>
          <span className="text-zinc-200 font-medium tabular-nums">
            {subtotal === 0 ? `${currency}0.00` : `${currency}${delivery_fee}.00`}
          </span>
        </div>

        <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-lg font-bold text-white tabular-nums">
            {currency}{total}.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
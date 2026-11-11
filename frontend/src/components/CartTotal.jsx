import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl'>
      
      <div className='text-2xl mb-6'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-4 text-sm sm:text-base'>
            <div className='flex justify-between items-center transition-all hover:pl-1 duration-300'>
                <p className='text-gray-400'>Subtotal</p>
                <p className='text-white font-medium tracking-wide'>{currency} {getCartAmount()}.00</p>
            </div>
            
            <hr className='border-white/10' />
            
            <div className='flex justify-between items-center transition-all hover:pl-1 duration-300'>
                <p className='text-gray-400'>Shipping Fee</p>
                <p className='text-white font-medium tracking-wide'>{currency} {delivery_fee}.00</p>
            </div>
            
            <hr className='border-white/10' />
            
            <div className='flex justify-between items-center pt-2'>
                <b className='text-white text-lg font-semibold tracking-wide'>Total</b>
                <b className='text-white text-xl tracking-wide'>
                  {currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
                </b>
            </div>
      </div>
      
    </div>
  )
}

export default CartTotal
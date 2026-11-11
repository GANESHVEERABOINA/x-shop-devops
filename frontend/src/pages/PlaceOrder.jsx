import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderSuccessModal from '../components/OrderSuccessModal';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency, userData, fetchUserProfile } = useContext(ShopContext);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India',
    phone: ''
  });

  const hasSavedAddresses = userData?.addresses && userData.addresses.length > 0;

  useEffect(() => {
    if (userData) {
      if (userData.email) setFormData(prev => ({ ...prev, email: userData.email }));
      if (userData.name) {
        const parts = userData.name.split(' ');
        setFormData(prev => ({ ...prev, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' }));
      }
      if (hasSavedAddresses) {
        const first = userData.addresses[0];
        setSelectedAddrId(first.id);
        setFormData(prev => ({
          ...prev,
          street: first.street || '',
          city: first.city || '',
          state: first.state || '',
          zipcode: first.zipcode || '',
          country: first.country || 'India',
          phone: first.phone || ''
        }));
      }
    }
  }, [userData]);

  const handleSelectAddress = (addr) => {
    setSelectedAddrId(addr.id);
    setFormData(prev => ({
      ...prev,
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipcode: addr.zipcode || '',
      country: addr.country || 'India',
      phone: addr.phone || ''
    }));
    toast.info("Selected saved address applied!");
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            let itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method.toUpperCase(),
        saveNewAddress: !hasSavedAddresses // If user had no saved addresses, backend will save this new one
      };

      if (method === 'cod') {
        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
        if (response.data.success) {
          setCartItems({});
          if (!hasSavedAddresses) fetchUserProfile(token); // Refresh user profile to include new address
          setShowSuccessModal(true);
        } else {
          toast.error(response.data.message);
        }
      } else if (method === 'stripe') {
        const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
        if (responseStripe.data.success) {
          window.location.replace(responseStripe.data.session_url);
        } else {
          toast.error(responseStripe.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const subtotal = getCartAmount();
  const totalAmount = subtotal > 0 ? subtotal + delivery_fee : 0;

  return (
    <form onSubmit={onSubmitHandler} className='max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 text-white'>
      <div className='flex flex-col lg:flex-row justify-between gap-10 items-start'>
        
        {/* LEFT: If saved addresses exist, show selector cards. Otherwise show clean input form that auto-saves */}
        <div className='w-full lg:w-7/12 space-y-6'>
          
          {hasSavedAddresses ? (
            <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl'>
              <div className="flex items-center justify-between">
                <h3 className='text-xs font-extrabold uppercase tracking-wider text-[#ffc200]'>
                  📌 CHOOSE YOUR DELIVERY ADDRESS
                </h3>
                <span className="text-[11px] text-gray-400">Click a card to select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userData.addresses.map((addr, idx) => {
                  const isSelected = selectedAddrId === addr.id;
                  return (
                    <div
                      key={addr.id || idx}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-1 relative ${
                        isSelected 
                          ? 'bg-neutral-900 border-[#ffc200] shadow-[0_0_15px_rgba(255,194,0,0.15)]' 
                          : 'bg-black border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-[#ffc200] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          {addr.type || 'HOME'}
                        </span>
                        {isSelected && <span className="text-[#ffc200] text-xs font-bold">✓ Selected</span>}
                      </div>
                      <p className="text-xs font-bold text-white pt-1">{addr.street}</p>
                      <p className="text-[11px] text-gray-400">{addr.city}, {addr.state} - {addr.zipcode}</p>
                      <p className="text-[11px] text-gray-500">Phone: {addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl'>
              <div className="flex items-center justify-between">
                <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                <span className="bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  ⚡ Will be saved to profile
                </span>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First name' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
                <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last name' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
              </div>

              <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email address' className='w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
              <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street address' className='w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />

              <div className='grid grid-cols-2 gap-4'>
                <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
                <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
                <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
              </div>

              <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone number' className='w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ffc200]' />
            </div>
          )}

        </div>

        {/* RIGHT: Cart Totals & Payment Method */}
        <div className='w-full lg:w-5/12 bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl'>
          <Title text1={'CART'} text2={'TOTALS'} />

          <div className='space-y-3 text-sm text-gray-300 border-b border-neutral-800 pb-4'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span className='font-bold text-white'>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping Fee</span>
              <span className='font-bold text-white'>{currency}{delivery_fee}.00</span>
            </div>
            <div className='flex justify-between text-base font-extrabold text-white pt-2'>
              <span>Total Amount</span>
              <span className='text-[#ffc200] text-lg'>{currency}{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <p className='text-xs font-extrabold uppercase tracking-wider text-[#ffc200]'>PAYMENT METHOD</p>
            <div className='flex gap-3 flex-wrap'>
              <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border px-4 py-3 rounded-2xl cursor-pointer transition ${method === 'cod' ? 'border-[#ffc200] bg-neutral-900' : 'border-neutral-800'}`}>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${method === 'cod' ? 'border-[#ffc200] bg-[#ffc200]' : 'border-neutral-500'}`}></span>
                <span className='text-xs font-bold uppercase'>CASH ON DELIVERY</span>
              </div>
              <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border px-4 py-3 rounded-2xl cursor-pointer transition ${method === 'stripe' ? 'border-[#ffc200] bg-neutral-900' : 'border-neutral-800'}`}>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${method === 'stripe' ? 'border-[#ffc200] bg-[#ffc200]' : 'border-neutral-500'}`}></span>
                <span className='text-xs font-bold uppercase'>STRIPE / ONLINE</span>
              </div>
            </div>
          </div>

          <button
            type='submit'
            className='w-full py-4 rounded-2xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_4px_20px_rgba(255,194,0,0.25)] mt-4'
          >
            PLACE ORDER
          </button>
        </div>

      </div>

      <OrderSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </form>
  );
};

export default PlaceOrder;
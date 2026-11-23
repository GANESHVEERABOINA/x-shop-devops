import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderSuccessModal from '../components/OrderSuccessModal';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    currency,
    userData,
    fetchUserProfile,
  } = useContext(ShopContext);

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
    phone: '',
  });

  const isLoggedIn = Boolean(token || localStorage.getItem('token'));

  // Redirect to login immediately if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.info('Please sign in to complete your order');
      navigate('/login', { state: { from: '/place-order' }, replace: true });
    }
  }, [isLoggedIn, navigate]);

  const hasSavedAddresses = userData?.addresses && userData.addresses.length > 0;

  useEffect(() => {
    if (userData) {
      if (userData.email) setFormData((prev) => ({ ...prev, email: userData.email }));
      if (userData.name) {
        const parts = userData.name.split(' ');
        setFormData((prev) => ({
          ...prev,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
        }));
      }
      if (hasSavedAddresses) {
        const first = userData.addresses[0];
        setSelectedAddrId(first.id);
        setFormData((prev) => ({
          ...prev,
          street: first.street || '',
          city: first.city || '',
          state: first.state || '',
          zipcode: first.zipcode || '',
          country: first.country || 'India',
          phone: first.phone || '',
        }));
      }
    }
  }, [userData]);

  // Do not render checkout form if not logged in
  if (!isLoggedIn) return null;

  const handleSelectAddress = (addr) => {
    setSelectedAddrId(addr.id);
    setFormData((prev) => ({
      ...prev,
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipcode: addr.zipcode || '',
      country: addr.country || 'India',
      phone: addr.phone || '',
    }));
    toast.info('Delivery address selected');
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      toast.info('Please sign in to place your order');
      navigate('/login', { state: { from: '/place-order' } });
      return;
    }

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            let itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error('Your cart is empty. Add items before placing an order.');
        navigate('/collection');
        return;
      }

      setIsSubmitting(true);

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method.toUpperCase(),
        saveNewAddress: !hasSavedAddresses,
      };

      if (method === 'cod') {
        const response = await axios.post(backendUrl + '/api/order/place', orderData, {
          headers: { token: activeToken },
        });
        if (response.data.success) {
          setCartItems({});
          if (!hasSavedAddresses) fetchUserProfile(activeToken);
          setShowSuccessModal(true);
        } else {
          toast.error(response.data.message);
        }
      } else if (method === 'stripe') {
        const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {
          headers: { token: activeToken },
        });
        if (responseStripe.data.success) {
          window.location.replace(responseStripe.data.session_url);
        } else {
          toast.error(responseStripe.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartAmount();
  const shipping = subtotal > 0 ? delivery_fee : 0;
  const totalAmount = subtotal + shipping;

  return (
    <form onSubmit={onSubmitHandler} className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-24 text-zinc-100">
      <div className="mb-8 border-b border-white/[0.08] pb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          Checkout
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Complete Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Address Selection / Form */}
        <div className="lg:col-span-7 space-y-6">
          {hasSavedAddresses ? (
            <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Delivery Address</h3>
                <span className="text-xs text-zinc-500">Select an address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userData.addresses.map((addr, idx) => {
                  const isSelected = selectedAddrId === addr.id;
                  return (
                    <div
                      key={addr.id || idx}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                        isSelected
                          ? 'bg-violet-500/15 border-violet-400/50 shadow-[0_0_24px_-10px_rgba(139,92,246,0.5)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="glass-pill text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase text-zinc-200">
                          {addr.type || 'Home'}
                        </span>
                        {isSelected && (
                          <span className="text-violet-300 text-xs font-semibold">Selected</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white pt-1">{addr.street}</p>
                      <p className="text-[11px] text-zinc-400">
                        {addr.city}, {addr.state} - {addr.zipcode}
                      </p>
                      <p className="text-[11px] text-zinc-500">{addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Delivery Information</h3>
                <span className="glass-pill text-[11px] font-medium text-violet-300 px-3 py-1 rounded-full">
                  Auto-saved to profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} type="text" placeholder="First name" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
                <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" placeholder="Last name" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
              </div>

              <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" placeholder="Email address" className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
              <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" placeholder="Street address" className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" placeholder="City" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
                <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" placeholder="State" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} type="number" placeholder="Zipcode" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
                <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" placeholder="Country" className="glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
              </div>

              <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" placeholder="Phone number" className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder:text-zinc-500" />
            </div>
          )}
        </div>

        {/* RIGHT: Summary & Payment */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24">
          <h3 className="text-base font-semibold text-white">Order Summary</h3>

          <div className="space-y-3 text-sm text-zinc-400 border-b border-white/[0.08] pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-200 tabular-nums">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-zinc-200 tabular-nums">{currency}{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.06]">
              <span>Total</span>
              <span className="text-lg tabular-nums">{currency}{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Payment Method
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('cod')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  method === 'cod'
                    ? 'bg-violet-500/15 border-violet-400/50 text-white'
                    : 'glass-pill text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border ${method === 'cod' ? 'bg-violet-400 border-violet-300' : 'border-zinc-500'}`} />
                <span>Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('stripe')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  method === 'stripe'
                    ? 'bg-violet-500/15 border-violet-400/50 text-white'
                    : 'glass-pill text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border ${method === 'stripe' ? 'bg-violet-400 border-violet-300' : 'border-zinc-500'}`} />
                <span>Stripe / Card</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || subtotal === 0}
            className="w-full py-3.5 rounded-xl btn-primary font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • ${currency}${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>

      <OrderSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </form>
  );
};

export default PlaceOrder;
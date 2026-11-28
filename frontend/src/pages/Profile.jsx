import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token, backendUrl, userData, fetchUserProfile, navigate, setToken, setCartItems } =
    useContext(ShopContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India',
    phone: '',
  });

  if (!token) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="glass-card rounded-3xl p-8 space-y-4">
          <h1 className="text-xl font-bold text-white">Sign in to view your profile</h1>
          <p className="text-xs text-zinc-400">
            Access your saved delivery addresses, wishlist, and order history.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/user/add-address',
        { address },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Address saved to your account');
        setAddress({
          type: 'Home',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: 'India',
          phone: '',
        });
        setShowAddForm(false);
        fetchUserProfile?.(token);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    navigate('/login');
  };

  const addresses = userData?.addresses || [];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 pb-24 text-zinc-100 space-y-6">
      <div className="border-b border-white/[0.08] pb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          Account
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-3xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl btn-violet flex items-center justify-center text-xl font-extrabold uppercase shrink-0">
              {userData?.name ? userData.name[0] : 'U'}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-xs text-zinc-400">Hello,</p>
              <h2 className="text-lg font-bold text-white truncate">
                {userData?.name || 'X-Shop Member'}
              </h2>
              {userData?.email && (
                <p className="text-[11px] text-zinc-500 truncate">{userData.email}</p>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-[10px] font-semibold text-violet-300 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Verified Customer
              </span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-3 space-y-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-zinc-200 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <span>My Orders</span>
              <span className="text-violet-400">→</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-zinc-200 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <span>Saved Wishlist</span>
              <span className="text-violet-400">→</span>
            </button>

            <div className="my-1 border-t border-white/[0.08]" />

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <span>Sign out</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right: Saved Addresses Panel */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Account Addresses</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Saved delivery addresses synced with MongoDB Atlas
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="btn-violet px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer self-start sm:self-auto"
            >
              {showAddForm ? 'Cancel' : '+ Add New Address'}
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleSaveAddress}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                {['Home', 'Work', 'Other'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setAddress((prev) => ({ ...prev, type: t }))}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                      address.type === t ? 'btn-primary' : 'glass-pill text-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                placeholder="Street address / House no."
                value={address.street}
                onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                  className="glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-500"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                  className="glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  placeholder="PIN / Zipcode"
                  value={address.zipcode}
                  onChange={(e) => setAddress((p) => ({ ...p, zipcode: e.target.value }))}
                  className="glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-500"
                />
                <input
                  type="number"
                  required
                  placeholder="Phone number"
                  value={address.phone}
                  onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))}
                  className="glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          )}

          {addresses.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-medium text-zinc-400">No addresses saved yet.</p>
              <p className="text-xs text-zinc-500">
                Add one above or place your first order to save it automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div
                  key={addr.id || idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-1.5"
                >
                  <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase text-violet-300">
                    {addr.type || 'Home'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white pt-1">{addr.street}</p>
                  <p className="text-xs text-zinc-400">
                    {addr.city}, {addr.state} - {addr.zipcode}
                  </p>
                  <p className="text-[11px] text-zinc-500">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
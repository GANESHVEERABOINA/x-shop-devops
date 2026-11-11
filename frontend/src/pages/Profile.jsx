import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zipcode: '', country: 'India', type: 'HOME'
  });

  // Fetch Real User Data from DB
  const fetchUserProfile = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
      
      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error("Backend Error: " + response.data.message);
        console.log("Backend Response Error:", response.data);
        setUserData({ name: "Error", addresses: [] }); // Stop infinite loading
      }
    } catch (error) {
      console.log("API Call Failed:", error);
      toast.error("Network/API Error: " + error.message);
      setUserData({ name: "Error", addresses: [] }); // Stop infinite loading
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  // Save Real Address to DB
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const addressData = { ...form, id: 'addr_' + Date.now() };
      const response = await axios.post(backendUrl + '/api/user/add-address', { address: addressData }, { headers: { token } });
      if (response.data.success) {
        toast.success('Address saved to your account!');
        setShowForm(false);
        setForm({firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', zipcode: '', country: 'India', type: 'HOME'});
        fetchUserProfile(); // Refresh data from DB
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!userData) {
    return <div className="text-center py-20 text-white">Loading Real Account Data...</div>;
  }

  const addresses = userData.addresses || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-[#111] border border-neutral-800 rounded-xl p-4 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white uppercase">
              {userData.name ? userData.name[0] : 'U'}
            </div>
            <div>
              <p className="text-xs text-gray-400">Hello,</p>
              <h2 className="text-base font-bold text-white capitalize">{userData.name}</h2>
              <span className="inline-block mt-1 bg-[#ffc200] text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                ✦ Verified Customer
              </span>
            </div>
          </div>
          <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
            <button onClick={() => navigate('/orders')} className="w-full p-4 text-left hover:bg-neutral-900 flex items-center justify-between font-semibold text-blue-500">
              <span>📦 MY ORDERS</span><span>→</span>
            </button>
            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Account Settings</p>
              <p className="text-white font-medium">📍 Manage Saved Addresses</p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="md:col-span-8 bg-[#111] border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h1 className="text-lg font-bold text-white">Account Addresses</h1>
              <p className="text-xs text-gray-400">Your addresses are securely saved in our database</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer">
              + ADD NEW ADDRESS
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSaveAddress} className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input required placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <input required placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <input required placeholder="Mobile Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <input required placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <input required placeholder="Complete Address (Street, Area)" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="sm:col-span-2 bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
                <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
                <input required placeholder="Pincode" value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" className="bg-[#ffc200] text-black font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-[#ffcf33] cursor-pointer">SECURE SAVE</button>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 px-4 py-2.5 cursor-pointer">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No addresses saved yet.</p>
            ) : (
              addresses.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#111] border border-neutral-800 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-neutral-800 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded">{addr.type || 'HOME'}</span>
                      <span className="font-bold text-white">{addr.firstName} {addr.lastName}</span>
                      <span className="font-semibold text-gray-300">{addr.phone}</span>
                    </div>
                    <p className="text-gray-400">{addr.street}, {addr.city}, {addr.state} - <strong className="text-white">{addr.zipcode}</strong></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
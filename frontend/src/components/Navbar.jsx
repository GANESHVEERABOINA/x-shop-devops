import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, userData } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const defaultAddress = userData?.addresses?.[0] || null;
  const rawName = userData?.name || userData?.username || 'Ganesh';
  const displayName = rawName.toUpperCase();
  const userInitial = rawName.charAt(0).toUpperCase();

  return (
    <div className='w-full bg-black border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-xl bg-opacity-95 mb-6'>
      
      {/* Top Address & Plus Bar (Full Width Stretch) */}
      {token && userData && (
        <div className='w-full flex items-center justify-between py-2 px-4 sm:px-8 lg:px-12 bg-[#0f0f0f] border-b border-neutral-900 text-xs text-gray-300'>
          <div
            onClick={() => navigate('/profile')}
            className='flex items-center gap-2 cursor-pointer hover:text-white truncate'
          >
            <span className='text-[#ffc200] font-extrabold flex items-center gap-1'>
              🏠 {defaultAddress?.type || 'HOME'}
            </span>
            {defaultAddress ? (
              <span className='truncate max-w-[240px] sm:max-w-md text-gray-300'>
                {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zipcode} &gt;
              </span>
            ) : (
              <span className='text-gray-400 underline'>
                + Add your delivery address for fast checkout &gt;
              </span>
            )}
          </div>

          <div className='hidden sm:flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-[11px] font-bold text-[#ffc200] shadow-sm'>
            <span>⚡ X-Shop Plus Member</span>
          </div>
        </div>
      )}

      {/* Main Header / Navbar (Full Width Stretch) */}
      <div className='w-full flex items-center justify-between py-4 px-4 sm:px-8 lg:px-12 font-medium text-white'>
        
        {/* Brand Logo */}
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='bg-[#ffc200] text-black font-extrabold px-2.5 py-1 rounded-lg text-lg tracking-wider shadow group-hover:scale-105 transition'>
            X
          </div>
          <span className='text-lg sm:text-xl font-extrabold tracking-widest text-white'>
            SHOP
          </span>
        </Link>

        {/* Modern Nav Links with Active Yellow Indicator */}
        <ul className='hidden sm:flex gap-8 text-xs sm:text-sm font-bold tracking-wider text-gray-300'>
          <NavLink to='/' className='flex flex-col items-center gap-1 hover:text-[#ffc200] transition'>
            {({ isActive }) => (
              <>
                <p className={isActive ? 'text-[#ffc200]' : ''}>HOME</p>
                <hr className={`w-full border-none h-[2px] bg-[#ffc200] transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
              </>
            )}
          </NavLink>
          <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:text-[#ffc200] transition'>
            {({ isActive }) => (
              <>
                <p className={isActive ? 'text-[#ffc200]' : ''}>COLLECTION</p>
                <hr className={`w-full border-none h-[2px] bg-[#ffc200] transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
              </>
            )}
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1 hover:text-[#ffc200] transition'>
            {({ isActive }) => (
              <>
                <p className={isActive ? 'text-[#ffc200]' : ''}>ABOUT</p>
                <hr className={`w-full border-none h-[2px] bg-[#ffc200] transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
              </>
            )}
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1 hover:text-[#ffc200] transition'>
            {({ isActive }) => (
              <>
                <p className={isActive ? 'text-[#ffc200]' : ''}>CONTACT</p>
                <hr className={`w-full border-none h-[2px] bg-[#ffc200] transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
              </>
            )}
          </NavLink>
        </ul>

        {/* Right Icons: Search, Profile, Cart, Mobile Menu */}
        <div className='flex items-center gap-4 sm:gap-6'>
          <img
            onClick={() => { setShowSearch(true); navigate('/collection') }}
            src={assets.search_icon}
            className='w-5 h-5 cursor-pointer invert hover:scale-110 transition'
            alt="Search"
            title="Search Products"
          />

          {/* Profile Dropdown / Login Button */}
          {token ? (
            <div className='group relative'>
              <div className='flex items-center gap-2 cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#ffc200] px-3.5 py-1.5 rounded-xl transition shadow'>
                <div className='w-7 h-7 rounded-full bg-[#ffc200] text-black font-extrabold flex items-center justify-center text-xs shadow shrink-0'>
                  {userInitial}
                </div>
                <span className='text-xs font-bold text-white uppercase tracking-wide hidden sm:inline'>
                  {displayName.split(' ')[0]}
                </span>
                <span className='text-[10px] text-gray-400'>▼</span>
              </div>

              {/* Dropdown Menu */}
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-3 z-50'>
                <div className='flex flex-col gap-2 w-48 py-3 px-4 bg-[#141414] border border-neutral-700 text-gray-300 rounded-2xl shadow-2xl text-xs font-semibold'>
                  <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-[#ffc200] py-1.5 border-b border-neutral-800'>
                    👤 My Profile
                  </p>
                  <p onClick={() => navigate('/wishlist')} className='cursor-pointer hover:text-[#ffc200] py-1.5 border-b border-neutral-800'>
                    ❤️ My Wishlist
                  </p>
                  <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-[#ffc200] py-1.5 border-b border-neutral-800'>
                    📦 My Orders
                  </p>
                  <p onClick={logout} className='cursor-pointer hover:text-red-400 py-1.5'>
                    🚪 Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs px-5 py-2 rounded-xl transition shadow cursor-pointer uppercase tracking-wider'
            >
              Login
            </button>
          )}

          {/* Cart Button */}
          <Link
            to='/cart'
            className='relative flex items-center gap-2 px-3.5 py-2 bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold rounded-xl transition shadow-lg cursor-pointer'
            title="View Shopping Cart"
          >
            <img src={assets.cart_icon} className='w-5 h-5 filter brightness-0' alt="Cart" />
            <span className='text-xs hidden sm:inline'>Cart</span>
            <span className='absolute -right-2 -top-2 w-5 h-5 flex items-center justify-center bg-black text-[#ffc200] font-extrabold rounded-full text-[10px] shadow border border-[#ffc200]'>
              {getCartCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className='w-5 h-5 cursor-pointer sm:hidden invert'
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-black z-50 transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-300 p-6 space-y-4'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 cursor-pointer pb-4 border-b border-neutral-800'>
            <img className='h-4 rotate-180 invert' src={assets.dropdown_icon} alt="" />
            <p className='text-white font-bold'>Close Menu</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/orders'>MY ORDERS</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/profile'>MY PROFILE</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 text-lg font-bold border-b border-neutral-900' to='/contact'>CONTACT</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
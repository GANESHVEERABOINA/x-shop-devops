import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    userData,
    wishlist,
  } = useContext(ShopContext);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const logout = () => {
    setProfileOpen(false);
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/[0.08] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
    }`;

  const cartCount = getCartCount();
  const wishCount = wishlist ? wishlist.length : 0;

  return (
    <>
      <header className="glass-topbar sticky top-0 z-50 w-full">
        <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-2.5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg btn-violet flex items-center justify-center font-extrabold text-sm tracking-tight">
              X
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              X-Shop
            </span>
          </Link>

          {/* Desktop & Tablet Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/collection" className={navLinkClass}>Collection</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowSearch((prev) => !prev);
                navigate('/collection');
              }}
              aria-label="Search products"
              className="glass-pill w-9 h-9 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative glass-pill w-9 h-9 rounded-xl hidden sm:flex items-center justify-center text-zinc-300 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>

            {token ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`h-9 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs font-semibold transition cursor-pointer ${
                    profileOpen
                      ? 'bg-white/15 border border-violet-400/50 text-white'
                      : 'glass-pill text-zinc-200 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-400/50 text-violet-200 text-[10px] font-bold flex items-center justify-center uppercase">
                    {userData?.name ? userData.name[0] : 'U'}
                  </span>
                  <span className="hidden sm:inline max-w-[90px] truncate">
                    {userData?.name ? userData.name.split(' ')[0] : 'Account'}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 z-[100] rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-2">
                    <div className="px-3 py-2.5 border-b border-white/10 mb-1.5">
                      <p className="text-xs font-bold text-white truncate">
                        {userData?.name || 'X-Shop User'}
                      </p>
                      {userData?.email && (
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {userData.email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
                      >
                        <span>My Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/orders');
                        }}
                        className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
                      >
                        <span>Orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/wishlist');
                        }}
                        className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
                      >
                        <span>Wishlist</span>
                      </button>

                      <div className="my-1 border-t border-white/10" />

                      <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition cursor-pointer font-semibold"
                      >
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-primary h-9 px-3.5 sm:px-4 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Sign in
              </button>
            )}

            {/* Desktop/Tablet Cart (No "0" when empty) */}
            <Link
              to="/cart"
              className="relative glass-pill h-9 px-3.5 rounded-xl hidden md:flex items-center gap-2 text-xs font-semibold text-zinc-200 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (< 768px) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#050508]/92 backdrop-blur-2xl border-t border-white/10">
        <div className="grid grid-cols-4 h-14 items-center text-[11px] font-semibold">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/' ? 'text-violet-400' : 'text-zinc-400'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
            </svg>
            <span>Home</span>
          </Link>

          <Link
            to="/collection"
            className={`flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/collection' ? 'text-violet-400' : 'text-zinc-400'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Collection</span>
          </Link>

          <Link
            to="/wishlist"
            className={`relative flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/wishlist' ? 'text-violet-400' : 'text-zinc-400'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Wishlist</span>
          </Link>

          <Link
            to="/cart"
            className={`relative flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/cart' ? 'text-violet-400' : 'text-zinc-400'
            }`}
          >
            <div className="relative">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Sidebar = ({
  setToken,
  adminProfile,
  navCounts = { orders: 0, products: 0 },
  darkMode,
  setDarkMode,
  mobileOpen,
  onCloseMobile,
}) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] transition-all duration-200 ${
      isActive
        ? 'btn-violet text-white font-semibold'
        : 'sidebar-nav-idle text-zinc-300 font-medium hover:bg-white/[0.06] hover:text-white border border-transparent'
    }`;

  const shopItems = [
    {
      to: '/',
      end: true,
      label: 'Dashboard',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z' />
        </svg>
      ),
    },
    {
      to: '/orders',
      label: 'Orders',
      badge: navCounts.orders,
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
        </svg>
      ),
    },
    {
      to: '/list',
      label: 'Products',
      badge: navCounts.products,
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
        </svg>
      ),
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
        </svg>
      ),
    },
  ];

  const moneyItems = [
    {
      to: '/finances',
      label: 'Finances',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
        </svg>
      ),
    },
    {
      to: '/discounts',
      label: 'Discounts',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
        </svg>
      ),
    },
  ];

  const teamItems = [
    {
      to: '/add',
      label: 'Add Product',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
        </svg>
      ),
    },
    {
      to: '/team',
      label: 'Team & Roles',
      icon: (
        <svg className='w-4 h-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      ),
    },
  ];

  const filterList = (items) =>
    !query.trim()
      ? items
      : items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  const renderGroup = (title, items) => {
    const visible = filterList(items);
    if (visible.length === 0) return null;
    return (
      <div className='space-y-1'>
        <p className='text-[10px] font-bold tracking-[0.16em] text-zinc-500 uppercase px-3 pb-1'>
          {title}
        </p>
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                <div className='flex items-center gap-3'>
                  <span className={isActive ? 'keep-white text-white' : 'text-zinc-400 group-hover:text-violet-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums ${
                      isActive
                        ? 'keep-white bg-white/20 text-white'
                        : 'bg-violet-500/15 text-violet-500 border border-violet-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    );
  };

  const sidebarContent = (
    <div className='cirrel-sidebar rounded-[28px] w-[264px] h-full lg:min-h-[calc(100vh-2.5rem)] lg:sticky lg:top-5 p-4 flex flex-col justify-between select-none'>
      <div className='space-y-4'>
        {/* Luxury Brand Signature Header */}
        <div className='flex items-center justify-between px-1 pt-0.5'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-2xl btn-violet flex items-center justify-center shrink-0'>
              <svg className='w-5 h-5 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 5l14 14M19 5L5 19' />
              </svg>
            </div>
            <div className='leading-none'>
              <p className='text-lg font-extrabold tracking-[0.16em] text-white uppercase'>
                X<span className='text-violet-500'>·</span>SHOP
              </p>
              <p className='text-[9px] font-bold tracking-[0.26em] text-zinc-400 uppercase mt-1'>
                ADMIN STUDIO
              </p>
            </div>
          </div>

          {mobileOpen && (
            <button
              type='button'
              onClick={onCloseMobile}
              className='lg:hidden glass-pill w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 cursor-pointer'
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Search Bar */}
        <div className='flex items-center gap-2 glass-input rounded-2xl px-3 py-2'>
          <svg className='w-3.5 h-3.5 text-zinc-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z' />
          </svg>
          <input
            ref={searchRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            className='w-full bg-transparent outline-none text-xs placeholder:text-zinc-500'
          />
          <span className='text-[10px] font-mono text-zinc-500 bg-white/[0.06] border border-white/10 px-1.5 py-0.5 rounded-md shrink-0'>
            ⌘K
          </span>
        </div>

        {/* Navigation Groups */}
        <div className='space-y-4'>
          {renderGroup('Shop', shopItems)}
          {renderGroup('Money', moneyItems)}
          {renderGroup('Manage', teamItems)}
        </div>
      </div>

      {/* Bottom Dark Mode Toggle + Admin Profile Card */}
      <div className='space-y-3 pt-5 border-t border-white/[0.08] mt-4'>
        <div className='flex items-center justify-between px-2 py-1'>
          <div className='flex items-center gap-2.5 text-xs font-semibold text-zinc-300'>
            {darkMode ? (
              <svg className='w-4 h-4 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
              </svg>
            ) : (
              <svg className='w-4 h-4 text-amber-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
              </svg>
            )}
            <span>Dark mode</span>
          </div>

          <button
            type='button'
            role='switch'
            aria-checked={darkMode}
            onClick={() => setDarkMode((prev) => !prev)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/[0.045] border border-white/[0.1]'>
          <button
            type='button'
            onClick={() => {
              navigate('/team');
              onCloseMobile?.();
            }}
            className='flex items-center gap-2.5 min-w-0 text-left cursor-pointer'
          >
            <div className='w-9 h-9 rounded-full btn-violet font-extrabold text-xs flex items-center justify-center uppercase shrink-0'>
              {adminProfile?.name
                ? adminProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                : 'AD'}
            </div>
            <div className='min-w-0 leading-tight'>
              <p className='text-xs font-semibold text-white truncate'>
                {adminProfile?.name || 'Primary Admin'}
              </p>
              <p className='text-[10px] text-zinc-400 truncate mt-0.5'>
                {adminProfile?.email || adminProfile?.role || 'Authorized'}
              </p>
            </div>
          </button>

          <button
            type='button'
            onClick={() => setToken('')}
            title='Sign out'
            className='w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/35 text-zinc-400 hover:text-rose-400 flex items-center justify-center shrink-0 transition cursor-pointer'
          >
            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className='hidden lg:block shrink-0'>{sidebarContent}</aside>

      {mobileOpen && (
        <div className='fixed inset-0 z-50 lg:hidden flex'>
          <div onClick={onCloseMobile} className='fixed inset-0 bg-black/80 backdrop-blur-md' />
          <div className='relative z-10 p-3 h-full'>{sidebarContent}</div>
        </div>
      )}
    </>
  )
}

export default Sidebar
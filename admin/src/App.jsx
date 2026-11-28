import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Analytics from './pages/Analytics'
import Finances from './pages/Finances'
import Discounts from './pages/Discounts'
import Team from './pages/Team'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL !== undefined
    ? import.meta.env.VITE_BACKEND_URL
    : (window.location.hostname === 'localhost' && window.location.port === '5174'
        ? 'http://localhost:4000'
        : '');

export const currency = '₹'

const ROUTE_TITLES = {
  '/': 'Dashboard',
  '/orders': 'Orders • All orders',
  '/list': 'Products • Catalog',
  '/add': 'Products • Add new',
  '/analytics': 'Analytics • Sales',
  '/finances': 'Finances • Profit & loss',
  '/discounts': 'Discounts • Codes',
  '/team': 'Team & Roles',
};

// Crisp "Ting!" Bell Chime using Web Audio API (Works 100% locally without MP3 files)
const playOrderTingSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Primary bell tone (1046.5 Hz — C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.32, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0008, now + 0.95);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.0);

    // Harmonic sparkle overtone (1568 Hz — G6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1568, now + 0.08);
    gain2.gain.setValueAtTime(0.001, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.22, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 1.2);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1400);
  } catch (err) {
    console.log('Audio alert blocked until user clicks page:', err);
  }
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : '');
  const [adminProfile, setAdminProfile] = useState(null);
  const [navCounts, setNavCounts] = useState({ orders: 0, products: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Order Notification State
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('xshop_sound') !== 'off');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const knownOrderIdsRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);
  const notifRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('xshop_admin_theme');
    return saved !== 'light';
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    localStorage.setItem('xshop_sound', soundEnabled ? 'on' : 'off');
  }, [soundEnabled]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light-mode');
      localStorage.setItem('xshop_admin_theme', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('xshop_admin_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const onOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const refreshAdminMeta = async (activeToken, detectNewOrders = false) => {
    if (!activeToken) return;
    try {
      const [profileRes, orderRes, prodRes] = await Promise.allSettled([
        axios.get(backendUrl + '/api/admin/me', { headers: { token: activeToken } }),
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token: activeToken } }),
        axios.get(backendUrl + '/api/product/list'),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data?.success) {
        setAdminProfile(profileRes.value.data.admin);
      }

      const validOrders =
        orderRes.status === 'fulfilled' && orderRes.value.data?.success
          ? orderRes.value.data.orders.filter((o) => Array.isArray(o.items) && o.items.length > 0)
          : [];

      const activePendingOrders = validOrders.filter(
        (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
      ).length;

      const productCount =
        prodRes.status === 'fulfilled' && prodRes.value.data?.success
          ? prodRes.value.data.products.length
          : 0;

      setNavCounts({ orders: activePendingOrders, products: productCount });

      // Detect Brand New Customer Orders & Play "Ting!" Sound
      const sortedOrders = [...validOrders].sort((a, b) => Number(b.date) - Number(a.date));
      const latestIds = new Set(sortedOrders.map((o) => o._id));

      if (knownOrderIdsRef.current === null) {
        knownOrderIdsRef.current = latestIds;
        setNotifications(
          sortedOrders.slice(0, 6).map((o) => ({
            id: o._id,
            customer: `${o.address?.firstName || 'Customer'} ${o.address?.lastName || ''}`.trim(),
            amount: o.amount,
            itemsCount: o.items.length,
            status: o.status,
            date: o.date,
            isNew: false,
          }))
        );
      } else if (detectNewOrders) {
        const brandNew = sortedOrders.filter((o) => !knownOrderIdsRef.current.has(o._id));
        if (brandNew.length > 0) {
          knownOrderIdsRef.current = latestIds;
          if (soundEnabledRef.current) {
            playOrderTingSound();
          }
          setUnreadCount((prev) => prev + brandNew.length);
          const freshItems = brandNew.map((o) => ({
            id: o._id,
            customer: `${o.address?.firstName || 'Customer'} ${o.address?.lastName || ''}`.trim(),
            amount: o.amount,
            itemsCount: o.items.length,
            status: o.status,
            date: o.date,
            isNew: true,
          }));
          setNotifications((prev) => [...freshItems, ...prev].slice(0, 8));

          const top = brandNew[0];
          toast.info(
            `New Order! ${top.address?.firstName || 'Customer'} placed ${currency}${top.amount} (${top.items.length} item${top.items.length > 1 ? 's' : ''})`,
            { autoClose: 5000 }
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    localStorage.setItem('adminToken', token);
    if (!token) {
      setAdminProfile(null);
      knownOrderIdsRef.current = null;
      return;
    }
    refreshAdminMeta(token, false);

    // Poll every 8 seconds for instant new order "Ting!" notifications
    const poll = setInterval(() => {
      refreshAdminMeta(token, true);
    }, 8000);
    return () => clearInterval(poll);
  }, [token]);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const currentBreadcrumb = ROUTE_TITLES[location.pathname] || 'Console';

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${
        darkMode ? 'bg-[#000000] text-zinc-100' : 'bg-[#eef2ff] text-slate-900'
      }`}
    >
      {/* Ambient Glowing Orbs */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden z-0'>
        <div
          className='absolute -top-24 -left-16 w-[440px] h-[440px] rounded-full'
          style={{
            opacity: darkMode ? 0.3 : 0.35,
            background: 'radial-gradient(circle, rgba(124,58,237,0.72) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(95px)',
          }}
        />
        <div
          className='absolute -top-14 right-10 w-[330px] h-[330px] rounded-full'
          style={{
            opacity: darkMode ? 0.28 : 0.45,
            background:
              'radial-gradient(circle, rgba(167,139,250,0.68) 0%, rgba(99,102,241,0.3) 48%, rgba(0,0,0,0) 72%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className='absolute -bottom-32 right-1/4 w-[500px] h-[360px] rounded-full'
          style={{
            opacity: darkMode ? 0.26 : 0.35,
            background: 'radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(99,102,241,0.42) 45%, rgba(0,0,0,0) 72%)',
            filter: 'blur(110px)',
          }}
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <div className='relative z-10 min-h-screen w-full'>
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <div className='flex flex-col lg:flex-row min-h-screen w-full p-2.5 sm:p-4 lg:p-5 gap-4 lg:gap-5 max-w-[1640px] mx-auto'>
            {/* Mobile Compact Top Header (< lg) */}
            <header className='lg:hidden cirrel-panel rounded-2xl px-4 h-14 flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <button
                  type='button'
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label='Open navigation'
                  className='glass-pill w-9 h-9 rounded-xl flex items-center justify-center text-zinc-300 cursor-pointer'
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                  </svg>
                </button>
                <span className='text-base font-extrabold tracking-[0.16em] text-white uppercase'>
                  X<span className='text-violet-500'>·</span>SHOP
                </span>
              </div>

              <button
                type='button'
                onClick={() => navigate('/add')}
                className='btn-violet px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer'
              >
                + Create
              </button>
            </header>

            <Sidebar
              setToken={setToken}
              adminProfile={adminProfile}
              navCounts={navCounts}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              mobileOpen={mobileMenuOpen}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />

            {/* Main Workspace */}
            <main className='flex-1 min-w-0 flex flex-col gap-5 py-1 lg:px-1'>
              {/* Top Greeting & Live Notification Bar */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div>
                  <h1 className='text-lg sm:text-xl font-bold tracking-tight text-white'>
                    {greeting}, {adminProfile?.name ? adminProfile.name.split(' ')[0] : 'Admin'}
                  </h1>
                  <div className='flex items-center gap-2 text-xs text-zinc-400 mt-0.5'>
                    <span className='w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]' />
                    <span>{formattedDate}</span>
                    <span className='text-zinc-500'>•</span>
                    <span>{currentBreadcrumb}</span>
                  </div>
                </div>

                <div className='hidden sm:flex items-center gap-2.5'>
                  <button
                    type='button'
                    onClick={() => navigate('/list')}
                    title='Search catalog'
                    className='glass-pill w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer'
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z' />
                    </svg>
                  </button>

                  {/* Interactive Notification Bell + Ting Sound Controls */}
                  <div ref={notifRef} className='relative'>
                    <button
                      type='button'
                      onClick={() => {
                        setNotifOpen((prev) => !prev);
                        setUnreadCount(0);
                      }}
                      title='Order Notifications'
                      className='relative glass-pill w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer'
                    >
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                      </svg>
                      {(unreadCount > 0 || navCounts.orders > 0) && (
                        <span className={`keep-white absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center tabular-nums ${
                          unreadCount > 0 ? 'bg-emerald-500 animate-bounce' : 'bg-violet-500'
                        }`}>
                          {unreadCount > 0 ? unreadCount : navCounts.orders}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className='absolute right-0 mt-2.5 w-80 z-50 cirrel-panel bg-[#0a0a12]/95 rounded-3xl p-4 space-y-3 shadow-2xl'>
                        <div className='flex items-center justify-between border-b border-white/[0.08] pb-3'>
                          <div>
                            <p className='text-xs font-bold text-white'>Order Notifications</p>
                            <p className='text-[10px] text-zinc-400'>Auto-checks every 8s</p>
                          </div>

                          <div className='flex items-center gap-1.5'>
                            <button
                              type='button'
                              onClick={() => {
                                playOrderTingSound();
                                toast.info('Order chime sound active!');
                              }}
                              className='glass-pill px-2.5 py-1 rounded-full text-[10px] font-semibold text-violet-400 cursor-pointer'
                            >
                              Test Ting
                            </button>
                            <button
                              type='button'
                              onClick={() => setSoundEnabled((prev) => !prev)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                                soundEnabled
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/30'
                                  : 'glass-pill text-zinc-400'
                              }`}
                            >
                              {soundEnabled ? 'Sound On' : 'Muted'}
                            </button>
                          </div>
                        </div>

                        {notifications.length === 0 ? (
                          <p className='text-xs text-zinc-500 py-6 text-center'>No recent orders yet.</p>
                        ) : (
                          <div className='max-h-64 overflow-y-auto divide-y divide-white/[0.07]'>
                            {notifications.map((n) => (
                              <button
                                type='button'
                                key={n.id}
                                onClick={() => {
                                  setNotifOpen(false);
                                  navigate('/orders');
                                }}
                                className='w-full py-2.5 flex items-center justify-between gap-2 text-left hover:bg-white/[0.04] px-2 rounded-xl transition cursor-pointer'
                              >
                                <div className='min-w-0'>
                                  <div className='flex items-center gap-1.5'>
                                    {n.isNew && <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />}
                                    <p className='text-xs font-semibold text-white truncate'>{n.customer}</p>
                                  </div>
                                  <p className='text-[10px] text-zinc-400'>
                                    {n.itemsCount} item{n.itemsCount > 1 ? 's' : ''} • {n.status}
                                  </p>
                                </div>
                                <span className='text-xs font-bold text-violet-400 tabular-nums shrink-0'>
                                  {currency}{n.amount}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          type='button'
                          onClick={() => {
                            setNotifOpen(false);
                            navigate('/orders');
                          }}
                          className='w-full py-2 rounded-xl glass-pill text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer'
                        >
                          Open All Orders →
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type='button'
                    onClick={() => navigate('/add')}
                    className='btn-violet px-4 sm:px-5 h-10 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>+ Create</span>
                  </button>
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                <Routes>
                  <Route
                    path='/'
                    element={
                      <Dashboard
                        token={token}
                        onDataSynced={() => refreshAdminMeta(token, false)}
                      />
                    }
                  />
                  <Route
                    path='/orders'
                    element={
                      <Orders
                        token={token}
                        onDataChanged={() => refreshAdminMeta(token, false)}
                      />
                    }
                  />
                  <Route
                    path='/list'
                    element={
                      <List
                        token={token}
                        onDataChanged={() => refreshAdminMeta(token, false)}
                      />
                    }
                  />
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/analytics' element={<Analytics token={token} />} />
                  <Route path='/finances' element={<Finances token={token} />} />
                  <Route path='/discounts' element={<Discounts token={token} />} />
                  <Route path='/team' element={<Team token={token} adminProfile={adminProfile} />} />
                </Routes>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
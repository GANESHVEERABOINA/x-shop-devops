import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const timeAgo = (ts) => {
  if (!ts) return '—';
  const diffMin = Math.max(1, Math.floor((Date.now() - Number(ts)) / 60000));
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} d ago`;
};

const formatUptime = (seconds) => {
  if (seconds == null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const getFrontendProbeUrl = () => {
  if (import.meta.env.VITE_FRONTEND_URL) return import.meta.env.VITE_FRONTEND_URL;
  if (window.location.hostname === 'localhost' && window.location.port === '5174') {
    return 'http://localhost:5173';
  }
  return window.location.origin;
};

const Dashboard = ({ token, onDataSynced }) => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [range, setRange] = useState('ALL')
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    const saved = Number(localStorage.getItem('xshop_monthly_goal'));
    return saved > 0 ? saved : 25000;
  })
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalDraft, setGoalDraft] = useState(String(monthlyGoal))

  // Real-time Health State for Frontend, Backend, Admin & MongoDB
  const [checkingHealth, setCheckingHealth] = useState(false)
  const [health, setHealth] = useState({
    frontend: { status: 'checking', latency: null, target: getFrontendProbeUrl() },
    backend: { status: 'checking', latency: null, uptime: null, memoryMB: null },
    admin: { status: 'online', latency: 0, session: 'Active JWT' },
    database: { status: 'checking', latency: null, state: 'Checking...' },
    lastChecked: null,
  })

  const navigate = useNavigate()

  const runHealthChecks = async () => {
    setCheckingHealth(true);
    const frontendTarget = getFrontendProbeUrl();

    // 1. Live Frontend Probe (Real fetch with timeout)
    const probeFrontend = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const t0 = performance.now();
      try {
        await fetch(frontendTarget, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return {
          status: 'online',
          latency: Math.max(1, Math.round(performance.now() - t0)),
          target: frontendTarget,
        };
      } catch {
        clearTimeout(timeoutId);
        return { status: 'offline', latency: null, target: frontendTarget };
      }
    };

    // 2. Live Backend + MongoDB + Admin JWT Probe
    const probeBackend = async () => {
      const t0 = performance.now();
      try {
        const res = await axios.get(backendUrl + '/api/admin/health', {
          headers: { token },
          timeout: 4500,
        });
        const latency = Math.max(1, Math.round(performance.now() - t0));
        if (res.data?.success) {
          return {
            backend: {
              status: 'online',
              latency,
              uptime: res.data.backend?.uptimeSeconds ?? null,
              memoryMB: res.data.backend?.memoryMB ?? null,
            },
            database: {
              status: res.data.database?.online ? 'online' : 'offline',
              latency: res.data.database?.pingMs ?? null,
              state: res.data.database?.state || 'Unknown',
            },
            admin: {
              status: navigator.onLine ? 'online' : 'offline',
              latency,
              session: res.data.adminAuth?.role || 'Authorized',
            },
          };
        }
        return {
          backend: { status: 'degraded', latency, uptime: null, memoryMB: null },
          database: { status: 'offline', latency: null, state: 'Auth/Check Error' },
          admin: { status: 'degraded', latency, session: 'Check Session' },
        };
      } catch {
        return {
          backend: { status: 'offline', latency: null, uptime: null, memoryMB: null },
          database: { status: 'offline', latency: null, state: 'Unreachable' },
          admin: {
            status: navigator.onLine ? 'online' : 'offline',
            latency: null,
            session: 'Backend Offline',
          },
        };
      }
    };

    const [feResult, beResult] = await Promise.all([probeFrontend(), probeBackend()]);
    setHealth({
      frontend: feResult,
      backend: beResult.backend,
      database: beResult.database,
      admin: beResult.admin,
      lastChecked: new Date(),
    });
    setCheckingHealth(false);
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const [orderRes, prodRes] = await Promise.all([
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
        axios.get(backendUrl + '/api/product/list'),
      ]);

      if (orderRes.data.success) {
        const valid = orderRes.data.orders.filter(
          (o) => Array.isArray(o.items) && o.items.length > 0
        );
        setOrders(valid);
      } else {
        toast.error(orderRes.data.message);
      }

      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }

      onDataSynced?.();
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 20000);
    return () => clearInterval(interval);
  }, [token]);

  const markOrderPacked = async (orderId) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: 'Packing' },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Order marked as Packing!');
        fetchDashboardData();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const quickRestock = async (productId) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/product/update',
        { id: productId, soldOut: false },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Product restocked (In Stock)!');
        fetchDashboardData();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const now = new Date();
  const currentMonthName = now.toLocaleDateString('en-IN', { month: 'long' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(0, daysInMonth - now.getDate());

  // 100% Real MongoDB Aggregations
  const nonCancelledOrders = useMemo(
    () => orders.filter((o) => o.status !== 'Cancelled'),
    [orders]
  );

  const totalRevenue = useMemo(
    () => nonCancelledOrders.reduce((acc, o) => acc + Number(o.amount || 0), 0),
    [nonCancelledOrders]
  );

  const last7DaysRevenue = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return nonCancelledOrders
      .filter((o) => Number(o.date) >= cutoff)
      .reduce((acc, o) => acc + Number(o.amount || 0), 0);
  }, [nonCancelledOrders]);

  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const pendingCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;
  const deliveredPct = totalOrdersCount
    ? Math.round((deliveredCount / totalOrdersCount) * 100)
    : 0;

  const goalPct = monthlyGoal > 0 ? Math.min(100, Math.round((totalRevenue / monthlyGoal) * 100)) : 0;
  const remainingToGoal = Math.max(0, monthlyGoal - totalRevenue);
  const dailyPaceNeeded = daysLeft > 0 ? Math.ceil(remainingToGoal / daysLeft) : remainingToGoal;

  // 100% Real Order Revenue Series (No synthetic/dummy baseline)
  const chartData = useMemo(() => {
    const bucketCount = 7;
    const labels = [];
    const values = new Array(bucketCount).fill(0);
    const counts = new Array(bucketCount).fill(0);

    if (range === '7D') {
      for (let i = bucketCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
      }
      nonCancelledOrders.forEach((o) => {
        const diffDays = Math.floor((Date.now() - Number(o.date)) / (24 * 60 * 60 * 1000));
        if (diffDays >= 0 && diffDays < bucketCount) {
          values[bucketCount - 1 - diffDays] += Number(o.amount || 0);
          counts[bucketCount - 1 - diffDays] += 1;
        }
      });
    } else if (range === '30D') {
      for (let i = bucketCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i * 4);
        labels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
      }
      nonCancelledOrders.forEach((o) => {
        const diffDays = Math.floor((Date.now() - Number(o.date)) / (24 * 60 * 60 * 1000));
        const slot = Math.floor(diffDays / 4);
        if (slot >= 0 && slot < bucketCount) {
          values[bucketCount - 1 - slot] += Number(o.amount || 0);
          counts[bucketCount - 1 - slot] += 1;
        }
      });
    } else {
      for (let i = bucketCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString('en-IN', { month: 'short' }));
      }
      nonCancelledOrders.forEach((o) => {
        const od = new Date(Number(o.date));
        const monthDiff =
          (now.getFullYear() - od.getFullYear()) * 12 + (now.getMonth() - od.getMonth());
        if (monthDiff >= 0 && monthDiff < bucketCount) {
          values[bucketCount - 1 - monthDiff] += Number(o.amount || 0);
          counts[bucketCount - 1 - monthDiff] += 1;
        }
      });
    }

    const maxVal = Math.max(...values, 100);
    return { labels, values, counts, maxVal };
  }, [nonCancelledOrders, range]);

  const chartW = 640;
  const chartH = 195;
  const usableH = chartH - 34;
  const stepX = chartW / Math.max(1, chartData.values.length - 1);
  const pts = chartData.values.map((v, i) => ({
    x: i * stepX,
    y: 20 + usableH - (v / chartData.maxVal) * usableH,
  }));

  let mainLine = pts.length ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}` : '';
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    mainLine += ` C ${cx.toFixed(1)} ${pts[i].y.toFixed(1)}, ${cx.toFixed(1)} ${pts[i + 1].y.toFixed(1)}, ${pts[i + 1].x.toFixed(1)} ${pts[i + 1].y.toFixed(1)}`;
  }
  const mainArea = mainLine ? `${mainLine} L ${chartW} ${chartH} L 0 ${chartH} Z` : '';

  const packingQueue = useMemo(
    () => orders.filter((o) => o.status === 'Order Placed').reverse().slice(0, 4),
    [orders]
  );

  const stockAlerts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const aSold = a.soldOut ? 1 : 0;
      const bSold = b.soldOut ? 1 : 0;
      if (aSold !== bSold) return bSold - aSold;
      return (a.sizes?.length || 0) - (b.sizes?.length || 0);
    });
    return sorted.slice(0, 4);
  }, [products]);

  const categoryBreakdown = useMemo(() => {
    const map = { Men: 0, Women: 0, Kids: 0, Other: 0 };
    nonCancelledOrders.forEach((order) => {
      (order.items || []).forEach((it) => {
        const cat = map[it.category] !== undefined ? it.category : 'Other';
        map[cat] += Number(it.price || 0) * Number(it.quantity || 1);
      });
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    const colors = {
      Men: 'bg-indigo-500',
      Women: 'bg-violet-500',
      Kids: 'bg-amber-400',
      Other: 'bg-emerald-400',
    };
    return Object.entries(map)
      .filter(([, amt]) => amt > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
        pct: Math.round((amount / total) * 100),
        color: colors[name],
      }));
  }, [nonCancelledOrders]);

  const bestSellers = useMemo(() => {
    const map = {};
    nonCancelledOrders.forEach((order) => {
      (order.items || []).forEach((it) => {
        const key = it._id || it.name;
        if (!map[key]) {
          map[key] = {
            id: it._id,
            name: it.name,
            image: Array.isArray(it.image) ? it.image[0] : it.image,
            units: 0,
            revenue: 0,
          };
        }
        const qty = Number(it.quantity || 1);
        map[key].units += qty;
        map[key].revenue += Number(it.price || 0) * qty;
      });
    });
    return Object.values(map).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [nonCancelledOrders]);

  const maxSellerUnits = Math.max(...bestSellers.map((s) => s.units), 1);
  const recentOrders = [...orders].reverse().slice(0, 6);

  const saveGoal = (e) => {
    e.preventDefault();
    const parsed = Number(goalDraft);
    if (parsed > 0) {
      setMonthlyGoal(parsed);
      localStorage.setItem('xshop_monthly_goal', String(parsed));
      toast.success('Monthly goal updated');
    }
    setEditingGoal(false);
  };

  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (goalPct / 100) * ringCircumference;

  const allHealthy =
    health.frontend.status === 'online' &&
    health.backend.status === 'online' &&
    health.admin.status === 'online' &&
    health.database.status === 'online';

  const statusBadge = (st) => {
    if (st === 'online') {
      return (
        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-semibold text-emerald-400'>
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]' />
          Healthy
        </span>
      );
    }
    if (st === 'checking') {
      return (
        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-[10px] font-semibold text-zinc-400'>
          Checking...
        </span>
      );
    }
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/35 text-[10px] font-semibold text-rose-400'>
        <span className='w-1.5 h-1.5 rounded-full bg-rose-400' />
        Offline
      </span>
    );
  };

  return (
    <div className='w-full space-y-5'>
      {/* ROW 1: KPI + Real Sales Studio | Live System Health + Monthly Goal */}
      <div className='flex flex-col xl:flex-row gap-5 items-stretch'>
        {/* Left: Sales Studio (approx 66%) */}
        <div className='w-full xl:w-2/3 cirrel-panel rounded-[28px] overflow-hidden flex flex-col justify-between min-w-0'>
          <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] border-b border-white/[0.08]'>
            <div className='p-5 sm:p-6 space-y-2'>
              <p className='text-xs text-zinc-400 font-medium'>Net Revenue</p>
              <p className='text-3xl font-bold tracking-tight text-white tabular-nums'>
                {currency}{totalRevenue.toLocaleString('en-IN')}
              </p>
              <div className='flex items-center gap-2 text-[11px]'>
                <span className='px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold'>
                  Live DB
                </span>
                <span className='text-zinc-500'>{nonCancelledOrders.length} active orders</span>
              </div>
            </div>

            <div className='p-5 sm:p-6 space-y-2'>
              <p className='text-xs text-zinc-400 font-medium'>Last 7 days</p>
              <p className='text-3xl font-bold tracking-tight text-white tabular-nums'>
                {currency}{last7DaysRevenue.toLocaleString('en-IN')}
              </p>
              <div className='flex items-center gap-2 text-[11px]'>
                <span className='px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-semibold tabular-nums'>
                  {deliveredPct}% done
                </span>
                <span className='text-zinc-500'>Fulfillment rate</span>
              </div>
            </div>

            <div className='p-5 sm:p-6 space-y-2'>
              <p className='text-xs text-zinc-400 font-medium'>Total orders</p>
              <p className='text-3xl font-bold tracking-tight text-white tabular-nums'>
                {totalOrdersCount}
              </p>
              <div className='flex items-center gap-2 text-[11px]'>
                <span className='px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold tabular-nums'>
                  {deliveredCount} delivered
                </span>
                <span className='text-zinc-500'>{pendingCount} active</span>
              </div>
            </div>
          </div>

          {/* Real Sales Studio SVG Chart (No synthetic baseline) */}
          <div className='p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h3 className='text-sm font-semibold text-white'>Sales studio</h3>
                <p className='text-xs text-zinc-400 mt-0.5 tabular-nums'>
                  Real revenue trend from MongoDB Atlas ({products.length} catalog SKUs)
                </p>
              </div>

              <div className='flex items-center p-1 rounded-full bg-white/[0.05] border border-white/[0.09] text-[11px]'>
                {['ALL', '30D', '7D'].map((item) => (
                  <button
                    type='button'
                    key={item}
                    onClick={() => setRange(item)}
                    className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                      range === item ? 'btn-primary' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='relative w-full pt-2'>
              {hoveredIdx !== null && pts[hoveredIdx] && (
                <div
                  style={{
                    left: `${Math.min(82, Math.max(10, (hoveredIdx / 6) * 100))}%`,
                  }}
                  className='pointer-events-none absolute top-0 z-20 -translate-x-1/2 rounded-2xl bg-[#f8fafc] text-slate-900 px-3.5 py-2 shadow-xl border border-slate-200 text-xs min-w-[110px]'
                >
                  <p className='font-extrabold text-sm tabular-nums text-slate-900'>
                    {currency}{chartData.values[hoveredIdx].toLocaleString('en-IN')}
                  </p>
                  <p className='text-[11px] text-slate-600'>
                    {chartData.labels[hoveredIdx]} • {chartData.counts[hoveredIdx]} order{chartData.counts[hoveredIdx] !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className='w-full h-[185px] sm:h-[210px] overflow-visible'
                preserveAspectRatio='none'
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <defs>
                  <linearGradient id='xshopSalesFill' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#8b5cf6' stopOpacity='0.36' />
                    <stop offset='75%' stopColor='#6366f1' stopOpacity='0.08' />
                    <stop offset='100%' stopColor='#000000' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient id='xshopSalesStroke' x1='0' y1='0' x2='1' y2='0'>
                    <stop offset='0%' stopColor='#6366f1' />
                    <stop offset='55%' stopColor='#8b5cf6' />
                    <stop offset='100%' stopColor='#c4b5fd' />
                  </linearGradient>
                </defs>

                {[0.2, 0.5, 0.8].map((pos, idx) => (
                  <line
                    key={idx}
                    x1='0'
                    y1={chartH * pos}
                    x2={chartW}
                    y2={chartH * pos}
                    stroke='rgba(148,163,184,0.14)'
                    strokeDasharray='4 6'
                  />
                ))}

                {mainArea && <path d={mainArea} fill='url(#xshopSalesFill)' />}
                {mainLine && (
                  <path
                    d={mainLine}
                    fill='none'
                    stroke='url(#xshopSalesStroke)'
                    strokeWidth='2.8'
                    strokeLinecap='round'
                  />
                )}

                {pts.map((pt, i) => (
                  <g key={i}>
                    {hoveredIdx === i && (
                      <line
                        x1={pt.x}
                        y1='0'
                        x2={pt.x}
                        y2={chartH}
                        stroke='rgba(139,92,246,0.4)'
                        strokeDasharray='3 3'
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredIdx === i ? '5.5' : '3.5'}
                      fill={hoveredIdx === i ? '#ffffff' : '#c4b5fd'}
                      stroke='#7c3aed'
                      strokeWidth='2'
                      className='cursor-pointer'
                      onMouseEnter={() => setHoveredIdx(i)}
                    />
                    <rect
                      x={pt.x - 36}
                      y='0'
                      width='72'
                      height={chartH}
                      fill='transparent'
                      className='cursor-pointer'
                      onMouseEnter={() => setHoveredIdx(i)}
                    />
                  </g>
                ))}
              </svg>

              {/* Always-Horizontal X-Axis Labels */}
              <div className='flex items-center justify-between gap-2 text-[11px] text-zinc-500 pt-2.5'>
                {chartData.labels.map((lbl, idx) => (
                  <span key={idx} className='truncate text-center flex-1'>{lbl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live System Health + Monthly Goal (approx 33%) */}
        <div className='w-full xl:w-1/3 flex flex-col gap-5 min-w-0'>
          {/* LIVE SYSTEM HEALTH MONITOR (Frontend + Backend + Admin + MongoDB) */}
          <div className='cirrel-panel rounded-[28px] p-6 space-y-4'>
            <div className='flex items-start justify-between gap-2'>
              <div>
                <div className='flex items-center gap-2'>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      allHealthy ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  <h3 className='text-sm font-semibold text-white'>System Health</h3>
                </div>
                <p className='text-[11px] text-zinc-400 mt-0.5'>
                  Live stack diagnostics
                  {health.lastChecked && ` • ${health.lastChecked.toLocaleTimeString('en-IN')}`}
                </p>
              </div>

              <button
                type='button'
                onClick={runHealthChecks}
                disabled={checkingHealth}
                className='glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-zinc-200 hover:text-white cursor-pointer disabled:opacity-50'
              >
                {checkingHealth ? 'Checking...' : 'Re-check'}
              </button>
            </div>

            <div className='space-y-2.5 text-xs'>
              {/* Frontend */}
              <div className='flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]'>
                <div className='min-w-0'>
                  <p className='font-semibold text-white'>Frontend Store</p>
                  <p className='text-[10px] text-zinc-500 truncate'>
                    {health.frontend.latency != null ? `${health.frontend.latency} ms ping` : health.frontend.target}
                  </p>
                </div>
                {statusBadge(health.frontend.status)}
              </div>

              {/* Backend */}
              <div className='flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]'>
                <div className='min-w-0'>
                  <p className='font-semibold text-white'>Backend API</p>
                  <p className='text-[10px] text-zinc-500 truncate'>
                    {health.backend.latency != null
                      ? `${health.backend.latency} ms • Up ${formatUptime(health.backend.uptime)}`
                      : 'API server unreachable'}
                  </p>
                </div>
                {statusBadge(health.backend.status)}
              </div>

              {/* Admin Panel */}
              <div className='flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]'>
                <div className='min-w-0'>
                  <p className='font-semibold text-white'>Admin Panel</p>
                  <p className='text-[10px] text-zinc-500 truncate'>
                    {health.admin.session}
                    {health.backend.memoryMB ? ` • ${health.backend.memoryMB} MB RSS` : ''}
                  </p>
                </div>
                {statusBadge(health.admin.status)}
              </div>

              {/* MongoDB Atlas */}
              <div className='flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]'>
                <div className='min-w-0'>
                  <p className='font-semibold text-white'>MongoDB Atlas</p>
                  <p className='text-[10px] text-zinc-500 truncate'>
                    {health.database.state}
                    {health.database.latency != null ? ` • ${health.database.latency} ms` : ''}
                  </p>
                </div>
                {statusBadge(health.database.status)}
              </div>
            </div>
          </div>

          {/* Monthly Revenue Goal */}
          <div className='cirrel-panel rounded-[28px] p-6 space-y-4'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-sm font-semibold text-white'>{currentMonthName} goal</h3>
                <p className='text-xs text-zinc-400 mt-0.5'>{daysLeft} days to go</p>
              </div>
              <button
                type='button'
                onClick={() => {
                  setGoalDraft(String(monthlyGoal));
                  setEditingGoal((prev) => !prev);
                }}
                title='Edit monthly goal'
                className='glass-pill w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer'
              >
                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                </svg>
              </button>
            </div>

            {editingGoal && (
              <form onSubmit={saveGoal} className='flex items-center gap-2'>
                <input
                  type='number'
                  min={100}
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.target.value)}
                  className='flex-1 glass-input rounded-xl px-3 py-1.5 text-xs tabular-nums'
                  placeholder='Target ₹'
                />
                <button type='submit' className='btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer'>
                  Save
                </button>
              </form>
            )}

            <div className='flex items-center gap-5'>
              <div className='relative w-24 h-24 shrink-0 flex items-center justify-center'>
                <svg className='w-24 h-24 -rotate-90' viewBox='0 0 100 100'>
                  <circle cx='50' cy='50' r={ringRadius} fill='none' stroke='rgba(148,163,184,0.16)' strokeWidth='8' />
                  <circle
                    cx='50'
                    cy='50'
                    r={ringRadius}
                    fill='none'
                    stroke='#8b5cf6'
                    strokeWidth='8'
                    strokeLinecap='round'
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className='transition-all duration-700'
                  />
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                  <span className='text-base font-bold text-white tabular-nums leading-none'>{goalPct}%</span>
                  <span className='text-[9px] text-zinc-500 mt-1 tabular-nums'>
                    of {currency}{(monthlyGoal / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              <div className='flex-1 space-y-2.5 text-xs'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-zinc-400'>Booked</span>
                  <span className='font-semibold text-white tabular-nums'>
                    {currency}{totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-zinc-400'>Daily pace</span>
                  <span className='font-semibold text-white tabular-nums'>
                    {currency}{dailyPaceNeeded.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-zinc-400'>Target</span>
                  <span className='font-semibold text-violet-400 tabular-nums'>
                    {currency}{monthlyGoal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Packing Queue + Stock Watchlist */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className='cirrel-panel rounded-[28px] p-6 space-y-4 min-w-0'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Packing queue</h3>
              <p className='text-xs text-zinc-400 mt-0.5'>
                {packingQueue.length} order{packingQueue.length !== 1 ? 's' : ''} waiting to be packed
              </p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/orders')}
              className='text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer'
            >
              Board
            </button>
          </div>

          {packingQueue.length === 0 ? (
            <div className='py-8 text-center text-xs text-zinc-500'>
              All caught up! No new orders waiting in the packing queue.
            </div>
          ) : (
            <div className='divide-y divide-white/[0.08]'>
              {packingQueue.map((order) => {
                const initials =
                  `${order.address?.firstName?.[0] || 'C'}${order.address?.lastName?.[0] || ''}`.toUpperCase();
                return (
                  <div key={order._id} className='py-3 flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='w-9 h-9 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shrink-0'>
                        {initials}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-xs sm:text-sm font-semibold text-white truncate'>
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p className='text-[11px] text-zinc-500 font-mono truncate'>
                          #{order._id.slice(-6).toUpperCase()} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 shrink-0'>
                      <span className='text-xs sm:text-sm font-bold text-white tabular-nums'>
                        {currency}{order.amount}
                      </span>
                      <button
                        type='button'
                        onClick={() => markOrderPacked(order._id)}
                        className='glass-pill hover:border-violet-400/60 px-3 py-1.5 rounded-full text-[11px] font-semibold text-zinc-200 hover:text-white cursor-pointer'
                      >
                        Packed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className='cirrel-panel rounded-[28px] p-6 space-y-4 min-w-0'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Stock watchlist</h3>
              <p className='text-xs text-zinc-400 mt-0.5'>Sold out items & limited-size products</p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/list')}
              className='text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer'
            >
              Stock
            </button>
          </div>

          <div className='divide-y divide-white/[0.08]'>
            {stockAlerts.map((item) => {
              const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
              const isSold = Boolean(item.soldOut);
              const sizeCount = item.sizes?.length || 0;
              const barPct = isSold ? 6 : Math.min(100, sizeCount * 22);

              return (
                <div key={item._id} className='py-3 flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <img src={imgUrl} alt={item.name} className='w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs sm:text-sm font-semibold text-white truncate'>{item.name}</p>
                      <p className='text-[11px] text-zinc-500'>
                        {isSold ? 'Sold Out • Restock needed' : `${sizeCount} size${sizeCount !== 1 ? 's' : ''} active • ${currency}${item.price}`}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 shrink-0'>
                    <div className='hidden sm:block w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden'>
                      <div
                        style={{ width: `${barPct}%` }}
                        className={`h-full rounded-full ${isSold ? 'bg-rose-500' : sizeCount <= 2 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      />
                    </div>
                    {isSold ? (
                      <button
                        type='button'
                        onClick={() => quickRestock(item._id)}
                        className='btn-violet px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer'
                      >
                        Restock
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() => navigate('/list')}
                        className='glass-pill px-3 py-1.5 rounded-full text-[11px] font-semibold text-zinc-300 hover:text-white cursor-pointer'
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Category Revenue Share */}
      {categoryBreakdown.length > 0 && (
        <div className='cirrel-panel rounded-[28px] p-6 space-y-4'>
          <div>
            <h3 className='text-sm font-semibold text-white'>Where sales came from</h3>
            <p className='text-xs text-zinc-400 mt-0.5 tabular-nums'>
              Real category revenue mix • {currency}{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className='w-full h-3.5 rounded-full bg-white/[0.06] overflow-hidden flex gap-1 p-0.5'>
            {categoryBreakdown.map((seg) => (
              <div
                key={seg.name}
                style={{ width: `${Math.max(8, seg.pct)}%` }}
                className={`h-full rounded-full ${seg.color}`}
              />
            ))}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs'>
            {categoryBreakdown.map((seg) => (
              <div key={seg.name} className='flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07]'>
                <div className='flex items-center gap-2'>
                  <span className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                  <span className='font-medium text-zinc-200'>{seg.name}</span>
                </div>
                <div className='flex items-center gap-2.5 tabular-nums'>
                  <span className='text-zinc-500'>{seg.pct}%</span>
                  <span className='font-bold text-white'>{currency}{seg.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROW 4: Latest Orders + Best Sellers */}
      <div className='flex flex-col xl:flex-row gap-5 items-start'>
        <div className='w-full xl:w-2/3 cirrel-panel rounded-[28px] p-6 space-y-4 min-w-0'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Latest orders</h3>
              <p className='text-xs text-zinc-400 mt-0.5'>Click any order to manage status</p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/orders')}
              className='text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer'
            >
              View all →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className='text-xs text-zinc-500 py-8 text-center'>No orders found yet.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse text-xs'>
                <thead>
                  <tr className='border-b border-white/[0.08] text-[11px] text-zinc-500'>
                    <th className='pb-3 font-medium'>Order</th>
                    <th className='pb-3 font-medium'>Customer</th>
                    <th className='pb-3 font-medium'>Items</th>
                    <th className='pb-3 font-medium'>Placed</th>
                    <th className='pb-3 font-medium'>Total</th>
                    <th className='pb-3 font-medium text-right'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/[0.07]'>
                  {recentOrders.map((order) => {
                    const initials =
                      `${order.address?.firstName?.[0] || 'C'}${order.address?.lastName?.[0] || ''}`.toUpperCase();
                    return (
                      <tr
                        key={order._id}
                        onClick={() => navigate('/orders')}
                        className='hover:bg-white/[0.03] cursor-pointer transition'
                      >
                        <td className='py-3.5 font-mono text-zinc-300 pr-3'>
                          XS-{order._id.slice(-5).toUpperCase()}
                        </td>
                        <td className='py-3.5 pr-3'>
                          <div className='flex items-center gap-2.5'>
                            <span className='w-7 h-7 rounded-full bg-white text-black font-bold text-[10px] flex items-center justify-center shrink-0'>
                              {initials}
                            </span>
                            <div className='min-w-0'>
                              <p className='font-semibold text-white truncate max-w-[130px]'>
                                {order.address?.firstName} {order.address?.lastName}
                              </p>
                              <p className='text-[10px] text-zinc-500 truncate max-w-[130px]'>
                                {order.address?.city}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='py-3.5 pr-3'>
                          <div className='flex items-center -space-x-1.5'>
                            {order.items.slice(0, 3).map((it, i) => (
                              <img
                                key={i}
                                src={Array.isArray(it.image) ? it.image[0] : it.image}
                                alt=''
                                className='w-7 h-7 rounded-lg object-cover border border-white/20 bg-zinc-900'
                              />
                            ))}
                          </div>
                        </td>
                        <td className='py-3.5 pr-3 text-zinc-400 whitespace-nowrap'>
                          {timeAgo(order.date)}
                        </td>
                        <td className='py-3.5 pr-3 font-bold text-white tabular-nums whitespace-nowrap'>
                          {currency}{order.amount}
                        </td>
                        <td className='py-3.5 text-right whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-500/12 text-emerald-400 border-emerald-400/25'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-500/12 text-rose-400 border-rose-400/25'
                                : order.status === 'Order Placed'
                                ? 'bg-amber-500/12 text-amber-300 border-amber-400/25'
                                : 'bg-violet-500/15 text-violet-300 border-violet-400/30'
                            }`}
                          >
                            <span className='w-1.5 h-1.5 rounded-full bg-current' />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='w-full xl:w-1/3 cirrel-panel rounded-[28px] p-6 space-y-4 min-w-0'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Best sellers</h3>
              <p className='text-xs text-zinc-400 mt-0.5'>Ranked by real units sold</p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/list')}
              className='text-xs font-semibold text-violet-400 hover:text-violet-300 cursor-pointer'
            >
              Catalog
            </button>
          </div>

          {bestSellers.length === 0 ? (
            <p className='text-xs text-zinc-500 py-8 text-center'>No product sales recorded yet.</p>
          ) : (
            <div className='space-y-4'>
              {bestSellers.map((prod, idx) => {
                const barWidth = Math.max(14, Math.round((prod.units / maxSellerUnits) * 100));
                return (
                  <div key={prod.id || idx} className='space-y-1.5'>
                    <div className='flex items-center justify-between gap-2.5'>
                      <div className='flex items-center gap-2.5 min-w-0'>
                        <span className='text-xs font-mono text-zinc-500 w-3'>{idx + 1}</span>
                        {prod.image && (
                          <img src={prod.image} alt={prod.name} className='w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0' />
                        )}
                        <div className='min-w-0'>
                          <p className='text-xs font-semibold text-white truncate'>{prod.name}</p>
                          <p className='text-[10px] text-zinc-500 tabular-nums'>
                            {currency}{prod.revenue.toLocaleString('en-IN')} revenue
                          </p>
                        </div>
                      </div>
                      <span className='text-xs font-bold text-white tabular-nums shrink-0'>
                        {prod.units} sold
                      </span>
                    </div>
                    <div className='w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden'>
                      <div
                        style={{ width: `${barWidth}%` }}
                        className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400'
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
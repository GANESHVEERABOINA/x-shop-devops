import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Analytics = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [metric, setMetric] = useState('revenue')
  const [daysRange, setDaysRange] = useState(90)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const res = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
        if (res.data.success) {
          setOrders(res.data.orders.filter((o) => Array.isArray(o.items) && o.items.length > 0));
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - daysRange * 24 * 60 * 60 * 1000;
    return orders.filter((o) => Number(o.date) >= cutoff && o.status !== 'Cancelled');
  }, [orders, daysRange]);

  const totalRevenue = filtered.reduce((s, o) => s + Number(o.amount || 0), 0);
  const totalOrders = filtered.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const totalUnits = filtered.reduce(
    (s, o) => s + o.items.reduce((q, it) => q + Number(it.quantity || 1), 0),
    0
  );

  const series = useMemo(() => {
    const buckets = 8;
    const stepMs = (daysRange * 24 * 60 * 60 * 1000) / buckets;
    const startTs = Date.now() - daysRange * 24 * 60 * 60 * 1000;
    const vals = new Array(buckets).fill(0);
    const labels = [];

    for (let i = 0; i < buckets; i++) {
      const d = new Date(startTs + i * stepMs);
      labels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
    }

    filtered.forEach((o) => {
      const idx = Math.min(buckets - 1, Math.max(0, Math.floor((Number(o.date) - startTs) / stepMs)));
      if (metric === 'revenue') vals[idx] += Number(o.amount || 0);
      else if (metric === 'orders') vals[idx] += 1;
      else if (metric === 'units') vals[idx] += o.items.reduce((q, it) => q + Number(it.quantity || 1), 0);
      else vals[idx] += Number(o.amount || 0);
    });

    if (metric === 'aov') {
      const orderCounts = new Array(buckets).fill(0);
      filtered.forEach((o) => {
        const idx = Math.min(buckets - 1, Math.max(0, Math.floor((Number(o.date) - startTs) / stepMs)));
        orderCounts[idx] += 1;
      });
      for (let i = 0; i < buckets; i++) {
        vals[i] = orderCounts[i] ? Math.round(vals[i] / orderCounts[i]) : 0;
      }
    }

    const max = Math.max(...vals, 10);
    return { vals, labels, max };
  }, [filtered, daysRange, metric]);

  const w = 700;
  const h = 210;
  const stepX = w / (series.vals.length - 1);
  const pts = series.vals.map((v, i) => ({
    x: i * stepX,
    y: 20 + (h - 36) - (v / series.max) * (h - 36),
  }));
  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    line += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  const formatMetricVal = (val) =>
    metric === 'revenue' || metric === 'aov' ? `${currency}${val.toLocaleString('en-IN')}` : val;

  const kpis = [
    { key: 'revenue', label: 'Revenue', value: `${currency}${totalRevenue.toLocaleString('en-IN')}`, sub: `Last ${daysRange} days` },
    { key: 'orders', label: 'Orders', value: totalOrders, sub: `Last ${daysRange} days` },
    { key: 'aov', label: 'Average order', value: `${currency}${avgOrder.toLocaleString('en-IN')}`, sub: 'Per active order' },
    { key: 'units', label: 'Units sold', value: totalUnits, sub: 'Total items ordered' },
  ];

  const funnel = [
    { label: 'Order Placed', count: orders.length, color: 'bg-indigo-500' },
    {
      label: 'Packing / Shipped',
      count: orders.filter((o) => ['Packing', 'Shipped', 'Out for delivery', 'Delivered'].includes(o.status)).length,
      color: 'bg-violet-500',
    },
    { label: 'Delivered', count: orders.filter((o) => o.status === 'Delivered').length, color: 'bg-emerald-400' },
  ];

  return (
    <div className='w-full space-y-5'>
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Analytics</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            Click any metric card to inspect real store trends
          </p>
        </div>

        <div className='flex items-center p-1 rounded-full glass-pill text-xs self-start sm:self-auto'>
          {[
            { d: 30, label: '30 days' },
            { d: 90, label: '90 days' },
            { d: 365, label: '12 months' },
          ].map((item) => (
            <button
              type='button'
              key={item.d}
              onClick={() => setDaysRange(item.d)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
                daysRange === item.d ? 'btn-violet' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Selectable Metric Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {kpis.map((card) => {
          const active = metric === card.key;
          return (
            <button
              type='button'
              key={card.key}
              onClick={() => setMetric(card.key)}
              className={`cirrel-panel rounded-[24px] p-5 text-left space-y-2 transition cursor-pointer ${
                active ? 'border-violet-500 ring-2 ring-violet-500/35' : 'glass-card-hover'
              }`}
            >
              <p className='text-xs font-medium text-zinc-400'>{card.label}</p>
              <p className='text-3xl font-bold text-white tabular-nums'>{card.value}</p>
              <p className='text-[11px] text-emerald-400 font-medium'>{card.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Main Curve Chart with Fixed Horizontal Axis */}
      <div className='cirrel-panel rounded-[28px] p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-semibold text-white capitalize'>
              {metric === 'aov' ? 'Average Order Value' : metric}
            </h3>
            <p className='text-xs text-zinc-400 mt-0.5'>Real trend across the last {daysRange} days</p>
          </div>
          <span className='glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-violet-400'>
            Live DB
          </span>
        </div>

        <div className='relative w-full pt-2'>
          {hoveredIdx !== null && pts[hoveredIdx] && (
            <div
              style={{
                left: `${Math.min(84, Math.max(10, (hoveredIdx / 7) * 100))}%`,
              }}
              className='pointer-events-none absolute top-0 z-20 -translate-x-1/2 rounded-2xl bg-[#f8fafc] text-slate-900 px-3.5 py-2 shadow-xl border border-slate-200 text-xs'
            >
              <p className='font-extrabold text-sm tabular-nums text-slate-900'>
                {formatMetricVal(series.vals[hoveredIdx])}
              </p>
              <p className='text-[11px] text-slate-500'>{series.labels[hoveredIdx]}</p>
            </div>
          )}

          <svg
            viewBox={`0 0 ${w} ${h}`}
            className='w-full h-[210px] overflow-visible'
            preserveAspectRatio='none'
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id='analyticsFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#8b5cf6' stopOpacity='0.38' />
                <stop offset='100%' stopColor='#000000' stopOpacity='0' />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((p, idx) => (
              <line key={idx} x1='0' y1={h * p} x2={w} y2={h * p} stroke='rgba(148,163,184,0.14)' strokeDasharray='4 6' />
            ))}
            <path d={area} fill='url(#analyticsFill)' />
            <path d={line} fill='none' stroke='#8b5cf6' strokeWidth='2.8' strokeLinecap='round' />
            {pts.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === idx ? '5.5' : '3.5'}
                  fill={hoveredIdx === idx ? '#ffffff' : '#c4b5fd'}
                  stroke='#7c3aed'
                  strokeWidth='2'
                  className='cursor-pointer'
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
                <rect
                  x={pt.x - 36}
                  y='0'
                  width='72'
                  height={h}
                  fill='transparent'
                  className='cursor-pointer'
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              </g>
            ))}
          </svg>

          {/* Horizontal Flex Axis (Never stacks vertically) */}
          <div className='flex items-center justify-between gap-2 text-[11px] text-zinc-500 pt-3'>
            {series.labels.map((l, idx) => (
              <span key={idx} className='truncate text-center flex-1'>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Fulfillment Funnel */}
      <div className='cirrel-panel rounded-[28px] p-6 space-y-4'>
        <div>
          <h3 className='text-sm font-semibold text-white'>Fulfillment funnel</h3>
          <p className='text-xs text-zinc-400 mt-0.5'>How orders progress from placement to delivery</p>
        </div>

        <div className='space-y-3'>
          {funnel.map((step) => {
            const pct = orders.length ? Math.round((step.count / orders.length) * 100) : 0;
            return (
              <div key={step.label} className='space-y-1.5 text-xs'>
                <div className='flex justify-between'>
                  <span className='font-medium text-zinc-200'>{step.label}</span>
                  <span className='text-zinc-400 tabular-nums'>
                    <strong className='text-white'>{step.count}</strong> ({pct}%)
                  </span>
                </div>
                <div className='w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden'>
                  <div style={{ width: `${Math.max(4, pct)}%` }} className={`h-full rounded-full ${step.color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Analytics
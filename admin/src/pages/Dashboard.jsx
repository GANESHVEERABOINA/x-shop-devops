import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const orderRes = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (orderRes.data.success) {
        setOrders(orderRes.data.orders)
      } else {
        toast.error(orderRes.data.message)
      }

      const prodRes = await axios.get(backendUrl + '/api/product/list')
      if (prodRes.data.success) {
        setProducts(prodRes.data.products)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  // Real Calculations from MongoDB Database
  const totalRevenue = orders.reduce((acc, curr) => {
    if (curr.status !== 'Cancelled') {
      return acc + Number(curr.amount || 0);
    }
    return acc;
  }, 0);

  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
  const totalProductsCount = products.length;

  const deliveredPct = totalOrdersCount ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0;
  const pendingPct = totalOrdersCount ? Math.round((pendingCount / totalOrdersCount) * 100) : 0;
  const cancelledPct = totalOrdersCount ? Math.round((cancelledCount / totalOrdersCount) * 100) : 0;

  const pendingBarH = totalOrdersCount ? Math.max(16, Math.round((pendingCount / totalOrdersCount) * 100)) : 16;
  const deliveredBarH = totalOrdersCount ? Math.max(16, Math.round((deliveredCount / totalOrdersCount) * 100)) : 16;
  const cancelledBarH = totalOrdersCount ? Math.max(16, Math.round((cancelledCount / totalOrdersCount) * 100)) : 16;

  const donutGradient = totalOrdersCount
    ? `conic-gradient(#34d399 0% ${deliveredPct}%, #8b5cf6 ${deliveredPct}% ${deliveredPct + pendingPct}%, #52525b ${deliveredPct + pendingPct}% 100%)`
    : `conic-gradient(rgba(255,255,255,0.12) 0% 100%)`;

  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className='text-zinc-100 w-full space-y-6'>
      
      {/* Clean SaaS Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>
            Overview
          </h1>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            Real-time store metrics synced with MongoDB Atlas
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className='glass-pill text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-zinc-200 self-start sm:self-auto'
        >
          <svg className='w-3.5 h-3.5 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2.2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          <span>Sync Data</span>
        </button>
      </div>

      {/* 4 Minimalist Frosted Glass KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        
        {/* Revenue */}
        <div className='glass-card glass-card-hover rounded-2xl p-5 space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-zinc-400'>Total Revenue</span>
            <div className='w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-400/25 flex items-center justify-center text-violet-400'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
          <div className='text-3xl font-bold tracking-tight text-white tabular-nums'>
            {currency}{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className='flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
            <span>Active net sales</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className='glass-card glass-card-hover rounded-2xl p-5 space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-zinc-400'>Total Orders</span>
            <div className='w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-300'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
            </div>
          </div>
          <div className='text-3xl font-bold tracking-tight text-white tabular-nums'>
            {totalOrdersCount}
          </div>
          <p className='text-[11px] text-zinc-500 font-medium'>{pendingCount} currently processing</p>
        </div>

        {/* Delivered Orders */}
        <div className='glass-card glass-card-hover rounded-2xl p-5 space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-zinc-400'>Delivered</span>
            <div className='w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-400'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>
          </div>
          <div className='text-3xl font-bold tracking-tight text-white tabular-nums'>
            {deliveredCount}
          </div>
          <p className='text-[11px] text-zinc-500 font-medium'>{deliveredPct}% completion rate</p>
        </div>

        {/* Inventory */}
        <div className='glass-card glass-card-hover rounded-2xl p-5 space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-zinc-400'>Inventory Items</span>
            <div className='w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-300'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
            </div>
          </div>
          <div className='text-3xl font-bold tracking-tight text-white tabular-nums'>
            {totalProductsCount}
          </div>
          <p className='text-[11px] text-zinc-500 font-medium'>Live catalog SKUs</p>
        </div>

      </div>

      {/* Analytics Row */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch'>
        
        {/* Left: Sleek Glass Bar Chart */}
        <div className='lg:col-span-7 glass-card rounded-2xl p-6 flex flex-col justify-between space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-sm font-semibold text-white'>Order Performance</h4>
              <p className='text-xs text-zinc-500 mt-0.5'>Breakdown across active order states</p>
            </div>
            <span className='text-[11px] font-medium text-violet-300 bg-violet-500/15 border border-violet-400/25 px-2.5 py-1 rounded-full'>
              Live
            </span>
          </div>

          <div className='relative h-56 flex items-end justify-around gap-5 sm:gap-8 pt-6 pb-1 px-4 border-b border-white/[0.08]'>
            {/* Subtle horizontal reference lines */}
            <div className='pointer-events-none absolute inset-x-0 top-1/4 border-t border-dashed border-white/[0.05]' />
            <div className='pointer-events-none absolute inset-x-0 top-2/4 border-t border-dashed border-white/[0.05]' />
            <div className='pointer-events-none absolute inset-x-0 top-3/4 border-t border-dashed border-white/[0.05]' />

            {/* Processing */}
            <div className='relative z-10 flex-1 max-w-[76px] h-full flex flex-col justify-end items-center gap-2'>
              <span className='text-xs font-semibold text-zinc-300 tabular-nums'>{pendingCount}</span>
              <div
                style={{ height: `${pendingBarH}%` }}
                className='w-full min-h-[20px] rounded-t-xl bg-gradient-to-t from-violet-600/35 to-violet-400/80 border border-violet-300/30 transition-all duration-500 shadow-[0_0_25px_-6px_rgba(139,92,246,0.45)]'
              />
            </div>

            {/* Delivered */}
            <div className='relative z-10 flex-1 max-w-[76px] h-full flex flex-col justify-end items-center gap-2'>
              <span className='text-xs font-semibold text-emerald-300 tabular-nums'>{deliveredCount}</span>
              <div
                style={{ height: `${deliveredBarH}%` }}
                className='w-full min-h-[20px] rounded-t-xl bg-gradient-to-t from-emerald-600/35 to-emerald-400/80 border border-emerald-300/30 transition-all duration-500 shadow-[0_0_25px_-6px_rgba(52,211,153,0.4)]'
              />
            </div>

            {/* Cancelled */}
            <div className='relative z-10 flex-1 max-w-[76px] h-full flex flex-col justify-end items-center gap-2'>
              <span className='text-xs font-semibold text-zinc-400 tabular-nums'>{cancelledCount}</span>
              <div
                style={{ height: `${cancelledBarH}%` }}
                className='w-full min-h-[20px] rounded-t-xl bg-gradient-to-t from-zinc-700/40 to-zinc-500/70 border border-white/15 transition-all duration-500'
              />
            </div>

            {/* Total */}
            <div className='relative z-10 flex-1 max-w-[76px] h-full flex flex-col justify-end items-center gap-2'>
              <span className='text-xs font-bold text-white tabular-nums'>{totalOrdersCount}</span>
              <div
                className='w-full h-[90%] rounded-t-xl bg-gradient-to-t from-white/75 to-white border border-white/60 transition-all duration-500 shadow-[0_0_28px_-6px_rgba(255,255,255,0.35)]'
              />
            </div>
          </div>

          <div className='grid grid-cols-4 text-center text-xs font-medium text-zinc-400'>
            <span>Processing</span>
            <span>Delivered</span>
            <span>Cancelled</span>
            <span className='text-white font-semibold'>Total</span>
          </div>
        </div>

        {/* Right: Minimal Donut & Progress Breakdown */}
        <div className='lg:col-span-5 glass-card rounded-2xl p-6 flex flex-col justify-between space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-sm font-semibold text-white'>Status Distribution</h4>
              <p className='text-xs text-zinc-500 mt-0.5'>Share of total orders</p>
            </div>
            <span className='text-xs text-zinc-400 font-medium tabular-nums'>{totalOrdersCount} orders</span>
          </div>

          <div className='flex items-center justify-center gap-7 py-2'>
            <div
              className='relative w-28 h-28 rounded-full flex items-center justify-center shrink-0'
              style={{ background: donutGradient }}
            >
              <div className='w-[84px] h-[84px] rounded-full bg-black border border-white/10 flex flex-col items-center justify-center'>
                <span className='text-lg font-bold text-white tabular-nums'>{deliveredPct}%</span>
                <span className='text-[10px] text-zinc-500'>Delivered</span>
              </div>
            </div>

            <div className='space-y-2.5 text-xs'>
              <div className='flex items-center gap-2.5'>
                <span className='w-2 h-2 rounded-full bg-emerald-400' />
                <span className='text-zinc-400 w-20'>Delivered</span>
                <span className='font-semibold text-white tabular-nums'>{deliveredPct}%</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <span className='w-2 h-2 rounded-full bg-violet-500' />
                <span className='text-zinc-400 w-20'>Processing</span>
                <span className='font-semibold text-white tabular-nums'>{pendingPct}%</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <span className='w-2 h-2 rounded-full bg-zinc-500' />
                <span className='text-zinc-400 w-20'>Cancelled</span>
                <span className='font-semibold text-white tabular-nums'>{cancelledPct}%</span>
              </div>
            </div>
          </div>

          <div className='space-y-3.5 text-xs'>
            <div>
              <div className='flex justify-between mb-1.5'>
                <span className='text-zinc-400'>Delivered</span>
                <span className='text-zinc-200 font-medium tabular-nums'>{deliveredCount}</span>
              </div>
              <div className='w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden'>
                <div className='bg-emerald-400 h-full rounded-full transition-all duration-500' style={{ width: `${deliveredPct}%` }} />
              </div>
            </div>

            <div>
              <div className='flex justify-between mb-1.5'>
                <span className='text-zinc-400'>Processing</span>
                <span className='text-zinc-200 font-medium tabular-nums'>{pendingCount}</span>
              </div>
              <div className='w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden'>
                <div className='bg-violet-500 h-full rounded-full transition-all duration-500' style={{ width: `${pendingPct}%` }} />
              </div>
            </div>

            <div>
              <div className='flex justify-between mb-1.5'>
                <span className='text-zinc-400'>Cancelled</span>
                <span className='text-zinc-200 font-medium tabular-nums'>{cancelledCount}</span>
              </div>
              <div className='w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden'>
                <div className='bg-zinc-500 h-full rounded-full transition-all duration-500' style={{ width: `${cancelledPct}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Glass Table */}
      <div className='glass-card rounded-2xl p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='text-sm font-semibold text-white'>Recent Orders</h4>
            <p className='text-xs text-zinc-500 mt-0.5'>Latest customer activity</p>
          </div>
          <span className='text-xs text-zinc-500 tabular-nums'>Showing {recentOrders.length} latest</span>
        </div>

        {recentOrders.length === 0 ? (
          <p className='text-xs text-zinc-500 py-6 text-center'>No orders found yet.</p>
        ) : (
          <div className='divide-y divide-white/[0.07]'>
            {recentOrders.map((order, idx) => (
              <div key={order._id || idx} className='py-3 flex flex-wrap items-center justify-between gap-3 text-xs'>
                <div className='min-w-[160px]'>
                  <p className='font-semibold text-zinc-100'>
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className='text-zinc-500 text-[11px]'>
                    {order.items?.length || 0} item(s) • {order.paymentMethod}
                  </p>
                </div>

                <span className='text-zinc-400 tabular-nums'>
                  {new Date(order.date).toLocaleDateString()}
                </span>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                    : order.status === 'Cancelled'
                    ? 'bg-zinc-800/80 text-zinc-400 border-white/10'
                    : 'bg-violet-500/15 text-violet-300 border-violet-400/25'
                }`}>
                  {order.status}
                </span>

                <span className='font-bold text-white text-sm tabular-nums'>
                  {currency}{order.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard
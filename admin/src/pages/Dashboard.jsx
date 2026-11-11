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
    // If order is not cancelled, count its amount towards revenue
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

  return (
    <div className='p-4 sm:p-8 text-white w-full space-y-8 max-w-7xl mx-auto'>
      
      {/* Top Header */}
      <div className='flex items-center justify-between border-b border-neutral-800 pb-4'>
        <div>
          <h1 className='text-xl sm:text-2xl font-extrabold tracking-wide uppercase text-white'>
            X-SHOP <span className='text-[#ffc200]'>ADMIN DASHBOARD</span>
          </h1>
          <p className='text-xs text-gray-400 mt-1'>Live monitoring connected directly to MongoDB Atlas database</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className='bg-[#141414] border border-neutral-700 hover:border-[#ffc200] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-white shadow'
        >
          🔄 Refresh Live Stats
        </button>
      </div>

      {/* Real Stats Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        
        {/* Revenue */}
        <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden'>
          <div className='absolute -right-3 -bottom-3 text-6xl opacity-5'>💰</div>
          <p className='text-xs font-bold tracking-wider text-gray-400 uppercase'>Total Store Revenue</p>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-[#ffc200]'>
            {currency}{totalRevenue.toLocaleString('en-IN')}
          </h3>
          <p className='text-[11px] text-emerald-400 font-semibold'>Real-time aggregated sales</p>
        </div>

        {/* Total Orders */}
        <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden'>
          <div className='absolute -right-3 -bottom-3 text-6xl opacity-5'>📦</div>
          <p className='text-xs font-bold tracking-wider text-gray-400 uppercase'>Total Orders Placed</p>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-white'>
            {totalOrdersCount}
          </h3>
          <p className='text-[11px] text-[#ffc200] font-semibold'>Active customer orders</p>
        </div>

        {/* Delivered Orders */}
        <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden'>
          <div className='absolute -right-3 -bottom-3 text-6xl opacity-5'>🚚</div>
          <p className='text-xs font-bold tracking-wider text-gray-400 uppercase'>Successfully Delivered</p>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-emerald-400'>
            {deliveredCount}
          </h3>
          <p className='text-[11px] text-gray-400 font-semibold'>Completed deliveries</p>
        </div>

        {/* Total Products */}
        <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-2 relative overflow-hidden'>
          <div className='absolute -right-3 -bottom-3 text-6xl opacity-5'>🏷️</div>
          <p className='text-xs font-bold tracking-wider text-gray-400 uppercase'>Inventory Products</p>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-white'>
            {totalProductsCount}
          </h3>
          <p className='text-[11px] text-[#ffc200] font-semibold'>Active catalog items</p>
        </div>

      </div>

      {/* Analytics & Breakdown Section */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        
        {/* Left: Store Performance Bars */}
        <div className='lg:col-span-7 bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm sm:text-base font-bold text-white uppercase tracking-wider'>
              Store Order Performance
            </h4>
            <span className='bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase'>
              Live DB Stats
            </span>
          </div>

          <div className='h-52 flex items-end gap-4 pt-6 border-b border-neutral-800 px-2'>
            <div className='w-full bg-neutral-900 hover:bg-[#ffc200] h-[40%] rounded-t-xl transition flex flex-col items-center justify-start pt-2 text-[10px] font-bold text-gray-400 hover:text-black group'>
              <span>{pendingCount}</span>
            </div>
            <div className='w-full bg-neutral-900 hover:bg-[#ffc200] h-[70%] rounded-t-xl transition flex flex-col items-center justify-start pt-2 text-[10px] font-bold text-gray-400 hover:text-black'>
              <span>{deliveredCount}</span>
            </div>
            <div className='w-full bg-neutral-900 hover:bg-[#ffc200] h-[30%] rounded-t-xl transition flex flex-col items-center justify-start pt-2 text-[10px] font-bold text-gray-400 hover:text-black'>
              <span>{cancelledCount}</span>
            </div>
            <div className='w-full bg-[#ffc200] h-[90%] rounded-t-xl transition flex flex-col items-center justify-start pt-2 text-[10px] font-extrabold text-black shadow-[0_0_15px_rgba(255,194,0,0.3)]'>
              <span>{totalOrdersCount}</span>
            </div>
          </div>
          
          <div className='flex justify-around text-xs font-bold text-gray-400'>
            <span>Processing</span>
            <span>Delivered</span>
            <span>Cancelled</span>
            <span className='text-[#ffc200]'>Total Orders</span>
          </div>
        </div>

        {/* Right: Order Status Distribution Bars */}
        <div className='lg:col-span-5 bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl'>
          <h4 className='text-sm sm:text-base font-bold text-white uppercase tracking-wider'>
            Order Status Distribution
          </h4>

          <div className='space-y-4 text-xs font-semibold'>
            <div>
              <div className='flex justify-between mb-1.5 text-gray-300'>
                <span>Delivered Successfully</span>
                <span className='text-emerald-400 font-bold'>{deliveredCount} Orders</span>
              </div>
              <div className='w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800'>
                <div
                  className='bg-emerald-500 h-full transition-all duration-500'
                  style={{ width: `${totalOrdersCount ? (deliveredCount / totalOrdersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className='flex justify-between mb-1.5 text-gray-300'>
                <span>Pending / Processing</span>
                <span className='text-[#ffc200] font-bold'>{pendingCount} Orders</span>
              </div>
              <div className='w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800'>
                <div
                  className='bg-[#ffc200] h-full transition-all duration-500'
                  style={{ width: `${totalOrdersCount ? (pendingCount / totalOrdersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className='flex justify-between mb-1.5 text-gray-300'>
                <span>Cancelled Orders</span>
                <span className='text-red-400 font-bold'>{cancelledCount} Orders</span>
              </div>
              <div className='w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800'>
                <div
                  className='bg-red-500 h-full transition-all duration-500'
                  style={{ width: `${totalOrdersCount ? (cancelledCount / totalOrdersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className='bg-black/60 border border-neutral-800 rounded-2xl p-4 text-center text-xs text-gray-400'>
            🔒 Verified X-Shop Secure Admin Node
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
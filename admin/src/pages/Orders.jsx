import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        // Filter out ghost 0-item ₹10 shipping-only records
        const validOrders = response.data.orders.filter(
          (o) => Array.isArray(o.items) && o.items.length > 0
        );
        setOrders(validOrders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Order status updated successfully!")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className='text-zinc-100 w-full space-y-5'>
      <div>
        <h3 className='text-2xl font-bold tracking-tight text-white'>Orders</h3>
        <p className='text-xs sm:text-sm text-zinc-400 mt-1'>Track and update live customer fulfillment</p>
      </div>

      {/* Filter Tabs */}
      <div className='flex flex-wrap gap-2'>
        {['All', 'Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === st
                ? 'btn-primary'
                : 'glass-pill text-zinc-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className='space-y-3'>
        {filteredOrders.map((order, index) => {
          const itemsSubtotal = order.items.reduce(
            (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
            0
          );
          const shippingFee = Math.max(0, Number(order.amount || 0) - itemsSubtotal);

          return (
            <div key={order._id || index} className='glass-card glass-card-hover rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center'>
              
              <div className='sm:col-span-1 flex justify-center'>
                <img className='w-12 h-14 object-cover rounded-xl border border-white/10' src={order.items[0]?.image?.[0] || assets.parcel_icon} alt="" />
              </div>

              <div className='sm:col-span-6 space-y-1 text-xs sm:text-sm'>
                <p className='font-semibold text-white'>
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} × {item.quantity} ({item.size}){idx !== order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                
                <div className='pt-1 text-zinc-300 text-xs'>
                  <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
                  <p className='text-zinc-500'>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}</p>
                  <p className='text-zinc-500'>{order.address.phone}</p>
                </div>
              </div>

              <div className='sm:col-span-2 text-xs text-zinc-400 space-y-1'>
                <p>Items: <span className='text-zinc-200 font-medium'>{order.items.length}</span></p>
                <p>Method: <span className='text-zinc-200 font-medium'>{order.paymentMethod}</span></p>
                <p>
                  Payment:{' '}
                  <span className={order.payment ? 'text-emerald-400 font-semibold' : 'text-violet-400 font-semibold'}>
                    {order.payment ? 'Paid' : 'Pending'}
                  </span>
                </p>
                <p className='text-zinc-500 tabular-nums'>{new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className='sm:col-span-3 flex flex-col sm:items-end justify-between gap-2.5'>
                <div className='sm:text-right'>
                  <p className='text-lg font-bold text-white tabular-nums'>
                    {currency}{order.amount}
                  </p>
                  {shippingFee > 0 && (
                    <p className='text-[10px] text-zinc-500 tabular-nums'>
                      Incl. {currency}{shippingFee} shipping
                    </p>
                  )}
                </div>
                
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className='glass-input text-xs font-medium rounded-xl px-3 py-2 cursor-pointer'
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Orders
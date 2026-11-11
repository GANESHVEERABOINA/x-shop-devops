import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
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
    : orders.filter(o => {
        if (filterStatus === 'Order Placed') return o.status === 'Order Placed';
        if (filterStatus === 'Packing') return o.status === 'Packing';
        if (filterStatus === 'Shipped') return o.status === 'Shipped';
        if (filterStatus === 'Out for delivery') return o.status === 'Out for delivery';
        if (filterStatus === 'Delivered') return o.status === 'Delivered';
        return true;
      });

  return (
    <div className='p-4 sm:p-6 text-white w-full'>
      <h3 className='text-xl font-extrabold mb-5'>Manage Orders</h3>

      {/* Filter Tabs */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {['All', 'Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
              filterStatus === st
                ? 'bg-[#ffc200] border-[#ffc200] text-black shadow'
                : 'bg-[#141414] border-neutral-800 text-gray-300 hover:border-[#ffc200]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className='space-y-4'>
        {filteredOrders.map((order, index) => (
          <div key={index} className='bg-[#141414] border border-neutral-800 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center shadow-lg'>
            
            <div className='sm:col-span-1 flex justify-center'>
              <img className='w-12 h-14 object-cover rounded-lg border border-neutral-700' src={order.items[0]?.image[0] || assets.parcel_icon} alt="" />
            </div>

            <div className='sm:col-span-6 space-y-1 text-xs sm:text-sm'>
              <p className='font-bold text-white'>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity} ({item.size}){idx !== order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              
              <div className='pt-1 text-gray-300 font-semibold'>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p className='text-gray-400 text-xs'>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}</p>
                <p className='text-gray-400 text-xs'>Phone: {order.address.phone}</p>
              </div>
            </div>

            <div className='sm:col-span-2 text-xs text-gray-300 space-y-1'>
              <p>Items: {order.items.length}</p>
              <p>Method: <strong className='text-white'>{order.paymentMethod}</strong></p>
              <p>Payment: <span className={order.payment ? 'text-emerald-400 font-bold' : 'text-[#ffc200] font-bold'}>{order.payment ? 'Done' : 'Pending'}</span></p>
              <p className='text-gray-400'>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <div className='sm:col-span-3 flex flex-col sm:items-end justify-between gap-3'>
              <p className='text-base sm:text-lg font-extrabold text-[#ffc200]'>
                {currency}{order.amount}
              </p>
              
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                className='bg-black border border-neutral-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#ffc200] text-white cursor-pointer'
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
        ))}
      </div>
    </div>
  )
}

export default Orders
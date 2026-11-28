import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const STATUS_OPTIONS = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
  'Cancelled',
];

const Orders = ({ token, onDataChanged }) => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('All')

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        const validOrders = response.data.orders.filter(
          (o) => Array.isArray(o.items) && o.items.length > 0
        );
        setOrders(validOrders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        onDataChanged?.();
        toast.success('Order status updated!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const counts = useMemo(() => {
    const map = { All: orders.length };
    STATUS_OPTIONS.forEach((st) => {
      map[st] = orders.filter((o) => o.status === st).length;
    });
    return map;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === 'packing' && !['Order Placed', 'Packing'].includes(o.status)) return false;
      if (activeTab === 'cancelled' && o.status !== 'Cancelled') return false;
      if (filterStatus !== 'All' && o.status !== filterStatus) return false;
      if (paymentFilter !== 'All' && o.paymentMethod !== paymentFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const fullName = `${o.address?.firstName || ''} ${o.address?.lastName || ''}`.toLowerCase();
        const itemNames = (o.items || []).map((i) => i.name || '').join(' ').toLowerCase();
        const idMatch = (o._id || '').toLowerCase().includes(q);
        if (!fullName.includes(q) && !itemNames.includes(q) && !idMatch) return false;
      }
      return true;
    });
  }, [orders, activeTab, filterStatus, paymentFilter, searchTerm]);

  const keptRevenue = useMemo(
    () =>
      filteredOrders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((acc, o) => acc + Number(o.amount || 0), 0),
    [filteredOrders]
  );

  const exportCsv = () => {
    const header = ['Order ID', 'Customer', 'Phone', 'City', 'Items', 'Payment', 'Amount', 'Status', 'Date'];
    const rows = filteredOrders.map((o) => [
      `XS-${o._id.slice(-6).toUpperCase()}`,
      `${o.address?.firstName || ''} ${o.address?.lastName || ''}`.trim(),
      o.address?.phone || '',
      o.address?.city || '',
      o.items.map((i) => `${i.name} x${i.quantity} (${i.size})`).join(' | '),
      o.paymentMethod || 'COD',
      o.amount || 0,
      o.status || '',
      new Date(o.date).toLocaleDateString('en-IN'),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xshop-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported as CSV');
  };

  return (
    <div className='w-full space-y-5'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Orders</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            Track, filter, and update live customer fulfillment
          </p>
        </div>

        <button
          type='button'
          onClick={exportCsv}
          className='glass-pill px-4 py-2 rounded-full text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer self-start sm:self-auto'
        >
          <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Underline Sub-Tabs */}
      <div className='flex items-center gap-6 border-b border-white/[0.08] text-xs font-semibold'>
        {[
          { key: 'all', label: 'All orders', count: orders.length },
          { key: 'packing', label: 'Packing board', count: (counts['Order Placed'] || 0) + (counts['Packing'] || 0) },
          { key: 'cancelled', label: 'Cancelled', count: counts['Cancelled'] || 0 },
        ].map((tab) => (
          <button
            type='button'
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setFilterStatus('All');
            }}
            className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === tab.key
                ? 'border-violet-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className='px-1.5 py-0.5 rounded-full bg-white/[0.07] text-[10px] tabular-nums'>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Payment Channel Filter */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
        <div className='flex-1 flex items-center gap-2.5 glass-input rounded-full px-4 py-2.5'>
          <svg className='w-4 h-4 text-zinc-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z' />
          </svg>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search order ID, customer, or product...'
            className='w-full bg-transparent outline-none text-xs placeholder:text-zinc-500'
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className='glass-input rounded-full px-4 py-2.5 text-xs font-medium cursor-pointer'
        >
          <option value='All'>All methods</option>
          <option value='COD'>COD</option>
          <option value='STRIPE'>Stripe</option>
          <option value='UPI'>UPI</option>
          <option value='Razorpay'>Razorpay</option>
        </select>
      </div>

      {/* Status Pills with Counts */}
      <div className='flex flex-wrap items-center gap-2'>
        {['All', ...STATUS_OPTIONS].map((st) => {
          const active = filterStatus === st;
          return (
            <button
              type='button'
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                active ? 'btn-violet' : 'glass-pill text-zinc-400 hover:text-white'
              }`}
            >
              <span>{st}</span>
              <span className='text-[10px] opacity-80 tabular-nums'>{counts[st] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Cirrel Frosted Orders Table */}
      <div className='cirrel-panel rounded-[28px] overflow-hidden'>
        <div className='px-6 py-4 border-b border-white/[0.08] flex items-center justify-between text-xs'>
          <p className='text-zinc-400'>
            <span className='font-bold text-white tabular-nums'>{filteredOrders.length}</span> orders •{' '}
            <span className='font-bold text-white tabular-nums'>{currency}{keptRevenue.toLocaleString('en-IN')}</span> kept
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className='py-14 text-center text-xs text-zinc-500'>No matching orders found.</div>
        ) : (
          <div className='divide-y divide-white/[0.07]'>
            {filteredOrders.map((order) => {
              const itemsSubtotal = order.items.reduce(
                (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
                0
              );
              const shippingFee = Math.max(0, Number(order.amount || 0) - itemsSubtotal);
              const initials =
                `${order.address?.firstName?.[0] || 'C'}${order.address?.lastName?.[0] || ''}`.toUpperCase();

              return (
                <div
                  key={order._id}
                  className='p-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-white/[0.025] transition'
                >
                  {/* Order ID & Avatar */}
                  <div className='lg:col-span-3 flex items-center gap-3 min-w-0'>
                    <div className='w-9 h-9 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shrink-0'>
                      {initials}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-xs font-bold text-white truncate'>
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className='text-[11px] text-zinc-500 font-mono'>
                        XS-{order._id.slice(-6).toUpperCase()} • {order.address?.city}
                      </p>
                      <p className='text-[10px] text-zinc-500 truncate'>
                        {order.address?.street}, {order.address?.zipcode} • {order.address?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className='lg:col-span-4 flex items-center gap-3 min-w-0'>
                    <img
                      src={order.items[0]?.image?.[0] || assets.parcel_icon}
                      alt=''
                      className='w-10 h-12 rounded-xl object-cover border border-white/10 shrink-0'
                    />
                    <div className='min-w-0 text-xs'>
                      <p className='font-medium text-zinc-200 line-clamp-2'>
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name} × {item.quantity} ({item.size})
                            {idx !== order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  {/* Method & Date */}
                  <div className='lg:col-span-2 text-xs text-zinc-400 space-y-0.5'>
                    <p className='font-medium text-zinc-200'>{order.paymentMethod}</p>
                    <p className={order.payment ? 'text-emerald-400 font-semibold text-[11px]' : 'text-amber-400 font-semibold text-[11px]'}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </p>
                    <p className='text-[11px] text-zinc-500 tabular-nums'>
                      {new Date(order.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  {/* Amount & Status Selector */}
                  <div className='lg:col-span-3 flex items-center lg:justify-end justify-between gap-3'>
                    <div className='lg:text-right'>
                      <p className='text-sm font-bold text-white tabular-nums'>
                        {currency}{order.amount}
                      </p>
                      {shippingFee > 0 && (
                        <p className='text-[10px] text-zinc-500 tabular-nums'>
                          Incl. {currency}{shippingFee} ship
                        </p>
                      )}
                    </div>

                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      className='glass-input text-xs font-medium rounded-full px-3.5 py-2 cursor-pointer'
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
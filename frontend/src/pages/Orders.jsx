import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');

  const loadOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const valid = (response.data.orders || []).filter(
          (o) => Array.isArray(o.items) && o.items.length > 0
        );
        setOrders(valid);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        loadOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleStatus = (val) => {
    setStatusFilter((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    return orders.filter((order) => {
      // Status filter
      if (statusFilter.length > 0) {
        const isDelivered = order.status === 'Delivered';
        const isCancelled = order.status === 'Cancelled';
        const isOnTheWay = !isDelivered && !isCancelled;

        const match =
          (statusFilter.includes('onway') && isOnTheWay) ||
          (statusFilter.includes('delivered') && isDelivered) ||
          (statusFilter.includes('cancelled') && isCancelled);
        if (!match) return false;
      }

      // Time filter
      if (timeFilter === '30d' && now - Number(order.date) > 30 * 86400000) return false;
      if (timeFilter === '2026' && new Date(Number(order.date)).getFullYear() !== 2026) return false;
      if (timeFilter === 'older' && new Date(Number(order.date)).getFullYear() >= 2026) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (order._id || '').toLowerCase().includes(q);
        const itemMatch = (order.items || []).some((it) =>
          (it.name || '').toLowerCase().includes(q)
        );
        if (!idMatch && !itemMatch) return false;
      }

      return true;
    });
  }, [orders, statusFilter, timeFilter, searchQuery]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-24 text-zinc-100 space-y-6">
      <div className="border-b border-white/[0.08] pb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          Order History
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Orders
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filters Sidebar */}
        <aside className="lg:col-span-3 glass-card rounded-3xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">Filters</h3>
            {(statusFilter.length > 0 || timeFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter([]);
                  setTimeFilter('all');
                }}
                className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-wider text-violet-400 uppercase">
              Order Status
            </p>
            {[
              { key: 'onway', label: 'On the way' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilter.includes(item.key)}
                  onChange={() => toggleStatus(item.key)}
                  className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t border-white/[0.08] pt-4">
            <p className="text-[11px] font-semibold tracking-wider text-violet-400 uppercase">
              Order Time
            </p>
            {[
              { key: 'all', label: 'All time' },
              { key: '30d', label: 'Last 30 days' },
              { key: '2026', label: '2026' },
              { key: 'older', label: 'Older' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="orderTime"
                  checked={timeFilter === item.key}
                  onChange={() => setTimeFilter(item.key)}
                  className="w-4 h-4 accent-violet-500 cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Right Orders Feed */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 glass-input rounded-2xl px-4 py-2.5">
              <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by product name or Order ID..."
                className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <button
              type="button"
              onClick={loadOrders}
              className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer shrink-0"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="glass-card rounded-3xl py-16 text-center text-xs text-zinc-500">
              Loading your orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass-card rounded-3xl py-16 px-6 text-center space-y-4">
              <p className="text-sm font-semibold text-white">No matching orders found.</p>
              <button
                type="button"
                onClick={() => {
                  navigate('/collection');
                  window.scrollTo(0, 0);
                }}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => {
                const canCancel = order.status !== 'Delivered' && order.status !== 'Cancelled';
                return (
                  <div key={order._id} className="glass-card rounded-3xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-400">
                          XS-{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-zinc-500 tabular-nums">
                          {new Date(order.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/12 text-emerald-400 border-emerald-400/25'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-500/12 text-rose-400 border-rose-400/25'
                              : 'bg-violet-500/15 text-violet-300 border-violet-400/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {order.status}
                        </span>
                        <span className="font-bold text-white text-sm tabular-nums">
                          {currency}{order.amount}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, idx) => {
                        const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
                        return (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={imgSrc}
                                alt={item.name}
                                className="w-14 h-16 rounded-xl object-cover object-top border border-white/10 shrink-0 bg-zinc-950"
                              />
                              <div className="min-w-0 space-y-1">
                                <p className="text-xs sm:text-sm font-semibold text-white truncate">
                                  {item.name}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                                  <span className="font-semibold text-zinc-200 tabular-nums">
                                    {currency}{item.price}
                                  </span>
                                  <span>• Qty {item.quantity}</span>
                                  <span>• Size {item.size}</span>
                                  <span>• {order.paymentMethod}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={loadOrders}
                        className="glass-pill px-4 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer"
                      >
                        Track Status
                      </button>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order._id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
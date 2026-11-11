import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const TRACKING_STEPS = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);

  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDeliveryBox, setOpenDeliveryBox] = useState(true);
  const [openPriceBox, setOpenPriceBox] = useState(true);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              orderId: order._id,
              status: order.status,
              statusHistory: order.statusHistory || [
                { status: order.status, date: order.date, note: 'Order confirmed.' },
              ],
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              address: order.address,
              totalOrderAmount: order.amount,
            });
          });
        });
        setOrderItems(allOrdersItem);

        if (selectedOrder) {
          const updated = allOrdersItem.find(
            (o) => o.orderId === selectedOrder.orderId && o._id === selectedOrder._id
          );
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const toggleStatusFilter = (val) => {
    setStatusFilter((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order cancelled successfully!');
        loadOrderData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const filteredOrders = orderItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter.length > 0) {
      const isOnTheWay = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery'].includes(item.status);
      matchesStatus =
        (statusFilter.includes('On the way') && isOnTheWay) ||
        (statusFilter.includes('Delivered') && item.status === 'Delivered') ||
        (statusFilter.includes('Cancelled') && item.status === 'Cancelled');
    }

    let matchesTime = true;
    if (timeFilter === '30days') {
      matchesTime = Date.now() - item.date <= 30 * 24 * 60 * 60 * 1000;
    } else if (timeFilter === '2026') {
      matchesTime = new Date(item.date).getFullYear() === 2026;
    } else if (timeFilter === 'older') {
      matchesTime = new Date(item.date).getFullYear() < 2026;
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  if (selectedOrder) {
    const imgUrl = Array.isArray(selectedOrder.image)
      ? selectedOrder.image[0]
      : selectedOrder.image;
    const isCancelled = selectedOrder.status === 'Cancelled';
    const currentStepIndex = TRACKING_STEPS.indexOf(selectedOrder.status);
    const addr = selectedOrder.address || {};

    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 text-white space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-gray-400 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="hover:text-[#ffc200]">Home</button>
            <span>&gt;</span>
            <button onClick={() => navigate('/profile')} className="hover:text-[#ffc200]">My Account</button>
            <span>&gt;</span>
            <button onClick={() => setSelectedOrder(null)} className="hover:text-[#ffc200] font-bold text-white">
              My Orders
            </button>
            <span>&gt;</span>
            <span className="text-[#ffc200] font-mono">OD{selectedOrder.orderId}</span>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="bg-neutral-900 border border-neutral-700 hover:border-[#ffc200] text-white px-3.5 py-1.5 rounded-xl font-bold cursor-pointer"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-neutral-800">
              <div className="space-y-1">
                <h1 className="text-base sm:text-xl font-bold text-white">
                  {selectedOrder.name}
                </h1>
                <p className="text-xs text-gray-400">
                  Size: <strong className="text-gray-200">{selectedOrder.size}</strong> • Qty: <strong className="text-gray-200">{selectedOrder.quantity}</strong>
                </p>
                <p className="text-xs text-gray-500">Seller: X-SHOP Official Retail</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#ffc200] pt-1">
                  {currency}{selectedOrder.price * selectedOrder.quantity}
                </p>
              </div>

              <img
                src={imgUrl}
                alt={selectedOrder.name}
                onClick={() => navigate(`/product/${selectedOrder._id}`)}
                className="w-20 h-24 object-cover rounded-2xl border border-neutral-700 cursor-pointer shrink-0"
              />
            </div>

            <div className="p-5 sm:p-6 space-y-5 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#ffc200]">
                  LIVE ORDER TRACKING STATUS
                </h3>
                <button
                  onClick={loadOrderData}
                  className="text-xs font-bold text-[#ffc200] hover:underline cursor-pointer"
                >
                  ↻ Refresh Live Status
                </button>
              </div>

              {isCancelled ? (
                <div className="space-y-4 pl-2">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">✓</span>
                    <div>
                      <p className="text-sm font-bold text-white">Order Confirmed, {formatDate(selectedOrder.date)}</p>
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-red-500 ml-2.5"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">✕</span>
                    <div>
                      <p className="text-sm font-bold text-red-400">Cancelled, {formatDate(selectedOrder.statusHistory?.slice(-1)[0]?.date || Date.now())}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Order was cancelled as per your request.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-0 pl-2">
                  {TRACKING_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const historyItem = selectedOrder.statusHistory?.find((h) => h.status === step);

                    return (
                      <div key={step}>
                        <div className="flex items-start gap-3.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 mt-0.5 ${isCompleted ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-neutral-800 border border-neutral-600 text-gray-500'}`}>
                            {isCompleted ? '✓' : '•'}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                              {step === 'Order Placed' ? 'Order Confirmed' : step}
                              {historyItem?.date ? `, ${formatDate(historyItem.date)}` : index === 0 ? `, ${formatDate(selectedOrder.date)}` : ''}
                            </p>
                            {historyItem?.note && <p className="text-xs text-gray-400 mt-0.5">{historyItem.note}</p>}
                          </div>
                        </div>
                        {index < TRACKING_STEPS.length - 1 && (
                          <div className={`w-0.5 h-7 ml-2.5 my-1 ${index < currentStepIndex ? 'bg-emerald-500' : 'bg-neutral-800'}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#141414] flex items-center justify-between flex-wrap gap-3 border-b border-neutral-800">
              <button onClick={() => navigate('/contact')} className="text-xs sm:text-sm font-bold text-white hover:text-[#ffc200] flex items-center gap-2 cursor-pointer">
                <span>💬 Chat with X-Shop Support</span>
              </button>
              {!isCancelled && selectedOrder.status !== 'Delivered' && (
                <button onClick={() => handleCancelOrder(selectedOrder.orderId)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition">
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-2xl">
              <div onClick={() => setOpenDeliveryBox(!openDeliveryBox)} className="flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="text-sm font-bold text-white">Delivery details</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Delivered to <strong className="text-white">{addr.firstName || 'Customer'}</strong></p>
                </div>
                <span className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-xs">{openDeliveryBox ? '▲' : '▼'}</span>
              </div>
              {openDeliveryBox && (
                <div className="pt-3 border-t border-neutral-800 text-xs text-gray-300 space-y-1">
                  <p className="font-bold text-white">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} - <strong className="text-white">{addr.zipcode}</strong></p>
                  <p className="pt-1 text-gray-400">Phone: <strong className="text-white">{addr.phone}</strong></p>
                </div>
              )}
            </div>

            <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-2xl">
              <div onClick={() => setOpenPriceBox(!openPriceBox)} className="flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="text-sm font-bold text-white">Price details</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Paid {currency}{selectedOrder.price * selectedOrder.quantity}</p>
                </div>
                <span className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-xs">{openPriceBox ? '▲' : '▼'}</span>
              </div>
              {openPriceBox && (
                <div className="pt-3 border-t border-neutral-800 text-xs space-y-2 text-gray-300">
                  <div className="flex justify-between"><span>Listing Price</span><span>{currency}{Math.round(selectedOrder.price * 2.2)}</span></div>
                  <div className="flex justify-between text-emerald-400"><span>X-Shop Discount</span><span>-{currency}{Math.round(selectedOrder.price * 1.2)}</span></div>
                  <div className="flex justify-between font-bold text-white border-t border-neutral-800 pt-2 text-sm">
                    <span>Total Amount</span><span className="text-[#ffc200]">{currency}{selectedOrder.price * selectedOrder.quantity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-6 pb-20 px-4 sm:px-6 text-white">
      <div className="mb-8">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MODERN STYLISH SIDE FILTERS PANEL (3 Cols) */}
        <div className="lg:col-span-3 bg-[#111111] border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Filters</h3>
            {(statusFilter.length > 0 || timeFilter) && (
              <button
                onClick={() => { setStatusFilter([]); setTimeFilter(''); }}
                className="text-xs text-[#ffc200] font-bold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-extrabold tracking-wider text-[#ffc200] uppercase">
              ORDER STATUS
            </p>
            {['On the way', 'Delivered', 'Cancelled'].map((st) => (
              <label key={st} className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={statusFilter.includes(st)}
                  onChange={() => toggleStatusFilter(st)}
                  className="accent-[#ffc200] w-4 h-4 rounded cursor-pointer"
                />
                <span>{st}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t border-neutral-800 pt-5">
            <p className="text-xs font-extrabold tracking-wider text-[#ffc200] uppercase">
              ORDER TIME
            </p>
            {[
              { id: '30days', label: 'Last 30 days' },
              { id: '2026', label: '2026' },
              { id: 'older', label: 'Older' },
            ].map((tm) => (
              <label key={tm.id} className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 cursor-pointer hover:text-white transition">
                <input
                  type="radio"
                  name="orderTime"
                  checked={timeFilter === tm.id}
                  onChange={() => setTimeFilter(tm.id)}
                  className="accent-[#ffc200] w-4 h-4 cursor-pointer"
                />
                <span>{tm.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT (9 Cols) */}
        <div className="lg:col-span-9 space-y-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your orders here by product name or Order ID..."
              className="flex-1 bg-[#111111] border border-neutral-700 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white outline-none focus:border-[#ffc200]"
            />
            <button
              onClick={loadOrderData}
              className="bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shrink-0 cursor-pointer shadow-lg"
            >
              Search Orders
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-12 text-center space-y-3 shadow-2xl">
              <p className="text-base font-bold text-gray-300">No matching orders found.</p>
              <button onClick={() => navigate('/collection')} className="bg-[#ffc200] text-black font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                Shop Now
              </button>
            </div>
          ) : (
            filteredOrders.map((item, index) => {
              const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
              const isCancelled = item.status === 'Cancelled';
              const isDelivered = item.status === 'Delivered';

              return (
                <div
                  key={index}
                  onClick={() => setSelectedOrder(item)}
                  className="bg-[#111111] border border-neutral-800 hover:border-[#ffc200]/70 rounded-3xl p-5 sm:p-6 transition cursor-pointer shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4 sm:w-5/12">
                    <img src={imgUrl} alt={item.name} className="w-16 h-20 object-cover rounded-2xl border border-neutral-800 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-bold text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="text-[11px] text-gray-500 font-mono">Order #OD{item.orderId.slice(-8)}</p>
                    </div>
                  </div>

                  <div className="sm:w-2/12 text-sm sm:text-base font-extrabold text-[#ffc200]">
                    {currency}{item.price * item.quantity}
                  </div>

                  <div className="sm:w-5/12 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-red-500' : isDelivered ? 'bg-emerald-500' : 'bg-[#ffc200]'}`}></span>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {isCancelled ? `Cancelled on ${formatDate(item.date)}` : isDelivered ? `Delivered on ${formatDate(item.date)}` : `${item.status} • Ordered on ${formatDate(item.date)}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {isCancelled ? 'Order was cancelled.' : isDelivered ? 'Item delivered successfully.' : 'Click to view live tracking updates →'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
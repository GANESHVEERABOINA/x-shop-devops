import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Discounts = ({ token }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [newDesc, setNewDesc] = useState('');
  const [newLimit, setNewLimit] = useState('100');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    if (!token) return;
    try {
      const res = await axios.get(backendUrl + '/api/coupon/list', { headers: { token } });
      if (res.data.success) {
        setCodes(res.data.coupons);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const toggleActive = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/coupon/toggle',
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCoupons();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    toast.success(`Copied ${code}`);
  };

  const handleAddCode = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/coupon/create',
        {
          code: newCode,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount) || 0,
          desc: newDesc,
          limit: Number(newLimit) || 100,
        },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setNewCode('');
        setDiscountValue('10');
        setMinOrderAmount('0');
        setNewDesc('');
        setNewLimit('100');
        setShowModal(false);
        fetchCoupons();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCode = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/coupon/delete',
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.info('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const activeCount = codes.filter((c) => c.active).length;
  const totalUses = codes.reduce((s, c) => s + Number(c.used || 0), 0);

  return (
    <div className='w-full space-y-5'>
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Discounts</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            Create live coupon codes that customers can apply directly at checkout
          </p>
        </div>

        <button
          type='button'
          onClick={() => setShowModal(true)}
          className='btn-violet px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer self-start sm:self-auto'
        >
          + New code
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='cirrel-panel rounded-[24px] p-5 space-y-1'>
          <p className='text-xs text-zinc-400'>Total codes</p>
          <p className='text-3xl font-bold text-white tabular-nums'>{codes.length}</p>
          <p className='text-[11px] text-zinc-500'>Stored in MongoDB</p>
        </div>
        <div className='cirrel-panel rounded-[24px] p-5 space-y-1'>
          <p className='text-xs text-zinc-400'>Active right now</p>
          <p className='text-3xl font-bold text-emerald-400 tabular-nums'>{activeCount}</p>
          <p className='text-[11px] text-zinc-500'>Live for customers</p>
        </div>
        <div className='cirrel-panel rounded-[24px] p-5 space-y-1'>
          <p className='text-xs text-zinc-400'>Total redemptions</p>
          <p className='text-3xl font-bold text-white tabular-nums'>{totalUses}</p>
          <p className='text-[11px] text-zinc-500'>Applied at checkout</p>
        </div>
      </div>

      {/* Ticket-Style Coupon Cards */}
      {loading ? (
        <div className='cirrel-panel rounded-[28px] py-14 text-center text-xs text-zinc-500'>
          Loading coupons...
        </div>
      ) : codes.length === 0 ? (
        <div className='cirrel-panel rounded-[28px] py-16 px-6 text-center space-y-3'>
          <p className='text-sm font-semibold text-white'>No coupon codes yet</p>
          <p className='text-xs text-zinc-500'>
            Create your first promo code (e.g. WELCOME15 or FLAT100) to enable customer discounts.
          </p>
          <button
            type='button'
            onClick={() => setShowModal(true)}
            className='btn-violet px-5 py-2 rounded-full text-xs font-semibold cursor-pointer'
          >
            + Create First Code
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {codes.map((item) => {
            const pct = item.limit > 0 ? Math.min(100, Math.round((item.used / item.limit) * 100)) : 0;
            const offerHeading =
              item.discountType === 'flat'
                ? `${currency}${item.discountValue} off`
                : `${item.discountValue}% off`;

            return (
              <div key={item._id} className='cirrel-panel glass-card-hover rounded-[26px] p-6 space-y-5'>
                <div className='flex items-center justify-between gap-2'>
                  <button
                    type='button'
                    onClick={() => copyCode(item.code)}
                    className='px-3 py-1 rounded-lg bg-violet-500/15 border border-violet-400/35 text-xs font-mono font-bold text-violet-400 hover:bg-violet-500/25 flex items-center gap-2 cursor-pointer'
                  >
                    <span>{item.code}</span>
                    <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </button>

                  <button
                    type='button'
                    role='switch'
                    aria-checked={item.active}
                    onClick={() => toggleActive(item._id)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      item.active ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        item.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className='text-2xl font-bold text-white'>{offerHeading}</h3>
                  <p className='text-xs text-zinc-400 mt-0.5'>{item.desc}</p>
                  {item.minOrderAmount > 0 && (
                    <p className='text-[11px] text-violet-400 font-medium mt-1 tabular-nums'>
                      Min. order {currency}{item.minOrderAmount}
                    </p>
                  )}
                </div>

                {/* Ticket Perforation Divider */}
                <div className='border-t border-dashed border-white/15 pt-4 space-y-2.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-zinc-400 tabular-nums'>
                      {item.used} of {item.limit} uses
                    </span>
                    <button
                      type='button'
                      onClick={() => deleteCode(item._id)}
                      className='text-[11px] text-zinc-500 hover:text-rose-400 cursor-pointer'
                    >
                      Delete
                    </button>
                  </div>
                  <div className='w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden'>
                    <div style={{ width: `${Math.max(4, pct)}%` }} className='h-full rounded-full bg-violet-500' />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Code Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
          <form onSubmit={handleAddCode} className='cirrel-panel bg-[#09090f]/95 rounded-[28px] p-6 max-w-md w-full space-y-4'>
            <div className='flex items-center justify-between border-b border-white/10 pb-3'>
              <h4 className='text-base font-bold text-white'>Create Coupon Code</h4>
              <button type='button' onClick={() => setShowModal(false)} className='glass-pill w-8 h-8 rounded-full text-zinc-400 cursor-pointer'>
                ✕
              </button>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-zinc-400 block'>Coupon Code</label>
              <input
                type='text'
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder='WELCOME15'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <label className='text-xs text-zinc-400 block'>Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm cursor-pointer'
                >
                  <option value='percent'>Percentage (%)</option>
                  <option value='flat'>Flat Amount ({currency})</option>
                </select>
              </div>
              <div className='space-y-1.5'>
                <label className='text-xs text-zinc-400 block'>
                  {discountType === 'percent' ? 'Discount (%)' : `Discount (${currency})`}
                </label>
                <input
                  type='number'
                  required
                  min={1}
                  max={discountType === 'percent' ? 90 : 50000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm tabular-nums'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <label className='text-xs text-zinc-400 block'>Min. Order ({currency})</label>
                <input
                  type='number'
                  min={0}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder='0'
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm tabular-nums'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-xs text-zinc-400 block'>Usage Limit</label>
                <input
                  type='number'
                  min={1}
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm tabular-nums'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-zinc-400 block'>Description</label>
              <input
                type='text'
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder='e.g. Festive special on all orders'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm'
              />
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button type='button' onClick={() => setShowModal(false)} className='glass-pill px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 cursor-pointer'>
                Cancel
              </button>
              <button type='submit' disabled={saving} className='btn-violet px-5 py-2 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50'>
                {saving ? 'Creating...' : 'Create Code'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Discounts
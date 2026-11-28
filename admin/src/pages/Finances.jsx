import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const EXPENSE_COLORS = {
  'Inventory & Stock': 'bg-indigo-500',
  'Shipping & Packaging': 'bg-emerald-400',
  Marketing: 'bg-violet-500',
  Hosting: 'bg-amber-400',
  Other: 'bg-sky-400',
};

const Finances = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pnl')

  const [showModal, setShowModal] = useState(false)
  const [expCategory, setExpCategory] = useState('Inventory & Stock')
  const [expAmount, setExpAmount] = useState('')
  const [expNote, setExpNote] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchFinancialData = async () => {
    if (!token) return;
    try {
      const [orderRes, expRes] = await Promise.all([
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
        axios.get(backendUrl + '/api/admin/expenses/list', { headers: { token } }),
      ]);

      if (orderRes.data.success) {
        setOrders(orderRes.data.orders.filter((o) => Array.isArray(o.items) && o.items.length > 0));
      }
      if (expRes.data.success) {
        setExpenses(expRes.data.expenses);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [token]);

  // 100% Real Calculations from MongoDB
  const activeOrders = useMemo(() => orders.filter((o) => o.status !== 'Cancelled'), [orders]);
  const cancelledOrders = useMemo(() => orders.filter((o) => o.status === 'Cancelled'), [orders]);

  const salesKept = useMemo(
    () => activeOrders.reduce((s, o) => s + Number(o.amount || 0), 0),
    [activeOrders]
  );

  const paidRevenue = useMemo(
    () =>
      activeOrders
        .filter((o) => Boolean(o.payment) || o.status === 'Delivered')
        .reduce((s, o) => s + Number(o.amount || 0), 0),
    [activeOrders]
  );

  const pendingCodRevenue = Math.max(0, salesKept - paidRevenue);

  const cancelledTotal = useMemo(
    () => cancelledOrders.reduce((s, o) => s + Number(o.amount || 0), 0),
    [cancelledOrders]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );

  const netProfit = salesKept - totalExpenses;
  const marginPct = salesKept > 0 ? Math.round((netProfit / salesKept) * 100) : 0;

  const groupedExpenses = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
        pct: Math.round((amount / total) * 100),
        color: EXPENSE_COLORS[name] || 'bg-violet-400',
      }));
  }, [expenses]);

  const addExpense = async (e) => {
    e.preventDefault();
    const amt = Number(expAmount);
    if (!amt || amt <= 0) return;
    setSaving(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/admin/expenses/add',
        { category: expCategory, amount: amt, note: expNote },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setExpAmount('');
        setExpNote('');
        setShowModal(false);
        fetchFinancialData();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeExpense = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/admin/expenses/delete',
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.info('Expense removed');
        fetchFinancialData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='w-full space-y-5'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Finances</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            100% live revenue & MongoDB expense ledger
          </p>
        </div>

        <button
          type='button'
          onClick={() => setShowModal(true)}
          className='btn-violet px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer self-start sm:self-auto'
        >
          + Add expense
        </button>
      </div>

      {/* Tabs */}
      <div className='flex items-center gap-6 border-b border-white/[0.08] text-xs font-semibold'>
        {[
          { key: 'pnl', label: 'Profit & loss' },
          { key: 'expenses', label: 'Expenses', count: expenses.length },
        ].map((t) => (
          <button
            type='button'
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              tab === t.key ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className='px-1.5 py-0.5 rounded-full bg-white/[0.07] text-[10px] tabular-nums'>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4 Real KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='cirrel-panel rounded-[24px] p-5 space-y-1.5'>
          <p className='text-xs text-zinc-400'>Sales kept</p>
          <p className='text-2xl sm:text-3xl font-bold text-white tabular-nums'>
            {currency}{salesKept.toLocaleString('en-IN')}
          </p>
          <p className='text-[11px] text-emerald-400'>{activeOrders.length} active orders</p>
        </div>

        <div className='cirrel-panel rounded-[24px] p-5 space-y-1.5'>
          <p className='text-xs text-zinc-400'>Collected / Paid</p>
          <p className='text-2xl sm:text-3xl font-bold text-white tabular-nums'>
            {currency}{paidRevenue.toLocaleString('en-IN')}
          </p>
          <p className='text-[11px] text-zinc-500'>
            {currency}{pendingCodRevenue.toLocaleString('en-IN')} COD pending
          </p>
        </div>

        <div className='cirrel-panel rounded-[24px] p-5 space-y-1.5'>
          <p className='text-xs text-zinc-400'>Recorded expenses</p>
          <p className='text-2xl sm:text-3xl font-bold text-white tabular-nums'>
            {currency}{totalExpenses.toLocaleString('en-IN')}
          </p>
          <p className='text-[11px] text-zinc-500'>{expenses.length} DB entries</p>
        </div>

        <div className='cirrel-panel rounded-[24px] p-5 space-y-1.5'>
          <p className='text-xs text-zinc-400'>Net balance</p>
          <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netProfit < 0 ? '-' : ''}{currency}{Math.abs(netProfit).toLocaleString('en-IN')}
          </p>
          <p className='text-[11px] text-zinc-400'>{marginPct}% net margin</p>
        </div>
      </div>

      {/* Fixed Full-Width 2-Column Layout (Zero Squishing) */}
      {tab === 'pnl' ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 items-start'>
          {/* Statement */}
          <div className='cirrel-panel rounded-[28px] p-6 space-y-4 w-full min-w-0'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Statement</h3>
              <p className='text-xs text-zinc-400 mt-0.5'>Original MongoDB revenue minus recorded expenses</p>
            </div>

            <div className='divide-y divide-white/[0.07] text-xs sm:text-sm'>
              <div className='py-3 flex items-center justify-between gap-4'>
                <span className='text-zinc-300'>Sales kept (active orders)</span>
                <span className='font-semibold text-white tabular-nums shrink-0'>
                  {currency}{salesKept.toLocaleString('en-IN')}
                </span>
              </div>

              <div className='py-3 flex items-center justify-between gap-4'>
                <span className='text-zinc-400'>Cancelled orders (excluded)</span>
                <span className='font-medium text-zinc-500 tabular-nums shrink-0'>
                  {currency}{cancelledTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {groupedExpenses.map((g) => (
                <div key={g.name} className='py-3 flex items-center justify-between gap-4'>
                  <span className='text-zinc-400'>{g.name}</span>
                  <span className='font-medium text-rose-400 tabular-nums shrink-0'>
                    -{currency}{g.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}

              <div className='pt-4 flex items-center justify-between gap-4 text-base font-bold'>
                <span className='text-white'>Net balance</span>
                <span className={`tabular-nums shrink-0 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netProfit < 0 ? '-' : ''}{currency}{Math.abs(netProfit).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Where It Went */}
          <div className='cirrel-panel rounded-[28px] p-6 space-y-4 w-full min-w-0'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Expense breakdown</h3>
              <p className='text-xs text-zinc-400 mt-0.5 tabular-nums'>
                {currency}{totalExpenses.toLocaleString('en-IN')} total recorded
              </p>
            </div>

            {groupedExpenses.length === 0 ? (
              <div className='py-10 text-center space-y-3'>
                <p className='text-xs text-zinc-400'>No expenses logged yet (₹0).</p>
                <button
                  type='button'
                  onClick={() => setShowModal(true)}
                  className='glass-pill px-4 py-2 rounded-full text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer'
                >
                  + Log first expense
                </button>
              </div>
            ) : (
              <>
                <div className='w-full h-3.5 rounded-full bg-white/[0.06] overflow-hidden flex gap-1 p-0.5'>
                  {groupedExpenses.map((g) => (
                    <div
                      key={g.name}
                      style={{ width: `${Math.max(8, g.pct)}%` }}
                      className={`h-full rounded-full ${g.color}`}
                    />
                  ))}
                </div>

                <div className='space-y-3 pt-1 text-xs'>
                  {groupedExpenses.map((g) => (
                    <div key={g.name} className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-2 min-w-0'>
                        <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${g.color}`} />
                        <span className='text-zinc-200 font-medium truncate'>{g.name}</span>
                      </div>
                      <div className='flex items-center gap-3 tabular-nums shrink-0'>
                        <span className='text-zinc-500'>{g.pct}%</span>
                        <span className='font-bold text-white'>{currency}{g.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className='cirrel-panel rounded-[28px] p-6 space-y-3'>
          {loading ? (
            <p className='text-xs text-zinc-500 py-8 text-center'>Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className='text-xs text-zinc-500 py-8 text-center'>
              No expenses recorded yet. Click "+ Add expense" to log a real business cost.
            </p>
          ) : (
            <div className='divide-y divide-white/[0.07]'>
              {expenses.map((exp) => (
                <div key={exp._id} className='py-3.5 flex items-center justify-between gap-3 text-xs'>
                  <div>
                    <p className='font-semibold text-white'>{exp.note}</p>
                    <p className='text-zinc-500 text-[11px]'>
                      {exp.category} • {new Date(exp.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='font-bold text-rose-400 text-sm tabular-nums'>
                      -{currency}{Number(exp.amount).toLocaleString('en-IN')}
                    </span>
                    <button
                      type='button'
                      onClick={() => removeExpense(exp._id)}
                      className='glass-pill px-2.5 py-1 rounded-full text-[11px] text-zinc-400 hover:text-rose-400 cursor-pointer'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
          <form onSubmit={addExpense} className='cirrel-panel bg-[#09090f]/95 rounded-[28px] p-6 max-w-md w-full space-y-4'>
            <div className='flex items-center justify-between border-b border-white/10 pb-3'>
              <h4 className='text-base font-bold text-white'>Add Expense</h4>
              <button type='button' onClick={() => setShowModal(false)} className='glass-pill w-8 h-8 rounded-full text-zinc-400 cursor-pointer'>
                ✕
              </button>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-zinc-400 block'>Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm'
              >
                {Object.keys(EXPENSE_COLORS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-zinc-400 block'>Amount ({currency})</label>
              <input
                type='number'
                required
                min={1}
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder='500'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm tabular-nums'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs text-zinc-400 block'>Note</label>
              <input
                type='text'
                value={expNote}
                onChange={(e) => setExpNote(e.target.value)}
                placeholder='e.g. Packaging boxes'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm'
              />
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button type='button' onClick={() => setShowModal(false)} className='glass-pill px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 cursor-pointer'>
                Cancel
              </button>
              <button type='submit' disabled={saving} className='btn-violet px-5 py-2 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50'>
                {saving ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Finances
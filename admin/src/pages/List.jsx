import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSizes, setEditSizes] = useState([]);
  const [customSize, setCustomSize] = useState('');
  const [editSoldOut, setEditSoldOut] = useState(false);
  const [editBestseller, setEditBestseller] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success("Product removed successfully!");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name || '');
    setEditPrice(String(item.price || ''));
    setEditSizes(Array.isArray(item.sizes) ? [...item.sizes] : []);
    setCustomSize('');
    setEditSoldOut(Boolean(item.soldOut));
    setEditBestseller(Boolean(item.bestseller));
  }

  const toggleSize = (sz) => {
    setEditSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  }

  const addCustomSize = () => {
    const cleaned = customSize.trim().toUpperCase();
    if (!cleaned) return;
    if (!editSizes.includes(cleaned)) {
      setEditSizes((prev) => [...prev, cleaned]);
    }
    setCustomSize('');
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        {
          id: editingItem._id,
          name: editName,
          price: Number(editPrice),
          sizes: editSizes,
          soldOut: editSoldOut,
          bestseller: editBestseller,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Product updated!");
        setEditingItem(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  const quickToggleSoldOut = async (item) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        { id: item._id, soldOut: !item.soldOut },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(!item.soldOut ? 'Marked as Sold Out' : 'Restocked (In Stock)');
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  const allDisplayedSizes = Array.from(new Set([...PRESET_SIZES, ...editSizes]));

  return (
    <div className='text-zinc-100 w-full space-y-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-2xl font-bold tracking-tight text-white'>Inventory</h3>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            Edit prices, update sizes, or toggle stock status live
          </p>
        </div>
        <span className='glass-pill px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 tabular-nums'>
          {list.length} items
        </span>
      </div>

      {/* Desktop Header */}
      <div className='hidden md:grid grid-cols-[0.8fr_2.6fr_1.1fr_0.9fr_1fr_1.5fr] items-center py-3 px-5 glass-pill rounded-xl text-[11px] font-semibold text-zinc-400 uppercase tracking-wider'>
        <span>Product</span>
        <span>Name & Sizes</span>
        <span>Category</span>
        <span>Price</span>
        <span>Status</span>
        <span className='text-right'>Actions</span>
      </div>

      {/* Rows */}
      <div className='space-y-2.5'>
        {list.map((item, index) => {
          const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
          const isSoldOut = Boolean(item.soldOut);

          return (
            <div
              key={item._id || index}
              className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.8fr_2.6fr_1.1fr_0.9fr_1fr_1.5fr] items-center gap-4 py-3.5 px-5 glass-card glass-card-hover rounded-2xl'
            >
              <img
                className={`w-12 h-14 object-cover rounded-xl border border-white/10 ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
                src={imgUrl}
                alt={item.name}
              />

              <div className='space-y-1 col-span-1 sm:col-span-2 md:col-span-1 min-w-0'>
                <p className='font-semibold text-white text-sm truncate'>{item.name}</p>
                <div className='flex flex-wrap items-center gap-1'>
                  {Array.isArray(item.sizes) && item.sizes.length > 0 ? (
                    item.sizes.map((sz) => (
                      <span
                        key={sz}
                        className='px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] font-medium text-zinc-300'
                      >
                        {sz}
                      </span>
                    ))
                  ) : (
                    <span className='text-[10px] text-zinc-500'>No sizes</span>
                  )}
                </div>
              </div>

              <span className='w-fit px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.05] border border-white/10 text-zinc-300'>
                {item.category}
              </span>

              <p className='text-sm font-bold text-white tabular-nums'>{currency}{item.price}</p>

              {/* Quick Sold Out Toggle */}
              <div>
                <button
                  onClick={() => quickToggleSoldOut(item)}
                  title='Click to toggle stock status'
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                    isSoldOut
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/20'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : 'In Stock'}
                </button>
              </div>

              <div className='flex items-center justify-end gap-2 col-span-2 sm:col-span-1'>
                <button
                  onClick={() => openEditModal(item)}
                  className='glass-pill hover:border-violet-400/50 text-zinc-200 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer'
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className='bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-medium px-3 py-1.5 rounded-xl transition cursor-pointer'
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frosted Glass Edit Product Modal */}
      {editingItem && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
          <form
            onSubmit={handleSaveEdit}
            className='bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
          >
            <div className='flex items-center justify-between border-b border-white/10 pb-4'>
              <div>
                <h4 className='text-base font-bold text-white'>Edit Product</h4>
                <p className='text-xs text-zinc-400 mt-0.5'>Update price, sizes, or stock status</p>
              </div>
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='glass-pill w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer'
              >
                ✕
              </button>
            </div>

            <div className='space-y-4'>
              {/* Name */}
              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-zinc-400 block'>Product Name</label>
                <input
                  type='text'
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm'
                />
              </div>

              {/* Price */}
              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-zinc-400 block'>Price ({currency})</label>
                <input
                  type='number'
                  required
                  min={1}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm tabular-nums'
                />
              </div>

              {/* Sizes Add / Remove */}
              <div className='space-y-2'>
                <label className='text-xs font-medium text-zinc-400 block'>
                  Available Sizes (Click to add or remove)
                </label>
                <div className='flex flex-wrap gap-2'>
                  {allDisplayedSizes.map((sz) => {
                    const selected = editSizes.includes(sz);
                    return (
                      <button
                        type='button'
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          selected
                            ? 'btn-primary'
                            : 'glass-pill text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Add custom size (e.g. 28, 30, 32, Free Size) */}
                <div className='flex gap-2 pt-1'>
                  <input
                    type='text'
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder='Add custom size (e.g. 32, 3XL)'
                    className='flex-1 glass-input rounded-xl px-3 py-2 text-xs placeholder:text-zinc-600'
                  />
                  <button
                    type='button'
                    onClick={addCustomSize}
                    className='glass-pill px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer'
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                <button
                  type='button'
                  onClick={() => setEditSoldOut((prev) => !prev)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    editSoldOut
                      ? 'bg-rose-500/15 border-rose-400/40 text-rose-200'
                      : 'bg-white/[0.03] border-white/10 text-zinc-300'
                  }`}
                >
                  <p className='text-xs font-semibold'>{editSoldOut ? 'Marked Sold Out' : 'In Stock'}</p>
                  <p className='text-[10px] text-zinc-400 mt-0.5'>Click to toggle stock</p>
                </button>

                <button
                  type='button'
                  onClick={() => setEditBestseller((prev) => !prev)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    editBestseller
                      ? 'bg-violet-500/15 border-violet-400/40 text-violet-200'
                      : 'bg-white/[0.03] border-white/10 text-zinc-300'
                  }`}
                >
                  <p className='text-xs font-semibold'>{editBestseller ? 'Bestseller On' : 'Standard Item'}</p>
                  <p className='text-[10px] text-zinc-400 mt-0.5'>Show in Best Sellers</p>
                </button>
              </div>
            </div>

            <div className='flex items-center justify-end gap-2.5 pt-3 border-t border-white/10'>
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='glass-pill px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50'
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default List
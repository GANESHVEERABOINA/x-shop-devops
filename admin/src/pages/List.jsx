import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORY_PILLS = ['All', 'Men', 'Women', 'Kids', 'Topwear', 'Bottomwear', 'Winterwear'];

const List = ({ token, onDataChanged }) => {
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState('catalog');
  const [catFilter, setCatFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSizes, setEditSizes] = useState([]);
  const [customSize, setCustomSize] = useState('');
  const [editSoldOut, setEditSoldOut] = useState(false);
  const [editBestseller, setEditBestseller] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success('Product removed!');
        await fetchList();
        onDataChanged?.();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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
        toast.success('Product updated!');
        setEditingItem(null);
        await fetchList();
        onDataChanged?.();
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
        onDataChanged?.();
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

  const soldOutCount = list.filter((p) => Boolean(p.soldOut)).length;
  const bestsellerCount = list.filter((p) => Boolean(p.bestseller)).length;

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      if (activeTab === 'soldout' && !item.soldOut) return false;
      if (activeTab === 'bestsellers' && !item.bestseller) return false;
      if (catFilter !== 'All' && item.category !== catFilter && item.subCategory !== catFilter) return false;
      if (searchTerm.trim() && !(item.name || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [list, activeTab, catFilter, searchTerm]);

  const allDisplayedSizes = Array.from(new Set([...PRESET_SIZES, ...editSizes]));

  return (
    <div className='w-full space-y-5'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Products</h2>
          <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
            {list.length} products in catalog • Edit prices, sizes, and live stock
          </p>
        </div>

        <button
          type='button'
          onClick={() => navigate('/add')}
          className='btn-violet px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer self-start sm:self-auto'
        >
          + Add product
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className='flex items-center gap-6 border-b border-white/[0.08] text-xs font-semibold'>
        {[
          { key: 'catalog', label: 'Catalog', count: list.length },
          { key: 'soldout', label: 'Sold out', count: soldOutCount },
          { key: 'bestsellers', label: 'Bestsellers', count: bestsellerCount },
        ].map((tab) => (
          <button
            type='button'
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {/* Search + Grid/List Toggle */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
        <div className='flex-1 max-w-md flex items-center gap-2.5 glass-input rounded-full px-4 py-2.5'>
          <svg className='w-4 h-4 text-zinc-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z' />
          </svg>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search products...'
            className='w-full bg-transparent outline-none text-xs placeholder:text-zinc-500'
          />
        </div>

        <div className='flex items-center gap-1 p-1 rounded-full glass-pill self-end sm:self-auto'>
          <button
            type='button'
            onClick={() => setViewMode('grid')}
            title='Grid view'
            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
              viewMode === 'grid' ? 'btn-violet' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' />
            </svg>
          </button>
          <button
            type='button'
            onClick={() => setViewMode('list')}
            title='List view'
            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
              viewMode === 'list' ? 'btn-violet' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className='flex flex-wrap items-center gap-2'>
        {CATEGORY_PILLS.map((cat) => (
          <button
            type='button'
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              catFilter === cat ? 'btn-violet' : 'glass-pill text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid or List */}
      {filteredList.length === 0 ? (
        <div className='cirrel-panel rounded-[28px] py-16 text-center text-xs text-zinc-500'>
          No matching products found.
        </div>
      ) : viewMode === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {filteredList.map((item) => {
            const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
            const isSoldOut = Boolean(item.soldOut);

            return (
              <div
                key={item._id}
                className='cirrel-panel glass-card-hover rounded-[24px] overflow-hidden flex flex-col justify-between'
              >
                <div className='relative aspect-[4/3] bg-zinc-950 overflow-hidden'>
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover object-top ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
                  />
                  <button
                    type='button'
                    onClick={() => quickToggleSoldOut(item)}
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border cursor-pointer flex items-center gap-1.5 ${
                      isSoldOut
                        ? 'bg-rose-950/80 text-rose-300 border-rose-400/40'
                        : 'bg-black/65 text-emerald-300 border-emerald-400/35'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSoldOut ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    <span>{isSoldOut ? 'Sold out' : 'In stock'}</span>
                  </button>

                  {item.bestseller && (
                    <span className='keep-white absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-600/90 text-white text-[10px] font-bold'>
                      Bestseller
                    </span>
                  )}
                </div>

                <div className='p-4 space-y-3 flex-1 flex flex-col justify-between'>
                  <div className='space-y-1'>
                    <p className='text-[11px] text-zinc-400'>
                      {item.category} • {item.subCategory}
                    </p>
                    <h4 className='text-sm font-bold text-white line-clamp-1'>{item.name}</h4>
                  </div>

                  <div className='flex flex-wrap gap-1'>
                    {(item.sizes || []).map((sz) => (
                      <span
                        key={sz}
                        className='px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-medium text-zinc-300'
                      >
                        {sz}
                      </span>
                    ))}
                  </div>

                  <div className='pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2'>
                    <span className='text-base font-bold text-white tabular-nums'>
                      {currency}{item.price}
                    </span>
                    <div className='flex items-center gap-1.5'>
                      <button
                        type='button'
                        onClick={() => openEditModal(item)}
                        className='glass-pill hover:border-violet-400/50 px-3 py-1 rounded-full text-[11px] font-semibold text-zinc-200 hover:text-white cursor-pointer'
                      >
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => removeProduct(item._id)}
                        className='bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer'
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='space-y-2.5'>
          {filteredList.map((item) => {
            const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
            const isSoldOut = Boolean(item.soldOut);

            return (
              <div
                key={item._id}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.8fr_2.6fr_1.1fr_0.9fr_1fr_1.5fr] items-center gap-4 py-3.5 px-5 cirrel-panel glass-card-hover rounded-2xl'
              >
                <img
                  className={`w-12 h-14 object-cover rounded-xl border border-white/10 ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
                  src={imgUrl}
                  alt={item.name}
                />

                <div className='space-y-1 min-w-0'>
                  <p className='font-semibold text-white text-sm truncate'>{item.name}</p>
                  <div className='flex flex-wrap gap-1'>
                    {(item.sizes || []).map((sz) => (
                      <span key={sz} className='px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] text-zinc-300'>
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                <span className='w-fit px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.05] border border-white/10 text-zinc-300'>
                  {item.category}
                </span>

                <p className='text-sm font-bold text-white tabular-nums'>{currency}{item.price}</p>

                <div>
                  <button
                    type='button'
                    onClick={() => quickToggleSoldOut(item)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                      isSoldOut
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    }`}
                  >
                    {isSoldOut ? 'Sold Out' : 'In Stock'}
                  </button>
                </div>

                <div className='flex items-center justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => openEditModal(item)}
                    className='glass-pill px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => removeProduct(item._id)}
                    className='bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer'
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Edit Product Modal */}
      {editingItem && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
          <form
            onSubmit={handleSaveEdit}
            className='cirrel-panel bg-[#09090f]/95 rounded-[28px] p-6 sm:p-7 max-w-lg w-full space-y-5'
          >
            <div className='flex items-center justify-between border-b border-white/10 pb-4'>
              <div>
                <h4 className='text-base font-bold text-white'>Edit Product</h4>
                <p className='text-xs text-zinc-400 mt-0.5'>Update price, sizes, or stock status</p>
              </div>
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='glass-pill w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer'
              >
                ✕
              </button>
            </div>

            <div className='space-y-4'>
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

              <div className='space-y-2'>
                <label className='text-xs font-medium text-zinc-400 block'>
                  Available Sizes (Click to add/remove)
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
                          selected ? 'btn-primary' : 'glass-pill text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                <div className='flex gap-2 pt-1'>
                  <input
                    type='text'
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder='Add custom size (e.g. 32, 3XL)'
                    className='flex-1 glass-input rounded-xl px-3 py-2 text-xs placeholder:text-zinc-500'
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

              <div className='grid grid-cols-2 gap-3 pt-1'>
                <button
                  type='button'
                  onClick={() => setEditSoldOut((prev) => !prev)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    editSoldOut
                      ? 'bg-rose-500/15 border-rose-400/40 text-rose-300'
                      : 'bg-white/[0.03] border-white/10 text-zinc-300'
                  }`}
                >
                  <p className='text-xs font-semibold'>{editSoldOut ? 'Marked Sold Out' : 'In Stock'}</p>
                  <p className='text-[10px] text-zinc-400 mt-0.5'>Click to toggle stock</p>
                </button>

                <button
                  type='button'
                  onClick={() => setEditBestseller((prev) => !prev)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    editBestseller
                      ? 'bg-violet-500/15 border-violet-400/40 text-violet-300'
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
                className='glass-pill px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-300 cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='btn-violet px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50'
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
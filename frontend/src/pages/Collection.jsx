import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import ProductSkeleton from '../components/ProductSkeleton';

const Collection = () => {
  const { products, productsLoading, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const isLoading = productsLoading || !products || products.length === 0;

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="w-full pt-8 pb-20 text-zinc-100 max-w-[1400px] mx-auto px-4 sm:px-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/[0.08] pb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
            Catalog
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              All Collections
            </h1>
            {!isLoading && (
              <span className="glass-pill px-2.5 py-0.5 rounded-full text-xs font-medium text-zinc-400 tabular-nums">
                {filterProducts.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              showFilter ? 'btn-primary' : 'glass-pill text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{showFilter ? 'Hide Filters' : 'Filters'}</span>
          </button>

          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="glass-input text-xs font-medium px-3.5 py-2.5 rounded-xl cursor-pointer"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Collapsible Glass Filter Box */}
      {showFilter && (
        <div className="glass-card rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['Men', 'Women', 'Kids'].map((cat) => {
                const active = category.includes(cat);
                return (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      active ? 'btn-primary' : 'glass-pill text-zinc-300 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={cat}
                      checked={active}
                      onChange={toggleCategory}
                      className="hidden"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Types
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => {
                const active = subCategory.includes(type);
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      active ? 'btn-primary' : 'glass-pill text-zinc-300 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={type}
                      checked={active}
                      onChange={toggleSubCategory}
                      className="hidden"
                    />
                    <span>{type}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && filterProducts.length === 0 ? (
        <div className="glass-card rounded-2xl py-16 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No matching products found</p>
          <p className="text-xs text-zinc-500">Try clearing your active filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : filterProducts.map((item, index) => (
                <ProductItem
                  key={item._id || index}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
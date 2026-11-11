import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

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
    <div className="w-full pt-6 pb-20 text-white max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Perfectly Aligned Modern Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-4 flex-wrap">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow ${
              showFilter
                ? 'bg-[#ffc200] border-[#ffc200] text-black'
                : 'bg-[#141414] border-neutral-700 text-white hover:border-[#ffc200]'
            }`}
          >
            {showFilter ? '✕ Hide Filters' : '⧨ Filter'}
          </button>

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="bg-[#141414] border border-neutral-700 text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#ffc200] cursor-pointer text-white font-medium shadow"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Price Low to High</option>
            <option value="high-low">Sort by: Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Modern Collapsible Filters Box */}
      {showFilter && (
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8 shadow-2xl animate-fade-in">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold tracking-wider text-[#ffc200] uppercase">
              CATEGORIES
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2.5 bg-black border border-neutral-700 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-[#ffc200] transition"
                >
                  <input
                    type="checkbox"
                    value={cat}
                    checked={category.includes(cat)}
                    onChange={toggleCategory}
                    className="accent-[#ffc200] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold tracking-wider text-[#ffc200] uppercase">
              TYPES
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 bg-black border border-neutral-700 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-[#ffc200] transition"
                >
                  <input
                    type="checkbox"
                    value={type}
                    checked={subCategory.includes(type)}
                    onChange={toggleSubCategory}
                    className="accent-[#ffc200] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {filterProducts.map((item, index) => (
          <ProductItem
            key={item._id || index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
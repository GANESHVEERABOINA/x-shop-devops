import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes('collection'));
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div className="border-b border-white/[0.08] bg-black/50 backdrop-blur-xl py-4 px-4">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2.5 glass-input rounded-2xl px-4 py-2.5">
          <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search products..."
            autoFocus
            className="w-full bg-transparent outline-none text-sm text-white placeholder:text-zinc-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={() => setShowSearch(false)}
          aria-label="Close search"
          className="glass-pill w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
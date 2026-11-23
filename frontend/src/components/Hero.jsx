import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const MOBILE_CATEGORIES = [
  'All',
  'Men',
  'Women',
  'Kids',
  'Topwear',
  'Bottomwear',
  'Winterwear',
];

const HERO_SLIDES = [
  {
    tag: 'NEW SEASON',
    title: 'Latest Arrivals',
    subtitle: 'Modern fits & daily essentials',
    cta: 'Shop Now',
    filterTab: 'All',
  },
  {
    tag: 'MENS EDIT',
    title: 'Urban Menswear',
    subtitle: 'Shirts, tees & tailored layers',
    cta: 'Explore Men',
    filterTab: 'Men',
  },
  {
    tag: 'WOMENS EDIT',
    title: 'Curated Womenswear',
    subtitle: 'Ethnic sets & everyday styles',
    cta: 'Explore Women',
    filterTab: 'Women',
  },
];

const Hero = ({ selectedMobileTab = 'All', onSelectMobileTab }) => {
  const { products, productsLoading, navigate, currency, search, setSearch } =
    useContext(ShopContext);
  const [localTab, setLocalTab] = useState(selectedMobileTab);
  const [slideIdx, setSlideIdx] = useState(0);

  const activeTab = onSelectMobileTab ? selectedMobileTab : localTab;
  const isLoading = productsLoading || !products || products.length === 0;
  const featured = products ? products.slice(0, 5) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tab) => {
    setLocalTab(tab);
    if (onSelectMobileTab) {
      onSelectMobileTab(tab);
    } else if (tab !== 'All') {
      navigate('/collection');
    }
  };

  const currentSlide = HERO_SLIDES[slideIdx];
  const bannerProduct =
    featured[slideIdx % Math.max(1, featured.length)] || featured[0];
  const bannerImg = bannerProduct
    ? Array.isArray(bannerProduct.image)
      ? bannerProduct.image[0]
      : bannerProduct.image
    : '';

  const miniCards = [
    {
      label: 'Men',
      sub: 'Tops & Shirts',
      tab: 'Men',
      item: products?.find((p) => p.category === 'Men') || featured[0],
    },
    {
      label: 'Women',
      sub: 'Kurta & Sets',
      tab: 'Women',
      item: products?.find((p) => p.category === 'Women') || featured[1] || featured[0],
    },
    {
      label: 'Kids',
      sub: 'Casual Wear',
      tab: 'Kids',
      item: products?.find((p) => p.category === 'Kids') || featured[2] || featured[0],
    },
  ];

  return (
    <>
      {/* MOBILE (< 768px): Search + Category Strip + Banner + 3 Mini Cards */}
      <div className="md:hidden pt-2.5 pb-1 space-y-2.5">
        {/* Search Bar */}
        <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
          <svg
            className="w-3.5 h-3.5 text-zinc-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent outline-none text-xs text-white placeholder:text-zinc-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontal Category Strip (Clean sizing so labels never clip mid-word) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {MOBILE_CATEGORIES.map((cat) => {
            const active = activeTab === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => handleTabClick(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  active
                    ? 'btn-primary'
                    : 'glass-pill text-zinc-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Main Glass Hero Banner */}
        <div className="relative glass-card rounded-2xl p-4 overflow-hidden">
          <div
            className="pointer-events-none absolute -right-10 -top-10 w-36 h-36 rounded-full opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.85) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(28px)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/35 text-[9px] font-bold tracking-wider text-violet-300 uppercase">
                {currentSlide.tag}
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                {currentSlide.title}
              </h1>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                {currentSlide.subtitle}
              </p>
              <button
                type="button"
                onClick={() => handleTabClick(currentSlide.filterTab)}
                className="btn-primary px-3.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer mt-1"
              >
                {currentSlide.cta}
              </button>
            </div>

            <div className="w-24 h-28 rounded-xl overflow-hidden border border-white/15 bg-zinc-950 shrink-0">
              {isLoading || !bannerImg ? (
                <div className="w-full h-full xshop-shimmer" />
              ) : (
                <img
                  src={bannerImg}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
          </div>

          {/* Slide Dots */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-2.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                type="button"
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setSlideIdx(idx)}
                className={`h-1 rounded-full transition-all cursor-pointer ${
                  slideIdx === idx ? 'w-5 bg-violet-400' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3-Card Mini Banner Strip (Like Reference Screenshot) */}
        <div className="grid grid-cols-3 gap-2">
          {miniCards.map((card) => {
            const imgSrc = card.item
              ? Array.isArray(card.item.image)
                ? card.item.image[0]
                : card.item.image
              : '';
            const isSelected = activeTab === card.tab;
            return (
              <button
                type="button"
                key={card.label}
                onClick={() => handleTabClick(card.tab)}
                className={`glass-card rounded-xl p-1.5 text-left transition cursor-pointer overflow-hidden ${
                  isSelected ? 'border-violet-400/60 ring-1 ring-violet-400/40' : ''
                }`}
              >
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 mb-1.5">
                  {isLoading || !imgSrc ? (
                    <div className="w-full h-full xshop-shimmer" />
                  ) : (
                    <img
                      src={imgSrc}
                      alt={card.label}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>
                <p className="text-[11px] font-bold text-white truncate px-0.5">
                  {card.label}
                </p>
                <p className="text-[9px] text-zinc-400 truncate px-0.5">
                  {card.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP & TABLET (>= 768px): Full Frosted Glass Hero */}
      <section className="hidden md:block pt-6 pb-4">
        <div className="relative glass-card rounded-3xl p-6 lg:p-12 overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-violet-300">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span>Season 2026 Collection</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Latest Arrivals.
                <span className="block text-zinc-400 font-semibold mt-1">
                  Elevated Essentials.
                </span>
              </h1>

              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Curated modern silhouettes crafted for everyday comfort. Clean cuts, quality fabrics, delivered directly to your door.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/collection');
                    window.scrollTo(0, 0);
                  }}
                  className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Shop Collection
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/collection');
                    window.scrollTo(0, 0);
                  }}
                  className="glass-pill px-5 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white cursor-pointer"
                >
                  Explore All →
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex items-stretch gap-2.5 lg:gap-3 h-[300px] lg:h-[340px]">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-2xl border border-white/[0.08] xshop-shimmer"
                      />
                    ))
                  : featured.map((item, idx) => {
                      const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
                      return (
                        <div
                          key={item._id || idx}
                          onClick={() => {
                            navigate(`/product/${item._id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="group relative flex-1 hover:flex-[2.4] transition-all duration-500 ease-out rounded-2xl overflow-hidden border border-white/10 hover:border-violet-400/50 cursor-pointer bg-zinc-950"
                        >
                          <img
                            src={imgUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs font-semibold text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-bold text-violet-300 tabular-nums">
                              {currency}{item.price}
                            </p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
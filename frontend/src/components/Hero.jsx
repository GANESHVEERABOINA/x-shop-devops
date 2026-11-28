import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const Hero = () => {
  const { navigate } = useContext(ShopContext);
  const [heroImgLoaded, setHeroImgLoaded] = useState(true);

  const scrollToCollection = () => {
    const el = document.getElementById('explore-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/collection');
    }
  };

  return (
    <section className="pt-3 md:pt-5 pb-2">
      <div className="relative w-full rounded-[24px] md:rounded-[34px] overflow-hidden border border-white/[0.12] bg-[#040308] min-h-[340px] sm:min-h-[430px] lg:min-h-[500px] flex flex-col justify-between shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)]">
        {/* Studio Ambient Backdrop (Visible when hero-banner.jpg is not placed yet) */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 55% 36%, rgba(124,58,237,0.48) 0%, rgba(79,70,229,0.22) 38%, rgba(8,6,18,0.92) 72%, rgba(0,0,0,0.98) 100%)',
          }}
        />

        {/* Subtle Luxury Brand Watermark in Backdrop */}
        {!heroImgLoaded && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center select-none overflow-hidden">
            <span className="text-[110px] sm:text-[180px] lg:text-[230px] font-extrabold tracking-[0.18em] text-white/[0.035] uppercase whitespace-nowrap">
              X·SHOP
            </span>
          </div>
        )}

        {/* FIXED CUSTOM HERO IMAGE ONLY (Place your image at: frontend/public/hero-banner.jpg) */}
        {heroImgLoaded && (
          <img
            src="/hero-banner.jpg"
            alt="X-Shop Editorial Campaign"
            onError={() => setHeroImgLoaded(false)}
            className="pointer-events-none absolute inset-0 z-[1] w-full h-full object-cover object-center"
          />
        )}

        {/* Cinematic Dark Vignette so White Typography Stays Crisp Over Any Image */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        {/* Top Editorial Strip */}
        <div className="relative z-10 flex items-start justify-between p-5 sm:p-8 lg:p-10">
          <div className="hidden sm:flex flex-col gap-1 text-[11px] font-medium text-zinc-200/90">
            <button
              type="button"
              onClick={scrollToCollection}
              className="text-left hover:text-white transition cursor-pointer"
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => navigate('/collection')}
              className="text-left hover:text-white transition cursor-pointer"
            >
              Signature Clothing
            </button>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="text-left hover:text-white transition cursor-pointer"
            >
              Editorial Lookbook
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15">
            <span className="text-xs font-extrabold tracking-[0.3em] text-white uppercase">
              X<span className="text-violet-400">·</span>SHOP
            </span>
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">Season 2026</p>
            <p className="text-[11px] text-violet-300">Flagship Drop</p>
          </div>
        </div>

        {/* Bottom Editorial Headline + Scroll Button */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.06]">
              Where Fashion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-violet-400">
                Meets Expression.
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1">
              <p className="text-xs sm:text-sm text-zinc-200/85 leading-relaxed max-w-sm">
                Explore a collection designed to blend modern trends with timeless comfort — crafted for the confident.
              </p>

              <button
                type="button"
                onClick={scrollToCollection}
                className="btn-primary w-fit px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer shrink-0"
              >
                Explore Drop
              </button>
            </div>
          </div>

          <div className="flex items-center md:flex-col md:items-end justify-between gap-3">
            <div className="md:text-right">
              <p className="text-xs font-semibold text-white">New Collection</p>
              <p className="text-[11px] text-violet-300 font-medium">2026 Edition</p>
            </div>

            <button
              type="button"
              onClick={scrollToCollection}
              aria-label="Scroll to collection"
              className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xl border border-white/25 flex items-center justify-center text-white transition hover:translate-y-0.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
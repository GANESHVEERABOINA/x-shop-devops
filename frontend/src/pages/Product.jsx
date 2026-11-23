import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    productsLoading,
    currency,
    addToCart,
    wishlist,
    toggleWishlist,
    navigate,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const found = products.find((item) => item._id === productId);
    if (found) {
      setProductData(found);
      const imgs = Array.isArray(found.image) ? found.image : [found.image];
      setImage(imgs[0] || '');
      setSize('');
    }
  }, [productId, products]);

  const isLoading = productsLoading || !productData;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <div className="md:col-span-5">
            <div className="h-[420px] rounded-2xl xshop-shimmer border border-white/[0.08]" />
          </div>
          <div className="md:col-span-7 glass-card rounded-3xl p-6 space-y-4">
            <div className="h-4 w-24 rounded-full xshop-shimmer" />
            <div className="h-7 w-4/5 rounded-xl xshop-shimmer" />
            <div className="h-6 w-24 rounded-xl xshop-shimmer" />
            <div className="h-16 w-full rounded-2xl xshop-shimmer" />
            <div className="flex gap-2.5 pt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-11 h-10 rounded-xl xshop-shimmer" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-11 rounded-xl xshop-shimmer" />
              <div className="h-11 rounded-xl xshop-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(productData.image) ? productData.image : [productData.image];
  const isWishlisted = wishlist.includes(productData._id);
  const isSoldOut = Boolean(productData.soldOut);

  const handleBuyNow = () => {
    if (isSoldOut) return;
    if (!size) {
      addToCart(productData._id, size);
      return;
    }
    addToCart(productData._id, size);
    navigate('/cart');
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-16 text-zinc-100">
      {/* Compact Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-5 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-zinc-200 transition">Home</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-zinc-200 transition">Collection</Link>
        {productData.category && (
          <>
            <span>/</span>
            <span className="text-zinc-400">{productData.category}</span>
          </>
        )}
        <span>/</span>
        <span className="text-zinc-200 truncate max-w-[260px]">{productData.name}</span>
      </nav>

      {/* Compact Balanced Product View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Compact Gallery */}
        <div className="md:col-span-5 space-y-3">
          <div className="relative glass-card rounded-2xl overflow-hidden w-full h-[380px] sm:h-[440px] bg-zinc-950">
            <img
              src={image || images[0]}
              alt={productData.name}
              className={`w-full h-full object-cover object-top ${isSoldOut ? 'opacity-55 grayscale' : ''}`}
            />

            {isSoldOut && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500/90 text-white text-[11px] font-bold tracking-wider uppercase shadow">
                Sold Out
              </span>
            )}

            <button
              onClick={() => toggleWishlist(productData._id)}
              aria-label="Toggle wishlist"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/15 hover:border-violet-400/60 flex items-center justify-center cursor-pointer transition hover:scale-105"
            >
              <svg
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'text-violet-400 fill-violet-400' : 'text-zinc-200 fill-none'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((imgItem, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(imgItem)}
                  className={`w-14 h-16 shrink-0 rounded-xl overflow-hidden border transition cursor-pointer bg-zinc-950 ${
                    image === imgItem
                      ? 'border-violet-400 ring-2 ring-violet-500/30'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgItem}
                    alt={`${productData.name} ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Compact Details Card */}
        <div className="md:col-span-7 glass-card rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {productData.category && (
                <span className="glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-violet-300">
                  {productData.category}
                </span>
              )}
              {productData.subCategory && (
                <span className="glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-medium text-zinc-400">
                  {productData.subCategory}
                </span>
              )}
              {isSoldOut && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {productData.name}
            </h1>

            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-white tabular-nums">
                {currency}{productData.price}
              </span>
              <span className="text-[11px] text-zinc-500">Inclusive of all taxes</span>
            </div>
          </div>

          {productData.description && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.08] pt-4">
              {productData.description}
            </p>
          )}

          {/* Size Selector */}
          {Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
            <div className="space-y-2.5 border-t border-white/[0.08] pt-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Select Size
                </p>
                {size && (
                  <span className="text-xs text-violet-400 font-medium">
                    Size: {size}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={isSoldOut}
                    onClick={() => setSize(item)}
                    className={`min-w-[42px] h-10 px-3 rounded-xl text-xs font-semibold transition ${
                      isSoldOut
                        ? 'glass-pill text-zinc-600 cursor-not-allowed opacity-50'
                        : size === item
                        ? 'btn-primary cursor-pointer'
                        : 'glass-pill text-zinc-300 hover:text-white cursor-pointer'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              disabled={isSoldOut}
              onClick={() => addToCart(productData._id, size)}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isSoldOut
                  ? 'bg-zinc-900 border border-white/10 text-zinc-600 cursor-not-allowed'
                  : 'glass-pill hover:border-white/25 text-white cursor-pointer'
              }`}
            >
              {isSoldOut ? 'Unavailable' : 'Add to Cart'}
            </button>
            <button
              disabled={isSoldOut}
              onClick={handleBuyNow}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isSoldOut
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'btn-primary cursor-pointer'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Buy Now'}
            </button>
          </div>

          {/* Minimal Assurances */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.08] text-center">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-2">
              <p className="text-[11px] font-semibold text-zinc-200">100% Original</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Verified quality</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-2">
              <p className="text-[11px] font-semibold text-zinc-200">COD & UPI</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Secure checkout</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-2">
              <p className="text-[11px] font-semibold text-zinc-200">7-Day Return</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Easy exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
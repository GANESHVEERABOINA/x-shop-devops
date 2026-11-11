import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate, token } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showOffers, setShowOffers] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item);
      const imgs = Array.isArray(item.image) ? item.image : [item.image];
      setActiveImage(imgs[0] || '');
      setSize(item.sizes?.[0] || '');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId, products]);

  if (!productData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400 text-sm">
        Loading product details...
      </div>
    );
  }

  const images = Array.isArray(productData.image) ? productData.image : [productData.image];
  const sellingPrice = Number(productData.price) || 999;
  const mrpPrice = Math.round(sellingPrice * 2.4);
  const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);
  const specialDealPrice = Math.max(sellingPrice - Math.round(sellingPrice * 0.08), 99);

  // STRICT LOGIN CHECK FOR ADD TO CART
  const handleAddToCart = () => {
    if (!token) {
      toast.error('Please login first to add items to cart!');
      navigate('/login');
      return;
    }
    if (!size) {
      toast.error('Please select a size!');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size);
    }
    toast.success('Added to cart!');
  };

  // STRICT LOGIN CHECK FOR BUY NOW
  const handleBuyNow = () => {
    if (!token) {
      toast.error('Please login first to proceed with purchase!');
      navigate('/login');
      return;
    }
    if (!size) {
      toast.error('Please select a size!');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size);
    }
    navigate('/place-order');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-3 pb-32 sm:pb-16 text-white">
      {/* Breadcrumbs */}
      <nav className="text-[11px] sm:text-xs text-gray-400 mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#ffc200]">Home</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-[#ffc200]">{productData.category || 'Fashion'}</Link>
        <span>/</span>
        <span className="text-gray-500">{productData.subCategory || 'Collection'}</span>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-xs">{productData.name}</span>
      </nav>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT: Product Images */}
        <div className="lg:col-span-6">
          <div className="block lg:hidden">
            <div className="relative w-full max-w-[320px] mx-auto aspect-[3/4] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <img src={activeImage} alt={productData.name} className="w-full h-full object-cover object-top" />
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow cursor-pointer"
              >
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-2.5 mt-3 overflow-x-auto py-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                      activeImage === img ? 'border-[#ffc200]' : 'border-neutral-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`hidden lg:grid gap-3 ${images.length === 1 ? 'grid-cols-1 max-w-[340px] mx-auto' : 'grid-cols-2'}`}>
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden h-[320px]">
                <img
                  src={img}
                  alt={`${productData.name} ${idx + 1}`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
                {idx === 0 && (
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow cursor-pointer"
                  >
                    {wishlisted ? '❤️' : '🤍'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Details */}
        <div className="lg:col-span-6 bg-[#111111] border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
          {productData.sizes?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-200">Select Size</span>
                <button onClick={() => setShowSizeChart(true)} className="text-xs font-semibold text-[#ffc200] hover:underline cursor-pointer">
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] h-10 px-3 rounded-lg text-xs sm:text-sm font-bold border transition cursor-pointer ${
                      size === s
                        ? 'bg-[#ffc200] text-black border-[#ffc200]'
                        : 'bg-neutral-900 text-gray-300 border-neutral-700 hover:border-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Link to="/collection" className="text-xs font-bold text-[#ffc200] hover:underline uppercase tracking-wider">
              Visit X-Shop {productData.category} Store
            </Link>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white mt-1">
              {productData.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {productData.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-neutral-900 border border-neutral-700 px-2.5 py-0.5 rounded text-xs font-semibold">
              4.2 <span className="text-emerald-400">★</span> | Verified X-Shop Ratings
            </span>
          </div>

          <div className="space-y-1">
            <span className="inline-block bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded">
              Lowest Price Live
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-emerald-400 font-bold text-lg sm:text-2xl">↓{discountPercent}%</span>
              <span className="text-gray-500 line-through text-sm sm:text-lg">{currency}{mrpPrice}</span>
              <span className="text-[#ffc200] font-extrabold text-xl sm:text-3xl">{currency}{sellingPrice}</span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-neutral-700">
            <button
              onClick={() => setShowOffers(!showOffers)}
              className="w-full flex items-center justify-between bg-neutral-900 px-3.5 py-2.5 text-xs font-bold text-[#ffc200] cursor-pointer"
            >
              <span>⚡ X-SHOP DEAL • Apply offers for maximum savings</span>
              <span>{showOffers ? '▲' : '▼'}</span>
            </button>
            {showOffers && (
              <div className="p-3.5 bg-black/60 text-xs space-y-1.5">
                <p className="font-bold text-white text-sm">
                  Get it for {currency}{specialDealPrice}
                </p>
                <p className="text-gray-400">• 5% Unlimited Cashback on X-Shop Bank & Credit Cards</p>
                <p className="text-gray-400">• Instant 8% discount on UPI Orders</p>
              </div>
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3 px-4 rounded-xl border border-neutral-600 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm cursor-pointer"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              className="py-3 px-4 rounded-xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-bold text-sm cursor-pointer"
            >
              Buy at {currency}{sellingPrice}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="sm:hidden fixed bottom-14 inset-x-0 bg-[#121212] border-t border-neutral-800 p-3 grid grid-cols-2 gap-3 z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.8)]">
        <button
          onClick={handleAddToCart}
          className="py-3 rounded-xl border border-neutral-600 bg-neutral-900 text-white font-bold text-xs cursor-pointer shadow"
        >
          Add to cart
        </button>
        <button
          onClick={handleBuyNow}
          className="py-3 rounded-xl bg-[#ffc200] text-black font-extrabold text-xs cursor-pointer shadow"
        >
          Buy at {currency}{sellingPrice}
        </button>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div
          onClick={() => setShowSizeChart(false)}
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-sm w-full p-4 space-y-3"
          >
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h4 className="text-sm font-bold text-[#ffc200]">X-Shop Size Chart (Inches)</h4>
              <button onClick={() => setShowSizeChart(false)} className="cursor-pointer">✕</button>
            </div>
            <table className="w-full text-xs text-left text-gray-300">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-400">
                  <th className="py-1">Size</th><th>Chest</th><th>Length</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-bold">S</td><td>38</td><td>27.5</td></tr>
                <tr><td className="py-1 font-bold">M</td><td>40</td><td>28.5</td></tr>
                <tr><td className="py-1 font-bold">L</td><td>42</td><td>29.5</td></tr>
                <tr><td className="py-1 font-bold">XL</td><td>44</td><td>30.5</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  );
};

export default Product;
import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('xshop-skeleton-v2')) {
  const style = document.createElement('style');
  style.id = 'xshop-skeleton-v2';
  style.innerHTML = `
    @keyframes xshopSweep {
      0% { transform: translateX(-110%); }
      100% { transform: translateX(110%); }
    }
    .xshop-bone {
      position: relative;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.045);
      border: 1px solid rgba(255, 255, 255, 0.04);
    }
    .xshop-bone::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-110%);
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(139, 92, 246, 0.14) 35%,
        rgba(255, 255, 255, 0.16) 50%,
        rgba(139, 92, 246, 0.14) 65%,
        transparent 100%
      );
      animation: xshopSweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  `;
  document.head.appendChild(style);
}

const ProductSkeleton = () => {
  return (
    <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden flex flex-col justify-between w-full min-w-0 select-none">
      {/* Image Placeholder: Compact 4:5 on Mobile, 3:4 on Desktop */}
      <div className="relative w-full aspect-[4/5] md:aspect-[3/4] xshop-bone border-b border-white/[0.06]">
        {/* Wishlist pill skeleton */}
        <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/50 border border-white/10" />
      </div>

      {/* Text & Price Skeleton: Compact on Mobile, Spacious on Desktop */}
      <div className="p-2 md:p-3.5 space-y-2 md:space-y-2.5">
        <div className="h-2.5 md:h-3.5 w-11/12 rounded-md xshop-bone" />
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="h-3 md:h-4 w-12 md:w-16 rounded-md xshop-bone" />
          <div className="h-2.5 md:h-3 w-8 md:w-10 rounded-md xshop-bone opacity-70" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
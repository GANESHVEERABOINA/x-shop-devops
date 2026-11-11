import React from 'react'

const PromoBanners = () => {

  // 100% Reliable Logo Links with Backup Fallbacks
  const brands = [
    {
      id: 1,
      name: 'Adidas',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
      fallback: 'https://logo.clearbit.com/adidas.com'
    },
    {
      id: 2,
      name: 'Nike',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
      fallback: 'https://logo.clearbit.com/nike.com'
    },
    {
      id: 3,
      name: 'Puma',
      logo: 'https://cdn.worldvectorlogo.com/logos/puma-logo.svg',
      fallback: 'https://logo.clearbit.com/puma.com'
    },
    {
      id: 4,
      name: 'Levi\'s',
      logo: 'https://cdn.worldvectorlogo.com/logos/levis.svg',
      fallback: 'https://logo.clearbit.com/levi.com'
    },
    {
      id: 5,
      name: 'Zara',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
      fallback: 'https://logo.clearbit.com/zara.com'
    },
    {
      id: 6,
      name: 'Calvin Klein',
      logo: 'https://cdn.worldvectorlogo.com/logos/calvin-klein.svg',
      fallback: 'https://logo.clearbit.com/calvinklein.com'
    }
  ];

  return (
    <div className="w-full my-8">
      
      {/* Title */}
      <div className="mb-4 px-2">
        <h2 className="text-gray-400 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">Featured Brands</h2>
      </div>

      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Scrollable Container */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 hide-scrollbar snap-x snap-mandatory px-2">
        {brands.map((brand) => (
          <div 
            key={brand.id} 
            className="relative min-w-[160px] sm:min-w-[200px] md:min-w-[220px] h-[90px] sm:h-[110px] rounded-2xl flex items-center justify-center bg-white flex-shrink-0 snap-center cursor-pointer shadow-lg group hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 border border-white/5"
          >
            {/* Logo Image with Error Handling */}
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="w-[55%] h-[55%] object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
              // Ikkada error vasthe ventane backup image load ayyela fix chesam
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = brand.fallback;
              }}
            />
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default PromoBanners
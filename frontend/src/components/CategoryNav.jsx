import React, { useState } from 'react'

const CategoryNav = () => {
  // Pure Fashion & Clothing Categories
  const categories = [
    { name: 'For You', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg> },
    
    { name: 'Shirts', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg> },
    
    { name: 'T-Shirts', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 13-10-8-10 8"/><path d="M12 5a3 3 0 1 0-3-3"/><path d="M22 13h-20l10 8z"/></svg> },
    
    { name: 'Jeans', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v2l-1.5 16h-3.5L12 12l-2 9H6.5L5 5V3z"/></svg> },
    
    { name: 'Footwear', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v4h16v-2l-3-2H4Z"/><path d="M20 16v-4a2 2 0 0 0-2-2h-3l-3-4H8l2 4H6a2 2 0 0 0-2 2v4"/></svg> },
    
    { name: 'Watches', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="5" width="12" height="14" rx="3" ry="3"/><path d="M8 2v3"/><path d="M16 2v3"/><path d="M8 19v3"/><path d="M16 19v3"/><circle cx="12" cy="12" r="2"/></svg> },
    
    { name: 'Eyewear', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/></svg> },
    
    { name: 'Bags', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    
    { name: 'Offers', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  ]

  const [activeCategory, setActiveCategory] = useState('For You');

  return (
    <div className="w-full mb-6 mt-2">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-4 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex overflow-x-auto gap-4 sm:gap-8 px-2 sm:px-6 hide-scrollbar items-start">
          {categories.map((item, index) => (
            <div key={index} onClick={() => setActiveCategory(item.name)} className="flex flex-col items-center cursor-pointer min-w-[60px] group">
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${activeCategory === item.name ? 'bg-white/20 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)] text-white scale-110' : 'bg-white/5 border border-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-200 group-hover:scale-105'}`}>
                {item.icon}
              </div>
              
              <p className={`text-[11px] mt-2 whitespace-nowrap transition-colors duration-300 tracking-wide ${activeCategory === item.name ? 'text-white font-semibold' : 'text-gray-400 font-medium group-hover:text-gray-200'}`}>
                {item.name}
              </p>
              
              <div className={`h-1 w-1 rounded-full mt-1.5 transition-all duration-300 ${activeCategory === item.name ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-100' : 'bg-transparent scale-0'}`}></div>
            
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryNav
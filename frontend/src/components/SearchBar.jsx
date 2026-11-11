import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])
    
  return showSearch && visible ? (
    <div className='text-center py-6'>
      <div className='inline-flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/20 px-6 py-2.5 mx-3 rounded-full w-3/4 sm:w-1/2 shadow-lg transition-all duration-300 focus-within:bg-white/10 focus-within:border-white/40 focus-within:shadow-[0_0_15px_rgba(255,255,255,0.05)]'>
        <input 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)} 
          className='flex-1 outline-none bg-transparent text-white placeholder-gray-500 text-sm' 
          type="text" 
          placeholder='Search for products...'
        />
        <img className='w-4 opacity-80 hover:opacity-100 transition-opacity cursor-pointer' src={assets.search_icon} alt="Search" />
      </div>
      <img 
        onClick={()=>setShowSearch(false)} 
        className='inline w-4 ml-4 cursor-pointer opacity-70 hover:opacity-100 hover:rotate-90 transition-all duration-300' 
        src={assets.cross_icon} 
        alt="Close" 
      />
    </div>
  ) : null
}

export default SearchBar
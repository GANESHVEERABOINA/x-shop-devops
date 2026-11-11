import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-3 px-4 sm:px-8 bg-[#0d0d0d] border-b border-neutral-800 text-white'>
      <div className='flex items-center gap-2'>
        <div className='bg-[#ffc200] text-black font-extrabold px-2.5 py-1 rounded text-sm tracking-wider'>
          X
        </div>
        <span className='text-base sm:text-lg font-extrabold tracking-widest text-white'>
          SHOP <span className='text-xs font-normal text-gray-400 ml-1'>ADMIN PANEL</span>
        </span>
      </div>

      <div className='flex items-center gap-3'>
        <div className='hidden sm:flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-full text-xs font-bold text-[#ffc200]'>
          <span>👑 Authorized Admin</span>
        </div>
        
        <button
          onClick={() => setToken('')}
          className='bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='w-[20%] min-h-screen bg-[#0a0a0a] border-r border-neutral-800 text-white p-4 select-none'>
      <div className='flex flex-col gap-2 pt-4 text-sm font-medium'>
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-[#1a1a1a] border border-[#ffc200]/40 text-[#ffc200] font-bold shadow-[0_0_15px_rgba(255,194,0,0.15)] scale-[1.02]'
                : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
            }`
          }
        >
          <span className='text-lg'>📊</span>
          <p className='hidden md:block tracking-wide'>Dashboard</p>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-[#1a1a1a] border border-[#ffc200]/40 text-[#ffc200] font-bold shadow-[0_0_15px_rgba(255,194,0,0.15)] scale-[1.02]'
                : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
            }`
          }
        >
          <span className='text-lg'>➕</span>
          <p className='hidden md:block tracking-wide'>Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-[#1a1a1a] border border-[#ffc200]/40 text-[#ffc200] font-bold shadow-[0_0_15px_rgba(255,194,0,0.15)] scale-[1.02]'
                : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
            }`
          }
        >
          <span className='text-lg'>📋</span>
          <p className='hidden md:block tracking-wide'>List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-[#1a1a1a] border border-[#ffc200]/40 text-[#ffc200] font-bold shadow-[0_0_15px_rgba(255,194,0,0.15)] scale-[1.02]'
                : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
            }`
          }
        >
          <span className='text-lg'>📦</span>
          <p className='hidden md:block tracking-wide'>Orders</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
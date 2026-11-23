import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const navItemClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
      isActive
        ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_24px_-8px_rgba(139,92,246,0.55)]'
        : 'text-zinc-400 font-medium border border-transparent hover:bg-white/[0.04] hover:text-zinc-100'
    }`;

  return (
    <aside className='glass-sidebar w-[68px] md:w-[230px] shrink-0 min-h-[calc(100vh-4rem)] p-3 sm:p-4 select-none flex flex-col justify-between'>
      <div className='flex flex-col gap-1.5'>
        <p className='hidden md:block text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3.5 py-2'>
          Workspace
        </p>

        <NavLink to="/" end className={navItemClass}>
          {({ isActive }) => (
            <>
              <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z' />
              </svg>
              <span className='hidden md:block'>Overview</span>
            </>
          )}
        </NavLink>

        <NavLink to="/add" className={navItemClass}>
          {({ isActive }) => (
            <>
              <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
              </svg>
              <span className='hidden md:block'>Add Product</span>
            </>
          )}
        </NavLink>

        <NavLink to="/list" className={navItemClass}>
          {({ isActive }) => (
            <>
              <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
              <span className='hidden md:block'>Inventory</span>
            </>
          )}
        </NavLink>

        <NavLink to="/orders" className={navItemClass}>
          {({ isActive }) => (
            <>
              <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
              <span className='hidden md:block'>Orders</span>
            </>
          )}
        </NavLink>

        <NavLink to="/team" className={navItemClass}>
          {({ isActive }) => (
            <>
              <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <span className='hidden md:block'>Team & Profile</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Bottom Status */}
      <div className='hidden md:block glass-card rounded-2xl p-3.5 mt-6 space-y-1.5'>
        <div className='flex items-center justify-between'>
          <span className='text-[11px] font-semibold text-zinc-200'>MongoDB Atlas</span>
          <span className='w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]' />
        </div>
        <p className='text-[11px] text-zinc-500 leading-relaxed'>
          Connected & synced in real time.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
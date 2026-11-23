import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ setToken, adminProfile }) => {
  const navigate = useNavigate();

  return (
    <header className='glass-topbar sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-7 text-white'>
      {/* Brand */}
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 rounded-lg btn-violet flex items-center justify-center font-extrabold text-sm tracking-tight'>
          X
        </div>
        <div className='flex items-center gap-2.5'>
          <span className='text-sm sm:text-base font-bold tracking-tight text-white'>
            X-Shop
          </span>
          <span className='text-zinc-600'>/</span>
          <span className='text-xs font-medium text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-md'>
            Admin
          </span>
        </div>
      </div>

      {/* Right Profile & Sign out */}
      <div className='flex items-center gap-2.5 sm:gap-3'>
        <button
          onClick={() => navigate('/team')}
          className='glass-pill hover:border-violet-400/50 pl-2 pr-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-xs cursor-pointer'
        >
          <span className='w-6 h-6 rounded-full btn-violet flex items-center justify-center text-[11px] font-bold uppercase'>
            {adminProfile?.name ? adminProfile.name[0] : 'A'}
          </span>
          <div className='hidden sm:flex flex-col items-start leading-none'>
            <span className='font-semibold text-white text-[11px]'>
              {adminProfile?.name || 'Admin'}
            </span>
            <span className='text-[10px] text-violet-300 mt-0.5'>
              {adminProfile?.role || 'Primary Admin'}
            </span>
          </div>
        </button>

        <button
          onClick={() => setToken('')}
          className='glass-pill hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer'
        >
          <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
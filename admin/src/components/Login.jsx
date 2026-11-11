import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        toast.success("X-Shop Admin Logged In Successfully!")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <div className='bg-[#111111] border border-neutral-800 shadow-2xl rounded-3xl px-8 py-8 max-w-md w-full space-y-6 text-white'>
        
        {/* X-Shop Branding & Header */}
        <div className='text-center space-y-2'>
          <div className='inline-flex items-center gap-2 mb-1'>
            <div className='bg-[#ffc200] text-black font-extrabold px-3 py-1 rounded text-lg tracking-wider'>
              X
            </div>
            <span className='text-xl font-extrabold tracking-widest text-white'>
              SHOP
            </span>
          </div>
          <h2 className='text-xl font-extrabold text-white'>X-Shop Admin Panel</h2>
          <p className='text-xs text-gray-400'>Enter your authorized credentials to access dashboard</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-4'>
          <div className='space-y-1.5'>
            <p className='text-xs font-semibold text-gray-300'>EMAIL ADDRESS</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="admin@xshop.com"
              className='w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition'
            />
          </div>

          <div className='space-y-1.5'>
            <p className='text-xs font-semibold text-gray-300'>PASSWORD</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="Enter password"
              className='w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition'
            />
          </div>

          <button
            type='submit'
            className='w-full py-3.5 px-4 rounded-xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-sm shadow-lg transition cursor-pointer mt-2'
          >
            Login
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
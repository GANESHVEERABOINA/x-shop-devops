import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Team from './pages/Team'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL !== undefined
    ? import.meta.env.VITE_BACKEND_URL
    : (window.location.hostname === 'localhost' && window.location.port === '5174'
        ? 'http://localhost:4000'
        : '');

export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : '');
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    localStorage.setItem('adminToken', token);
    if (!token) {
      setAdminProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/admin/me', { headers: { token } });
        if (res.data.success) {
          setAdminProfile(res.data.admin);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className='relative min-h-screen w-full bg-[#000000] text-zinc-100 overflow-x-hidden'>
      {/* Subtle Violet/Indigo Spotlights on Pure Black */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden z-0'>
        <div
          className='absolute -top-40 left-1/4 w-[520px] h-[360px] rounded-full opacity-25'
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className='absolute bottom-0 right-1/6 w-[460px] h-[340px] rounded-full opacity-20'
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <ToastContainer theme="dark" />

      <div className='relative z-10 min-h-screen w-full flex flex-col'>
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} adminProfile={adminProfile} />
            <div className='flex w-full flex-1 min-w-0'>
              <Sidebar />
              <main className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8'>
                <div className='max-w-[1400px] mx-auto w-full'>
                  <Routes>
                    <Route path='/' element={<Dashboard token={token} />} />
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                    <Route path='/team' element={<Team token={token} adminProfile={adminProfile} />} />
                  </Routes>
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:4000' 
        : `http://${window.location.hostname}:4000`);

export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  React.useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-black min-h-screen text-white'>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className='flex flex-col min-h-screen'>
          <Navbar setToken={setToken} />
          <hr className='border-neutral-800' />
          <div className='flex w-full flex-1'>
            <Sidebar />
            <div className='w-[82%] mx-auto ml-[max(5vw,25px)] my-8'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Verify from './pages/Verify';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-zinc-100 overflow-x-hidden flex flex-col">
      {/* Subtle Ambient Violet/Indigo Spotlights on Pure Black (Matches Admin Panel) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute -top-40 left-1/4 w-[560px] h-[380px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(95px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/5 w-[480px] h-[340px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <ToastContainer theme="dark" position="bottom-right" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <SearchBar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
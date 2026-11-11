import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from './pages/Profile';
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import MobileNav from "./components/MobileNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden flex flex-col justify-between pb-16 sm:pb-0">
      <div>
        <ToastContainer />
        <Navbar /> {/* Navbar ni container ki bayata pettamu, idi full width stretch avthundi */}
        
        <div className="px-4 sm:px-8 md:px-10 lg:px-12 w-full">
          <SearchBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default App;
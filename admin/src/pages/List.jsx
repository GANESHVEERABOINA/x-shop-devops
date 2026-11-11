import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success("Product removed successfully!");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='p-4 sm:p-6 text-white w-full space-y-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between border-b border-neutral-800 pb-4'>
        <h3 className='text-xl font-extrabold uppercase tracking-wide text-white'>
          All Products Inventory <span className='text-[#ffc200]'>({list.length})</span>
        </h3>
      </div>

      {/* Table Header for Desktop */}
      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-5 bg-[#141414] border border-neutral-800 rounded-2xl text-xs font-extrabold text-gray-400 uppercase tracking-wider'>
        <span>Image</span>
        <span>Product Name</span>
        <span>Category</span>
        <span>Price</span>
        <span className='text-center'>Action</span>
      </div>

      {/* Product List Cards */}
      <div className='space-y-3'>
        {list.map((item, index) => {
          const imgUrl = Array.isArray(item.image) ? item.image[0] : item.image;
          return (
            <div
              key={index}
              className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-5 bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-2xl shadow-lg transition'
            >
              <img className='w-14 h-16 object-cover rounded-xl border border-neutral-700' src={imgUrl} alt={item.name} />
              
              <div className='space-y-1 col-span-2 sm:col-span-1 md:col-span-1'>
                <p className='font-bold text-white text-sm sm:text-base line-clamp-1'>{item.name}</p>
                <p className='text-xs text-gray-400'>ID: {item._id.slice(-6)}</p>
              </div>

              <p className='text-xs sm:text-sm font-semibold text-gray-300'>{item.category}</p>
              
              <p className='text-sm sm:text-base font-extrabold text-[#ffc200]'>{currency}{item.price}</p>
              
              <div className='flex justify-center'>
                <button
                  onClick={() => removeProduct(item._id)}
                  className='bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow'
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default List
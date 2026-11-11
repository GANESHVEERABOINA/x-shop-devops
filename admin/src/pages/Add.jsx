import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success("Product added successfully!")
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 text-white max-w-4xl pb-20'>
      
      {/* Upload Images Section */}
      <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 w-full space-y-4 shadow-xl'>
        <p className='text-sm font-extrabold text-[#ffc200] uppercase tracking-wider'>1. Upload Product Images</p>
        
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {[image1, image2, image3, image4].map((img, idx) => {
            const setters = [setImage1, setImage2, setImage3, setImage4];
            return (
              <label key={idx} htmlFor={`image${idx + 1}`} className='cursor-pointer group'>
                <div className='w-full aspect-[3/4] bg-black border border-neutral-700 group-hover:border-[#ffc200] rounded-2xl flex flex-col items-center justify-center overflow-hidden transition shadow'>
                  <img
                    className='w-full h-full object-cover'
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    alt="Upload"
                  />
                  {!img && <span className='text-[10px] text-gray-400 mt-1 font-semibold'>Upload +</span>}
                </div>
                <input onChange={(e) => setters[idx](e.target.files[0])} type="file" id={`image${idx + 1}`} hidden />
              </label>
            );
          })}
        </div>
      </div>

      {/* Product Details Section */}
      <div className='bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 w-full space-y-5 shadow-xl'>
        <p className='text-sm font-extrabold text-[#ffc200] uppercase tracking-wider'>2. Product Information</p>

        <div className='space-y-2'>
          <p className='text-xs font-bold text-gray-300'>Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Type product name here..."
            required
            className='w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition'
          />
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-bold text-gray-300'>Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Write detailed product description here..."
            required
            rows={4}
            className='w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none transition resize-none'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <p className='text-xs font-bold text-gray-300'>Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className='w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none cursor-pointer'
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className='space-y-2'>
            <p className='text-xs font-bold text-gray-300'>Sub Category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className='w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none cursor-pointer'
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className='space-y-2'>
            <p className='text-xs font-bold text-gray-300'>Product Price (₹)</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="999"
              required
              className='w-full bg-black border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#ffc200] outline-none'
            />
          </div>
        </div>

        {/* Sizes Selection */}
        <div className='space-y-3 pt-2'>
          <p className='text-xs font-bold text-gray-300'>Select Product Sizes</p>
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((item) => (
              <div
                key={item}
                onClick={() => setSizes(prev => prev.includes(item) ? prev.filter(item => item !== item) : [...prev, item])}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm border cursor-pointer transition ${
                  sizes.includes(item)
                    ? 'bg-[#ffc200] border-[#ffc200] text-black shadow-lg scale-105'
                    : 'bg-black border-neutral-700 text-gray-300 hover:border-gray-400'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className='flex items-center gap-3 pt-2 cursor-pointer'>
          <input
            onChange={() => setBestseller(prev => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className='w-5 h-5 accent-[#ffc200] cursor-pointer'
          />
          <label htmlFor="bestseller" className='text-xs sm:text-sm font-bold text-gray-200 cursor-pointer'>
            Add to X-Shop Bestseller Collection
          </label>
        </div>

      </div>

      <button
        type="submit"
        className='py-4 px-10 rounded-2xl bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-sm uppercase tracking-wider shadow-xl transition cursor-pointer'
      >
        ADD PRODUCT
      </button>

    </form>
  )
}

export default Add
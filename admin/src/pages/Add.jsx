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
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 text-zinc-100 max-w-4xl mx-auto pb-12'>
      
      <div className='w-full'>
        <h2 className='text-2xl font-bold tracking-tight text-white'>Add Product</h2>
        <p className='text-xs sm:text-sm text-zinc-400 mt-1'>Create a new item in your X-Shop catalog</p>
      </div>

      {/* Upload Images */}
      <div className='glass-card rounded-2xl p-6 w-full space-y-4'>
        <p className='text-xs font-semibold text-zinc-300 uppercase tracking-wider'>Product Media</p>
        
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {[image1, image2, image3, image4].map((img, idx) => {
            const setters = [setImage1, setImage2, setImage3, setImage4];
            return (
              <label key={idx} htmlFor={`image${idx + 1}`} className='cursor-pointer group'>
                <div className='w-full aspect-[3/4] glass-input group-hover:border-violet-400/60 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition'>
                  <img
                    className='w-full h-full object-cover'
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    alt="Upload"
                  />
                  {!img && <span className='text-[11px] text-zinc-400 mt-1 font-medium'>Upload +</span>}
                </div>
                <input onChange={(e) => setters[idx](e.target.files[0])} type="file" id={`image${idx + 1}`} hidden />
              </label>
            );
          })}
        </div>
      </div>

      {/* Product Details */}
      <div className='glass-card rounded-2xl p-6 w-full space-y-5'>
        <p className='text-xs font-semibold text-zinc-300 uppercase tracking-wider'>Product Details</p>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-zinc-400 block'>Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="e.g. Oversized Cotton Tee"
            required
            className='w-full glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-600'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-zinc-400 block'>Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Write product description..."
            required
            rows={4}
            className='w-full glass-input rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-600 resize-none'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-zinc-400 block'>Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm cursor-pointer'
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-zinc-400 block'>Sub Category</label>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm cursor-pointer'
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-zinc-400 block'>Price (₹)</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="999"
              required
              className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
            />
          </div>
        </div>

        {/* Sizes */}
        <div className='space-y-2.5 pt-1'>
          <label className='text-xs font-medium text-zinc-400 block'>Available Sizes</label>
          <div className='flex flex-wrap gap-2.5'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((item) => (
              <div
                key={item}
                onClick={() => setSizes(prev => prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item])}
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-xs cursor-pointer transition-all ${
                  sizes.includes(item)
                    ? 'btn-primary'
                    : 'glass-pill text-zinc-300 hover:text-white'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className='flex items-center gap-3 pt-1'>
          <input
            onChange={() => setBestseller(prev => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className='w-4 h-4 accent-violet-500 cursor-pointer'
          />
          <label htmlFor="bestseller" className='text-xs sm:text-sm font-medium text-zinc-300 cursor-pointer'>
            Feature in Bestsellers
          </label>
        </div>

      </div>

      <button
        type="submit"
        className='py-3 px-8 rounded-xl btn-primary font-semibold text-sm cursor-pointer'
      >
        Publish Product
      </button>

    </form>
  )
}

export default Add
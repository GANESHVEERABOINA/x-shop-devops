import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className="text-white space-y-12 pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center">
        <span className="bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase">
          📞 GET IN TOUCH
        </span>
        <div className="mt-2">
          <Title text1={'CONTACT'} text2={'US'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#111111] border border-neutral-800 p-6 sm:p-10 rounded-3xl shadow-2xl">
        <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-700">
          <img
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1000&auto=format&fit=crop"
            alt="Contact Support"
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="bg-black/60 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-[#ffc200] uppercase tracking-wider">
              OUR STORE HEADQUARTERS
            </h3>
            <p className="text-sm text-gray-300">
              Hitech City Road, Madhapur, Hyderabad, Telangana, India - 500081
            </p>
            <p className="text-sm text-gray-300">
              Tel: <strong className="text-white">+91 (40) 555-0132</strong>
            </p>
            <p className="text-sm text-gray-300">
              Email: <strong className="text-[#ffc200]">support@xshop.com</strong>
            </p>
          </div>

          <div className="bg-black/60 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-[#ffc200] uppercase tracking-wider">
              CAREERS AT X-SHOP
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Want to build the future of cloud e-commerce with us? Explore our open engineering & DevOps roles.
            </p>
            <button
              onClick={() => alert('No current openings. Send resume to hr@xshop.com')}
              className="bg-[#ffc200] hover:bg-[#ffcf33] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              Explore Careers
            </button>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
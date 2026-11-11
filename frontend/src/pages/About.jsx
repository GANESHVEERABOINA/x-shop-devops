import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className="text-white space-y-12 pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center">
        <span className="bg-neutral-900 border border-neutral-700 text-[#ffc200] text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase">
          📖 WHO WE ARE
        </span>
        <div className="mt-2">
          <Title text1={'ABOUT'} text2={'US'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#111111] border border-neutral-800 p-6 sm:p-10 rounded-3xl shadow-2xl">
        <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-700">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
            alt="About X-Shop"
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>

        <div className="md:col-span-7 space-y-5 text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>
            <strong className="text-white">X-Shop</strong> was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase top-tier fashion products from the comfort of their homes.
          </p>
          <p>
            Since our inception, we’ve worked tirelessly to curate a diverse selection of high-quality apparel and accessories that cater to every style and preference.
          </p>
          
          <div className="bg-black/60 border border-neutral-800 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-extrabold text-[#ffc200] uppercase tracking-wider">
              ⚡ OUR MISSION
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Our mission at X-Shop is to empower customers with choice, convenience, and confidence. We’re dedicated to providing a seamless shopping experience from browsing and secure checkout to lightning-fast delivery.
            </p>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  const highlights = [
    {
      title: 'Quality Assurance',
      desc: 'Every garment is selected and inspected to meet strict comfort and durability standards.',
    },
    {
      title: 'Seamless Checkout',
      desc: 'Fast, secure ordering with UPI, cards, and cash on delivery across India.',
    },
    {
      title: 'Dedicated Support',
      desc: 'Responsive customer care for quick sizing help, order tracking, and easy returns.',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-20 text-zinc-100 space-y-12">
      <div className="border-b border-white/[0.08] pb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-1">
          Our Story
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          About X-Shop
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {assets.about_img && (
          <div className="lg:col-span-5 glass-card rounded-3xl overflow-hidden">
            <img
              src={assets.about_img}
              alt="About X-Shop"
              className="w-full h-full object-cover max-h-[420px]"
            />
          </div>
        )}

        <div className={`${assets.about_img ? 'lg:col-span-7' : 'lg:col-span-12'} glass-card rounded-3xl p-6 sm:p-10 space-y-5`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Designed for modern everyday wear.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            X-Shop was built with a simple goal: bring clean design, dependable fabric quality, and a smooth online shopping experience together under one roof.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            From daily essentials to seasonal drops, we focus on timeless silhouettes and transparent pricing backed by reliable cloud infrastructure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((item, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
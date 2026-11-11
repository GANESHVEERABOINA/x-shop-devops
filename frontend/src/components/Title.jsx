import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-3 mb-3">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white uppercase">
        {text1} <span className="text-[#ffc200]">{text2}</span>
      </h2>
      <span className="w-8 sm:w-11 h-[3px] bg-[#ffc200] rounded-full"></span>
    </div>
  );
};

export default Title;
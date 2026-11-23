import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
      <span className="text-zinc-400 font-semibold">{text1}</span>{' '}
      <span>{text2}</span>
    </h2>
  );
};

export default Title;
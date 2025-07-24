import React from 'react';

export const SparklesCore = ({ className = '', ...props }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none animate-pulse bg-[radial-gradient(#00ffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 ${className}`}
      {...props}
    />
  );
};

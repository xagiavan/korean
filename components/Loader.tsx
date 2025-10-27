
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', inline = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className={`flex justify-center items-center ${inline ? '' : 'p-4'}`}>
      <div className={`${sizeClasses[size]} border-hanguk-blue-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;
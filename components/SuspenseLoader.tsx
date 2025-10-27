import React from 'react';

const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="w-12 h-12 border-4 border-hanguk-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 dark:text-slate-400">Đang tải tính năng...</p>
    </div>
  );
};

export default SuspenseLoader;
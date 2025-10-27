import React from 'react';
import { SparklesIcon, CloseIcon } from './icons/Icons';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md m-4 animate-modal-content text-center p-8 relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Đóng"
        >
          <CloseIcon />
        </button>
        
        <div className="mx-auto mb-4 p-4 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 rounded-full inline-block">
            <SparklesIcon className="w-10 h-10 text-hanguk-blue-600 dark:text-hanguk-blue-400" />
        </div>

        <h2 id="onboarding-title" className="text-2xl font-bold text-slate-800 dark:text-white">Chào mừng bạn đến với Học Tiếng Hàn!</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Mỗi ngày, Gia sư AI sẽ tạo ra một <strong className="text-hanguk-blue-700 dark:text-hanguk-blue-300">lộ trình học tập được cá nhân hóa</strong> dành riêng cho bạn.
        </p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Hãy bắt đầu với <strong>Mục tiêu hôm nay</strong> để khởi động hành trình chinh phục tiếng Hàn của bạn nhé!
        </p>
        <button 
          onClick={onClose} 
          className="mt-8 w-full px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors"
        >
          Bắt đầu học ngay!
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
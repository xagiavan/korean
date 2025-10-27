
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import { AppLogo } from './icons/Icons';

interface AuthPageProps {
  onSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="flex items-center mb-6">
             <AppLogo className="h-12 w-12 mr-3" />
            <h1 className="text-3xl font-bold text-hanguk-blue-700 dark:text-hanguk-blue-300">Chào mừng đến với Học Tiếng Hàn</h1>
        </div>
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl">
            <div className="flex mb-6 border-b-2 border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('login')}
                    className={`w-1/2 pb-3 font-semibold text-center transition-all-base ${activeTab === 'login' ? 'text-hanguk-blue-600 dark:text-hanguk-blue-400 border-b-2 border-hanguk-blue-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Đăng nhập
                </button>
                <button
                    onClick={() => setActiveTab('signup')}
                     className={`w-1/2 pb-3 font-semibold text-center transition-all-base ${activeTab === 'signup' ? 'text-hanguk-blue-600 dark:text-hanguk-blue-400 border-b-2 border-hanguk-blue-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Đăng ký
                </button>
            </div>
            {activeTab === 'login' ? <Login onSuccess={onSuccess} /> : <SignUp onSuccess={onSuccess} />}
        </div>
    </div>
  );
};

export default AuthPage;

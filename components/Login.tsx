
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, FacebookIcon, ZaloIcon } from './icons/Icons';
import Loader from './Loader';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithProvider, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'zalo') => {
      setError(null);
      try {
          await loginWithProvider(provider);
          onSuccess();
      } catch (err: any) {
          setError(err.message);
      }
  }

  return (
    <div className="animate-fade-in w-full max-w-sm">
      <h3 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h3>
      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-2">Sử dụng email <span className="font-bold">vip@example.com</span> để thử tài khoản VIP.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-sm">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 transition-all-base flex items-center justify-center"
        >
          {loading ? <Loader /> : 'Đăng nhập'}
        </button>
      </form>
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-sm">hoặc</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
      </div>
      <div className="space-y-3">
        <button onClick={() => handleSocialLogin('zalo')} disabled={loading} className="w-full py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all-base">
            <ZaloIcon /> Đăng nhập với Zalo
        </button>
        <button onClick={() => handleSocialLogin('google')} disabled={loading} className="w-full py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all-base">
            <GoogleIcon /> Đăng nhập với Google
        </button>
         <button onClick={() => handleSocialLogin('facebook')} disabled={loading} className="w-full py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all-base">
            <FacebookIcon /> Đăng nhập với Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;

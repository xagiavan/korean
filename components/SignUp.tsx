
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

interface SignUpProps {
  onSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }
    setError(null);
    try {
      await signup(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-sm">
      <h3 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản mới</h3>
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
        <div>
          <label className="block mb-1 font-semibold text-sm">Xác nhận Mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? <Loader /> : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;

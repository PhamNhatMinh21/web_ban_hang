// src/components/auth/AuthModal.tsx
import React, { useState } from 'react';
import api from '../lib/axios';
import { User, UserResponse } from '../types';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserResponse) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setFullName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setError(''); setIsLogin(true); setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // ĐĂNG NHẬP THẬT VỚI BACKEND
        const res = await api.post(`/auth/login`, { email, password });
        const { token, user } = res.data;

        // Lưu token + user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Gọi callback
        onLoginSuccess(user);
        handleClose();
      } else {
        // ĐĂNG KÝ THẬT VỚI BACKEND
        if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        const [firstName, ...lastParts] = fullName.trim().split(' ');
        const lastName = lastParts.join(' ') || firstName;

        await api.post(`/auth/register`, {
          firstName,
          lastName,
          email,
          password,
          phoneNumber: ''
        });

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setFullName('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi kết nối. Kiểm tra backend.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-gym-dark rounded-lg shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gym-gray hover:text-white transition"
          aria-label="Đóng"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex mb-6 border-b border-gray-700">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-lg font-bold transition ${isLogin ? 'text-gym-yellow border-b-2 border-gym-yellow' : 'text-gym-gray'}`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-lg font-bold transition ${!isLogin ? 'text-gym-yellow border-b-2 border-gym-yellow' : 'text-gym-gray'}`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gym-gray mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gym-darker border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gym-gray mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gym-darker border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gym-gray mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gym-darker border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gym-gray mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gym-darker border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gym-yellow text-gym-darker font-bold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-gym-darker" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? 'Đăng nhập' : 'Đăng ký'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
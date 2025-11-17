
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import api from '../utils/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/admins/login', { email, password });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('cz_token', token);
        navigate('/admin/dashboard');
      } else {
        setError('فشل تسجيل الدخول، حاول مرة أخرى.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'حدث خطأ غير متوقع.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center mb-6">
          <FaLock className="text-primary text-2xl me-2" />
          <h1 className="text-2xl font-bold">تسجيل الدخول للوحة التحكم</h1>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 text-sm font-medium">كلمة المرور</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            disabled={loading}
          >
            {loading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

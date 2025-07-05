'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'patient'
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          
          // Redirect based on role
          switch (data.user.role) {
            case 'doctor':
              router.push('/doctor/dashboard');
              break;
            case 'patient':
              router.push('/patient/dashboard');
              break;
            case 'finance':
              router.push('/finance/dashboard');
              break;
            default:
              router.push('/patient/dashboard');
          }
        } else {
          setIsLogin(true);
          setFormData({ email: '', password: '', name: '', phone: '', role: 'patient' });
        }
      } else {
        setError(data.error || t('operationFailed'));
      }
    } catch (error) {
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Language Toggle */}
        <div className="text-center mb-6">
          <LanguageToggle />
        </div>

        {/* Main Card */}
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? t('login') : t('register')}
            </h1>
            <p className="mt-2 text-gray-600">
              {isLogin ? t('login') : t('register')} {t('dashboard')}
            </p>
          </div>

          <div className="card-body">
            {error && (
              <div className="message-error mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('role')} *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-input"
                      required={!isLogin}
                    >
                      <option value="patient">{t('patient')}</option>
                      <option value="doctor">{t('doctor')}</option>
                      <option value="finance">{t('finance')}</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')} *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="form-button w-full"
              >
                {loading ? t('loading') : (isLogin ? t('login') : t('register'))}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', name: '', phone: '', role: 'patient' });
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {isLogin ? t('register') : t('login')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
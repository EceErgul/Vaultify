import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';
import Logo from '@/assets/vaultify_logo_nobackground.png';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    handleThemeChange(mediaQuery);
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const handleGoogleRegister = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    window.location.href = `${apiBase}/auth/google`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError(t('register_err_password_match'));
      return;
    }
    if (!formData.email.includes('@')) {
      setError(t('register_err_email_invalid'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password
        },
      });

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      if (err?.message === 'Failed to fetch') {
        setError(t('register_err_server_offline'));
      } else {
        setError(err?.message || t('register_err_default'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1A202C] flex items-center justify-center p-4 font-inter text-[#333D50] dark:text-[#F7FAFC] transition-colors">
      <div className="bg-white dark:bg-[#2D3748] w-full max-w-[800px] min-h-[550px] sm:min-h-[600px] border border-gray-300 dark:border-[#4A5568] 
      shadow-sm relative flex flex-col items-center pt-14 pb-8 px-4 sm:px-10 rounded-xl sm:rounded-none transition-colors">
        
        <Link 
          to="/landing" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#CDCDCD] dark:bg-[#4A5568] px-2.5 sm:px-3 py-1.5 
          rounded text-xs text-[#333D50] dark:text-[#F7FAFC] hover:bg-gray-400 dark:hover:bg-[#64748B] transition-colors shadow-sm"
        >
          <span>←</span> <span>{t('register_back')}</span>
        </Link>

        <div className="w-20 h-20 mb-4 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-[#F7FAFC] mb-1 sm:mb-2 text-center">{t('register_title')}</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#A0AEC0] mb-6 font-regular text-center">
          {t('register_has_account')} <Link to="/login" className="text-blue-500 dark:text-[#38BDF8] underline">{t('register_login_link')}</Link>
        </p>

        <button 
          onClick={handleGoogleRegister}
          type="button"
          disabled={loading}
          className="w-full max-w-md h-[45px] flex items-center justify-center gap-3 border border-[#CDCDCD] dark:border-[#4A5568] rounded-[6px] 
          hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors mb-6 bg-white dark:bg-[#1A202C] cursor-pointer shadow-sm disabled:opacity-50 px-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-[#333D50] dark:text-[#F7FAFC] whitespace-nowrap">{t('register_google_btn')}</span>
        </button>

        <div className="w-full max-w-md flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#4A5568]"></div>
          <span className="text-xs sm:text-sm text-gray-400 dark:text-[#A0AEC0] font-regular">{t('register_or')}</span>
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#4A5568]"></div>
        </div>

        <form onSubmit={handleRegister} className="w-full max-w-md space-y-4 flex flex-col items-center">
          <div className="space-y-3 w-full">
            {[
              { label: t('register_fullname_label'), type: 'text', key: 'fullName', value: formData.fullName },
              { label: t('register_email_label'), type: 'email', key: 'email', value: formData.email },
              { label: t('register_password_label'), type: 'password', key: 'password', value: formData.password },
              { label: t('register_password_confirm_label'), type: 'password', key: 'passwordConfirm', value: formData.passwordConfirm }
            ].map((field) => (
              <div key={field.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1.5 sm:gap-4 w-full">
                <label className="text-xs sm:text-sm font-medium sm:w-32 sm:text-right whitespace-nowrap">{field.label}</label>
                <input 
                  type={field.type}
                  value={field.value}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  className="w-full sm:w-64 h-10 sm:h-8 border border-gray-300 dark:border-[#4A5568] bg-white dark:bg-[#1A202C] text-[#333D50] dark:text-[#F7FAFC] rounded-lg sm:rounded-full px-4 text-sm focus:outline-none 
                  focus:border-gray-500 dark:focus:border-[#38BDF8]"
                  disabled={loading}
                  required
                />
              </div>
            ))}
          </div>

          <div className="min-h-[24px] flex items-center justify-center mt-1 w-full">
            {error && (
              <p className="text-[11px] text-red-600 dark:text-[#F87171] font-medium italic animate-fade-in text-center px-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-2 w-full">
            <Button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-32 h-10 !bg-[#333D50] dark:!bg-[#38BDF8] text-white dark:text-[#0F172A] rounded shadow-md hover:!bg-[#45526C] 
              dark:hover:!bg-[#7ECCF4] transition-all border-none disabled:opacity-50 cursor-pointer flex items-center justify-center font-bold"
            >
              {loading ? t('register_loading') : t('register_submit_btn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
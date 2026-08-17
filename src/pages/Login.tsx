import React, { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';
import Logo from '@/assets/vaultify_logo_nobackground.png';

interface LoginProps {
  setUserStatus: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setUserStatus }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const response: any = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      console.log("Login gelen ham response:", response);

      const token = response?.token || response?.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        setUserStatus(true);
        navigate('/dashboard');
      } else {
        console.error("Token bulunamadı, gelen yanıt:", response);
        setError(true);
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1A202C] flex items-center justify-center p-4 font-inter transition-colors">
      <div className="bg-white dark:bg-[#2D3748] w-full max-w-[800px] min-h-[550px] sm:min-h-[600px] border border-gray-300 dark:border-[#4A5568] shadow-sm relative flex flex-col items-center pt-14 pb-8 px-4 sm:px-10 text-[#333D50] dark:text-[#F7FAFC] rounded-xl sm:rounded-none transition-colors">
        
        <Link 
          to="/landing" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#CDCDCD] dark:bg-[#4A5568] px-2.5 sm:px-3 py-1.5 rounded text-xs text-[#333D50] dark:text-[#F7FAFC] hover:bg-gray-400 dark:hover:bg-[#64748B] transition-colors shadow-sm"
        >
          <span>←</span> <span>{t('login_back')}</span>
        </Link>

        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-[#F7FAFC] mb-1 sm:mb-2 text-center">{t('login_welcome_back')}</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#A0AEC0] mb-6 font-regular text-center">
          {t('login_no_account')} <Link to="/register" className="text-blue-500 dark:text-[#38BDF8] underline">{t('login_register_link')}</Link>
        </p>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full max-w-md h-[45px] flex items-center justify-center gap-3 border border-[#CDCDCD] dark:border-[#4A5568] rounded-[6px] hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors mb-6 bg-white dark:bg-[#1A202C] cursor-pointer shadow-sm px-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-[#333D50] dark:text-[#F7FAFC] whitespace-nowrap">{t('login_google_btn')}</span>
        </button>

        <div className="w-full max-w-md flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#4A5568]"></div>
          <span className="text-xs sm:text-sm text-gray-400 dark:text-[#A0AEC0] font-regular">{t('login_or')}</span>
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#4A5568]"></div>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col items-center">
          <div className="space-y-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1.5 sm:gap-4 w-full">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium sm:w-32 sm:text-right">
                {t('login_email_label')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-64 h-10 sm:h-8 border border-gray-300 dark:border-[#4A5568] bg-white dark:bg-[#1A202C] text-[#333D50] dark:text-[#F7FAFC] rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500 dark:focus:border-[#38BDF8]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1.5 sm:gap-4 w-full">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium sm:w-32 sm:text-right">
                {t('login_password_label')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full sm:w-64 h-10 sm:h-8 border border-gray-300 dark:border-[#4A5568] bg-white dark:bg-[#1A202C] text-[#333D50] dark:text-[#F7FAFC] rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500 dark:focus:border-[#38BDF8]"
              />
            </div>
          </div>

          <div className="flex justify-end w-full max-w-xs sm:max-w-md mt-2 px-1">
             <Link to="/reset-password" title="Şifre Sıfırlama" className="text-[11px] text-gray-400 dark:text-[#A0AEC0] hover:text-blue-500 dark:hover:text-[#38BDF8] transition-colors underline">
               {t('login_forgot_password')}
             </Link>
          </div>

          <div className="relative min-h-[60px] mt-4 flex flex-col items-center justify-center w-full">
            {error && (
              <p className="absolute top-0 text-[11px] text-red-600 dark:text-[#F87171] font-medium animate-pulse text-center">
                {t('login_error_message')}
              </p>
            )}
            
            <Button 
              type="submit"
              className="mt-4 sm:mt-6 w-full sm:w-32 h-10 !bg-[#333D50] dark:!bg-[#38BDF8] text-white dark:text-[#0F172A] rounded shadow-md hover:!bg-[#45526C] dark:hover:!bg-[#7ECCF4] transition-all duration-200 border-none disabled:opacity-50 cursor-pointer flex items-center justify-center font-bold"
              disabled={loading}
            >
              {loading ? t('login_logging_in') : t('login_submit_btn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
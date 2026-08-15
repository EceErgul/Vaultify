import React, { useState, type Dispatch, type SetStateAction } from 'react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUserStatus(true);
        navigate('/dashboard');
      } else {
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
    window.location.href = 'http://127.0.0.1:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] min-h-[550px] sm:min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-14 pb-8 px-4 sm:px-10 text-[#333D50] rounded-xl sm:rounded-none">
        
        <Link 
          to="/landing" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#CDCDCD] px-2.5 sm:px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> <span>{t('login_back')}</span>
        </Link>

        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2 text-center">{t('login_welcome_back')}</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 font-regular text-center">
          {t('login_no_account')} <Link to="/register" className="text-blue-500 underline">{t('login_register_link')}</Link>
        </p>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full max-w-md h-[45px] flex items-center justify-center gap-3 border border-[#CDCDCD] rounded-[6px] hover:bg-gray-50 transition-colors mb-6 bg-white cursor-pointer shadow-sm px-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-[#333D50] whitespace-nowrap">{t('login_google_btn')}</span>
        </button>

        <div className="w-full max-w-md flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-xs sm:text-sm text-gray-400 font-regular">{t('login_or')}</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
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
                className="w-full sm:w-64 h-10 sm:h-8 border border-gray-300 rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
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
                className="w-full sm:w-64 h-10 sm:h-8 border border-gray-300 rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"

              />
            </div>
          </div>

          <div className="flex justify-end w-full max-w-xs sm:max-w-md mt-2 px-1">
             <Link to="/reset-password" title="Şifre Sıfırlama" className="text-[11px] text-gray-400 hover:text-blue-500 transition-colors underline">
               {t('login_forgot_password')}
             </Link>
          </div>

          <div className="relative min-h-[60px] mt-4 flex flex-col items-center justify-center w-full">
            {error && (
              <p className="absolute top-0 text-[11px] text-red-600 font-medium animate-pulse text-center">
                {t('login_error_message')}
              </p>
            )}
            
            <Button 
              type="submit"
              className="mt-4 sm:mt-6 w-full sm:w-32 h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] transition-all duration-200 border-none disabled:opacity-50 cursor-pointer flex items-center justify-center"
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
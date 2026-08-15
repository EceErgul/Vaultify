import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';

const Logo = '/src/assets/vaultify_logo_nobackground.png';

const UpdatePassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('new_pass_err_mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('new_pass_err_length'));
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword: password },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err?.message || t('new_pass_err_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[800px] min-h-[550px] sm:min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-14 pb-8 px-4 sm:px-10 rounded-xl sm:rounded-none">
        
        <Link 
          to="/login" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#CDCDCD] px-2.5 sm:px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> <span>{t('new_pass_back')}</span>
        </Link>

        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        {!success ? (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2 text-center">{t('new_pass_title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 text-center font-regular px-2">
              {t('new_pass_desc')}
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 flex flex-col items-center">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-[#333D50]">{t('new_pass_label_new')}</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 sm:h-9 border border-gray-300 rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-[#333D50]">{t('new_pass_label_confirm')}</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 sm:h-9 border border-gray-300 rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
              </div>

              <div className="min-h-[24px] flex items-center justify-center w-full">
                {error && <p className="text-xs text-red-600 font-medium italic text-center px-2">{error}</p>}
              </div>

              <div className="flex justify-center pt-2 sm:pt-4 w-full">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] cursor-pointer flex items-center justify-center"
                >
                  {loading ? t('new_pass_loading') : t('new_pass_submit_btn')}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center mt-6 sm:mt-10 px-2 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-1 sm:mb-2">{t('new_pass_success_title')}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{t('new_pass_success_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
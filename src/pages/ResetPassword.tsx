import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiRequest } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';
import Logo from '@/assets/vaultify_logo_nobackground.png';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Sıfırlama isteği hatası:", err);
      setError(err?.message || t('reset_err_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter text-[#333D50]">
      <div className="bg-white w-full max-w-[800px] min-h-[550px] sm:min-h-[600px] border border-gray-300 shadow-sm relative flex flex-col items-center pt-14 pb-8 px-4 sm:px-10 rounded-xl sm:rounded-none">
        
        <Link 
          to="/login" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#CDCDCD] px-2.5 sm:px-3 py-1.5 rounded text-xs text-[#333D50] hover:bg-gray-400 transition-colors shadow-sm"
        >
          <span>←</span> <span>{t('reset_back_to_login')}</span>
        </Link>

        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 opacity-90">
          <img src={Logo} alt="Vaultify" className="w-full h-full object-contain" />
        </div>

        {!submitted ? (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2 text-center">{t('reset_title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-10 text-center max-w-sm font-regular px-2">
              {t('reset_desc')}
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 sm:space-y-6 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1.5 sm:gap-4 w-full">
                <label className="text-xs sm:text-sm font-medium sm:w-32 sm:text-right whitespace-nowrap">
                  {t('reset_email_label')}
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('reset_email_placeholder')}
                  className="w-full sm:w-64 h-10 sm:h-9 border border-gray-300 rounded-lg sm:rounded-full px-4 text-sm focus:outline-none focus:border-gray-500 transition-all"
                  disabled={loading}
                  required
                />
              </div>

              <div className="min-h-[24px] flex items-center justify-center w-full">
                {error && (
                  <div className="text-center px-2">
                    <p className="text-[11px] text-red-600 font-medium italic animate-fade-in">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-2 sm:mt-8 w-full">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 h-10 !bg-[#333D50] text-white rounded shadow-md hover:!bg-[#45526C] transition-all whitespace-nowrap border-none outline-none disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                  {loading ? t('reset_loading') : t('reset_submit_btn')}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center mt-6 sm:mt-10 px-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2">{t('reset_success_title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 max-w-sm font-regular">
              <span className="font-bold text-gray-700">{email}</span>{t('reset_success_desc_1')}
            </p>
            <Link to="/login">
              <button className="text-xs sm:text-sm text-[#333D50] font-medium hover:underline cursor-pointer">
                {t('reset_success_back')}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/vaultify_logo_nobackground.png';
import { useTranslation } from '../../context/LanguageContext';

const LandingHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header 
      className="w-full h-16 border-b border-[var(--border-color)] flex items-center justify-between px-3 sm:px-6 shadow-sm fixed top-0 left-0 z-50"
      style={{ backgroundColor: 'var(--bg-sidebar)' }}
    >
      <div 
        className="flex items-center gap-2 min-w-0 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={LogoImg} alt={t('landing_logo_alt')} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
        <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--sidebar-text)] whitespace-nowrap">
          Vaultify
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button 
          type="button"
          onClick={() => navigate('/login')}
          className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[var(--sidebar-text)] hover:text-white transition-colors whitespace-nowrap cursor-pointer rounded-lg hover:bg-[var(--sidebar-hover)]"
        >
          {t('btn_login')}
        </button>

        <button 
          type="button"
          onClick={() => navigate('/register')}
          className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[var(--sidebar-accent)] text-gray-900 hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm cursor-pointer"
        >
          {t('btn_register')}
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
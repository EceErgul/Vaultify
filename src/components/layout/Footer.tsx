import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';

const CurrentYear = new Date().getFullYear();

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] py-6 sm:py-8 px-4 sm:px-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs sm:text-sm text-center md:text-left">
        
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 opacity-90">
          <span>© {CurrentYear} -</span>
          <span className="font-bold text-[var(--sidebar-accent)] tracking-tight">VAULTIFY</span>
          <span>· {t('footer_rights')}</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-medium">
          <Link 
            to="/terms" 
            className="text-[var(--sidebar-text)] hover:text-[var(--sidebar-accent)] transition-all duration-300"
          >
            {t('footer_terms')}
          </Link>
          <Link 
            to="/cookies" 
            className="text-[var(--sidebar-text)] hover:text-[var(--sidebar-accent)] transition-all duration-300"
          >
            {t('footer_cookies')}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 sm:gap-3">
          <span className="font-semibold text-white">{t('footer_contact')}</span>
          <a 
            href="mailto:contact@vaultify.com"
            className="text-[var(--sidebar-text)] hover:text-[var(--sidebar-accent)] transition-all duration-300 font-medium break-all sm:break-normal"
          >
            contact@vaultify.com
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
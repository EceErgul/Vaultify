import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/layout/LandingHeader';
import Footer from '../components/layout/Footer';
import { useTranslation } from '../context/LanguageContext';
import LandingBG from '../assets/mainPage-heroBanner.jpg';

const LandingPage: React.FC = () => {
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

  const features = [
    { title: t('landing_feature_1_title'), desc: t('landing_feature_1_desc') },
    { title: t('landing_feature_2_title'), desc: t('landing_feature_2_desc') },
    { title: t('landing_feature_3_title'), desc: t('landing_feature_3_desc') }
  ];

  return (
    <div className="font-inter bg-white dark:bg-[#1A202C] text-[#1A1A1A] dark:text-[#F7FAFC] overflow-x-hidden pt-16 transition-colors">
      <LandingHeader />

      <section className="relative w-full min-h-[650px] md:h-[700px] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={LandingBG}
            alt="Vaultify Safe"
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-[1.2]">
              {t('landing_hero_title')}
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              {t('landing_hero_desc')}
            </p>
            <Link to="/register">
              <button className="bg-[#333D50]/80 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-3 rounded-md text-sm font-medium hover:bg-[#333D50] transition-all shadow-lg cursor-pointer">
                {t('landing_hero_cta')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F7FAFC] mb-12 sm:mb-16 text-left sm:ml-4">
          {t('landing_why_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="bg-[#FFF8E7] dark:bg-[#28241E] p-6 sm:p-10 rounded-[32px] border border-[#E5E5E5] dark:border-[#3F3529] min-h-[350px] sm:min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm transition-colors">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-[#F7FAFC] mb-4 sm:mb-8">{item.title}</h3>
              <p className="text-sm sm:text-base text-[#4A4A4A] dark:text-[#A0AEC0] leading-relaxed px-2 sm:px-4 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F2F9FF] dark:bg-[#19222D] py-16 sm:py-20 px-6 sm:px-10 md:px-14 transition-colors">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F7FAFC] mb-4 sm:mb-6">{t('landing_privacy_title')}</h2>
          <p className="text-sm sm:text-base text-[#4A4A4A] dark:text-[#A0AEC0] leading-relaxed max-w-4xl font-medium">
            {t('landing_privacy_desc')}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 sm:px-10 md:px-14 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F7FAFC] mb-8 sm:mb-10">{t('landing_ready_title')}</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link to="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#333D50] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] px-10 sm:px-12 py-3 rounded-md text-sm font-bold shadow-md hover:bg-[#2A3241] dark:hover:bg-[#7ECCF4] transition-colors cursor-pointer">
              {t('landing_register_btn')}
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white dark:bg-[#2D3748] border border-[#CDCDCD] dark:border-[#4A5568] text-[#333D50] dark:text-[#F7FAFC] px-10 sm:px-12 py-3 rounded-md text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors cursor-pointer">
              {t('landing_login_btn')}
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
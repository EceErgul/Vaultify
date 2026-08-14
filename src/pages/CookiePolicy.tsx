import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export default function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-8 px-4 sm:px-6 flex justify-center transition-colors duration-200">
      <div className="bg-[var(--bg-card)] w-full max-w-3xl p-5 sm:p-8 rounded-xl shadow-sm border border-[var(--border-color)] space-y-6 text-[var(--text-main)]">
        <h1 className="text-xl sm:text-2xl font-bold border-b border-[var(--border-color)] pb-4">
          {t('cookie_title')}
        </h1>
        
        <section className="space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
          <h2 className="font-semibold text-[var(--text-main)] text-base">
            {t('cookie_section1_title')}
          </h2>
          <p>{t('cookie_section1_desc')}</p>
        </section>
      </div>
    </div>
  );
}
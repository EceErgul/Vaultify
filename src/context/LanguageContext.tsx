import React, { createContext, useContext, useState } from 'react';
import trData from '../locales/tr.json';
import enData from '../locales/en.json';

const tr = (trData as any)?.default || trData || {};
const en = (enData as any)?.default || enData || {};

type Language = 'tr' | 'en';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Record<string, string>> = {
  tr: tr as Record<string, string>,
  en: en as Record<string, string>,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('app_lang') as Language) || 'tr';
    } catch {
      return 'tr';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_lang', lang);
    } catch {}
  };

  const t = (key: string): string => {
    const currentDict = dictionaries[language] || dictionaries.tr || {};
    return currentDict[key] || (tr as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
};
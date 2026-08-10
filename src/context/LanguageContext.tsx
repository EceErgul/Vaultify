import React, { createContext, useContext, useState } from 'react';
import tr from '../locales/tr.json';
import en from '../locales/en.json';

type Language = 'tr' | 'en';
type Translations = typeof tr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Record<string, string>> = {
  tr: tr as Record<string, string>,
  en: en as Record<string, string>,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'tr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: keyof Translations): string => {
    const currentDict = dictionaries[language] || dictionaries.tr;
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
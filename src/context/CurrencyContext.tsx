import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyType = 'TL' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  symbol: string;
  formatMoney: (amount: number | string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<CurrencyType, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>('TL');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred_currency') as CurrencyType;
    if (savedCurrency && currencySymbols[savedCurrency]) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (curr: CurrencyType) => {
    setCurrencyState(curr);
    localStorage.setItem('preferred_currency', curr);
  };

  const symbol = currencySymbols[currency];

  const formatMoney = (amount: number | string) => {
    const num = Number(amount);
    if (isNaN(num)) return `0 ${symbol}`;
    return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
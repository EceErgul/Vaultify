import { CurrencyPreference } from '../types/index';

export const formatCurrency = (amount: number, currency: CurrencyPreference = 'TL') => {
  const currencyMap: Record<CurrencyPreference, string> = {
    'TL': 'TRY',
    'USD': 'USD',
    'EUR': 'EUR',
    'GBP': 'GBP'
};

return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currencyMap[currency],
    minimumFractionDigits: 2,
  }).format(amount);
};
export type CurrencyPreference = 'TL' | 'EUR' | 'USD' | 'GBP';
export type LanguagePreference = 'TR' | 'EN';
export type ThemePreference = 'light' | 'dark';
export type AssetCategory = 'Gelir' | 'Gider' | 'Birikim';
export type AssetsType = 'Borsa' | 'Döviz' | 'Altın' | 'Kripto' | 'Teemmü';
export type IncomeSource = 'Maaş' | 'Kira Geliri' | 'Varlıklarım' | 'İkramiye/Prim' | 'Ek İş' | 'Miras' | 'Devlet Desteği' | 'Diğer';
export type ExpenseCategory = 'Ev Alışverişi' | 'Market Alışverişi' | 'Kira' | 'Eğlence' | 'Ulaşım' | 'Taksitler' | 'Borçlar' | 'Faturalar' | 'Sağlık' | 'Diğer';
export type PaymentMethod = 'Nakit' | 'Kredi Kartı' | 'Havale' | 'Taksit';

export interface User {
  id: string;
  fullname: string;
  email: string;
  profile_picture: string;
  created_at?: string;
}

export interface Settings {
  id: string;
  user_id: string;
  auto_archive: boolean;
  auto_archive_months: string[];
  default_currency: CurrencyPreference;
  asset_integration_active: boolean;
  email_notification: boolean;
  trial_expiration_notification: boolean;
  encryption_enabled: boolean;
  invisible_mode: boolean;
  default_language: LanguagePreference;
  theme: ThemePreference;
}

export interface Assets {
  id: string;
  user_id: string;
  asset_type: AssetsType;
  asset_name: string;
  total_quantity: number;
  total_cost: number;
}

export interface AssetTransaction {
  id: string;
  asset_id: string;
  transaction_type: 'Alış' | 'Satış';
  date: string;
  total_quantity: number;
  price_per_unit: number;
  total_value: number;
}

export interface Expenses {
  id: string;
  user_id: string;
  expense_name: string;
  expense_category: ExpenseCategory;
  payment_method: PaymentMethod;
  expenses_amount: number;
  date: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  subscription_name: string;
  cost: number;
  payment_day: number;
  start_date: string;
  is_trial: boolean;
}

export interface Income {
  id: string;
  user_id: string;
  income_name: string;
  income_category: IncomeSource;
  income_amount: number;
  date: string;
}
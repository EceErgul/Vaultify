export type CurrencyPreference = 'TL' | 'EUR' | 'USD' | 'GBP';
export type LanguagePreference = 'TR' | 'EN';
export type ThemePreference = 'light' | 'dark';
export type AssetsType = 'Borsa' | 'Döviz' | 'Altın' | 'Kripto' | 'Teemmü';
export type ExpenseCategory = 'Ev Alışverişi' | 'Market Alışverişi' | 'Kira' | 'Eğlence' | 'Ulaşım' | 'Taksitler' | 'Borçlar' | 'Faturalar' | 'Sağlık' | 'Diğer';
export type PaymentMethod = 'Nakit' | 'kredi Kartı' | 'Havale' | 'Taksit';

export interface User {
    id: string;
    fullname: string;
    email: string;
    profile_picture: string;
    settings: Settings;
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
    date: string; // ISO string format
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
    date: string; // ISO string format
}

export interface Subscription {
    id: string;
    user_id: string;
    subscription_name: string;
    cost: number;
    payment_day: number;
    start_date: string; // ISO string format
    is_trial: boolean;
}

export interface Settings {
    id: string;
    user_id: string;
    auto_archieve_months: string[];
    default_currency: CurrencyPreference;
    asset_integration_active: boolean;
    email_notification: boolean;
    trial_expiration_notification: boolean;
    encryption_enabled: boolean;
    invisible_mode: boolean;
    default_language: LanguagePreference;
    theme: ThemePreference;
}
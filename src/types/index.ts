export type CurrencyPreference = 'TL' | 'EUR' | 'USD' | 'GBP';
export type LanguagePreference = 'TR' | 'EN';
export type ThemePreference = 'light' | 'dark';
export type AssetCategory = 'Gelir' | 'Gider' | 'Birikim';
export type AssetsType = 'Borsa' | 'Döviz' | 'Kripto' | 'Emtia' | 'Faiz' | 'Diğer';
export type IncomeSource = 'Maaş' | 'Kira Geliri' | 'Varlıklarım' | 'İkramiye/Prim' | 'Ek İş' | 'Miras' | 'Devlet Desteği' | 'Diğer';
export type ExpenseCategory = 'Ev Alışverişi' | 'Market Alışverişi' | 'Kira' | 'Eğlence' | 'Ulaşım' | 'Taksitler' | 'Borçlar' | 'Faturalar' | 'Sağlık' | 'Diğer';
export type PaymentMethod = 'Nakit' | 'Kredi Kartı' | 'Havale' | 'Taksit';
export type ExpenseCategoryChart = 'Ev Alışverişi' | 'Market Alışverişi' | 'Kira' | 'Eğlence' | 'Sağlık' | 'Ulaşım' | 'Taksitler' | 'Borçlar' | 'Faturalar' | 'Abonelikler' | 'Diğer';

export interface User {
    id: string;
    full_name: string;
    email: string;
    profile_picture?: string | null;
    password_hash: string;
    created_at?: string | null;
    reset_token?: string | null;
    reset_token_expires?: string | null;
    settings?: Settings;
}

export interface Settings {
    id: string;
    user_id: string;
    auto_archive?: boolean | null;
    auto_archive_months?: string[] | null;
    default_currency?: CurrencyPreference | null;
    asset_integration_active?: boolean | null;
    email_notification?: boolean | null;
    trial_expiration_notification?: boolean | null;
    encryption_enabled?: boolean | null;
    invisible_mode?: boolean | null;
    default_language?: LanguagePreference | null;
    theme?: ThemePreference | null;
    login_notifications?: boolean | null;
}

export interface Assets {
    id: string;
    user_id: string;
    asset_type: AssetsType;
    asset_name: string;
    total_quantity: number;
    total_cost: number;
    live_unit_price?: number | null;
    fetched_at?: string | null;
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
    is_recurring?: boolean | null;
    recurrence_day?: number | null;
    last_generated_date?: string | null;
}

export interface Income {
    id: string;
    user_id: string;
    income_name: string;
    income_category: IncomeSource;
    income_amount: number;
    date: string; // ISO string format
    is_recurring?: boolean | null;
    recurrence_day?: number | null;
    last_generated_date?: string | null;
}

export interface Subscription {
    id: string;
    user_id: string;
    subscription_name: string;
    cost: number;
    payment_day: number;
    start_date: string; // ISO string format
    is_trial?: boolean | null;
}

export interface ProtectedRecord {
    id: string;
    user_id: string;
    record_name: string;
    created_at?: string | null;
}

export interface ExpensesChart {
    id?: string | null;
    user_id?: string | null;
    expense_name?: string | null;
    expense_category: ExpenseCategory;
    expenses_amount?: number | null;
    date?: string | null;
}

export interface ExpensesCategoryChart {
    id?: string | null;
    user_id?: string | null;
    expense_name?: string | null;
    expense_category_chart: ExpenseCategoryChart;
    expenses_amount?: number | null;
    date?: string | null;
}

export interface FilterState {
    searchTerm: string;
    date: string; // ISO string format
    category: ExpenseCategory | null;
    paymentMethod: PaymentMethod | null;
    minAmount: string;
    maxAmount: string;
    expenseName: string;
    dateSort: 'asc' | 'desc';
    amountSort: 'asc' | 'desc';
}
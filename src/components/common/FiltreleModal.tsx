import React, { useState, useMemo } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { Search, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { ExpenseCategory, PaymentMethod, CurrencyPreference } from '../../types/index';
import { getSuggestions } from '../../utils/filterUtils';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export interface FilterState {
  searchTerm: string;
  date: string;
  category: ExpenseCategory | null;
  paymentMethod: PaymentMethod | null;
  minAmount: string;
  maxAmount: string;
  expenseName: string;
  dateSort: 'asc' | 'desc';
  amountSort: 'asc' | 'desc' | null;
}

interface FiltreleModalProps {
  onClose: () => void;
  setFilterCount: (count: number) => void;
  initialFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

type FilterTab = 'tarih' | 'kategori' | 'odeme' | 'tutar' | null;

const currencySymbols: Record<CurrencyPreference, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const FiltreleModal: React.FC<FiltreleModalProps> = ({ 
  onClose, 
  setFilterCount, 
  initialFilters, 
  onApplyFilters 
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';

  const [searchTerm, setSearchTerm] = useState<string>(initialFilters.searchTerm);
  const [textDate, setTextDate] = useState<string>(initialFilters.date);
  const [activeTab, setActiveTab] = useState<FilterTab>(null);
  const [minAmount, setMinAmount] = useState<string>(initialFilters.minAmount);
  const [maxAmount, setMaxAmount] = useState<string>(initialFilters.maxAmount);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(initialFilters.category);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(initialFilters.paymentMethod);
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>(initialFilters.dateSort);
  const [amountSort, setAmountSort] = useState<'asc' | 'desc' | null>(initialFilters.amountSort);

  const categoriesList: { value: ExpenseCategory; label: string }[] = [
    { value: 'Ev Alışverişi', label: t('exp_cat_home') },
    { value: 'Market Alışverişi', label: t('exp_cat_market') },
    { value: 'Kira', label: t('exp_cat_rent') },
    { value: 'Eğlence', label: t('exp_cat_entertainment') },
    { value: 'Ulaşım', label: t('exp_cat_transport') },
    { value: 'Taksitler', label: t('exp_cat_installments') },
    { value: 'Borçlar', label: t('exp_cat_debts') },
    { value: 'Faturalar', label: t('exp_cat_bills') },
    { value: 'Sağlık', label: t('exp_cat_health') },
    { value: 'Diğer', label: t('exp_cat_other') },
  ];

  const paymentMethodsList: { value: PaymentMethod; label: string }[] = [
    { value: 'Nakit', label: t('exp_pay_cash') },
    { value: 'Kredi Kartı', label: t('exp_pay_card') },
    { value: 'Havale', label: t('exp_pay_transfer') },
    { value: 'Taksit', label: t('exp_pay_installment') },
  ];

  const categoryLabels = useMemo(() => categoriesList.map(c => c.label), [categoriesList]);
  const suggestions = useMemo(() => getSuggestions(searchTerm, categoryLabels), [searchTerm, categoryLabels]);

  const handleApply = () => {
    let activeCount = 0;
    if (searchTerm.trim() !== '') activeCount++;
    if (textDate.trim() !== '') activeCount++;
    if (selectedCategory !== null) activeCount++;
    if (selectedPayment !== null) activeCount++;
    if (minAmount.trim() !== '' || maxAmount.trim() !== '') activeCount++;

    const updatedFilters: FilterState = {
      searchTerm,
      date: textDate,
      category: selectedCategory,
      paymentMethod: selectedPayment,
      minAmount,
      maxAmount,
      expenseName: searchTerm,
      dateSort,
      amountSort
    };

    setFilterCount(activeCount);
    onApplyFilters(updatedFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTextDate('');
    setMinAmount('');
    setMaxAmount('');
    setSelectedCategory(null);
    setSelectedPayment(null);
    setDateSort('desc');
    setAmountSort(null);
    setActiveTab(null);
    setFilterCount(0);

    const clearedFilters: FilterState = {
      searchTerm: '',
      date: '',
      category: null,
      paymentMethod: null,
      minAmount: '',
      maxAmount: '',
      expenseName: '',
      dateSort: 'desc',
      amountSort: null
    };
    onApplyFilters(clearedFilters);
    onClose();
  };

  const handleToggleDateSort = () => {
    setDateSort(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleToggleAmountSort = () => {
    setAmountSort(prev => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
  };

  const tabLabelKeyMap = {
    tarih: 'filter_tab_date',
    kategori: 'filter_tab_category',
    odeme: 'filter_tab_payment',
    tutar: 'filter_tab_amount'
  } as const;

  return (
    <BaseModal title={t('filter_modal_title')} onClose={onClose}>
      <div className="flex flex-col space-y-4 font-inter px-4 w-full max-w-md mx-auto text-[var(--text-main)]">
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[40px] pl-11 pr-4 rounded-[30px] border border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none"
              placeholder={t('filter_search_placeholder')} 
            />
            {searchTerm.length > 0 && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 p-2 max-h-[150px] overflow-y-auto">
                {suggestions.map((s) => (
                  <button 
                    key={s} 
                    type="button"
                    onClick={() => setSearchTerm(s)} 
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-main)] rounded transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={handleClearFilters}
            title={t('filter_btn_clear')}
            className="flex items-center justify-center h-[40px] px-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0 text-xs font-medium gap-1 shadow-sm"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">{t("filter_btn_clear")}</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
          {(['tarih', 'kategori', 'odeme', 'tutar'] as Exclude<FilterTab, null>[]).map((tab) => (
            <button 
              key={tab} 
              type="button" 
              onClick={() => setActiveTab(activeTab === tab ? null : tab)} 
              className={`flex items-center justify-center gap-1 py-1 transition-colors ${activeTab === tab ? 'text-[var(--sidebar-accent)]' : 'text-[var(--text-main)] hover:text-[var(--sidebar-accent)]'}`}
            >
              <span>{t(tabLabelKeyMap[tab])}</span>
              {activeTab === tab ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          ))}
        </div>

        <div className="bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)] rounded-xl p-4 min-h-[180px]">
          {activeTab === 'tarih' && (
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={textDate} 
                onChange={(e) => setTextDate(e.target.value)} 
                placeholder={t('filter_date_placeholder')} 
                className="p-2 border border-[var(--border-color)] rounded text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none" 
              />
              <input 
                type="date" 
                className="p-2 border border-[var(--border-color)] rounded text-xs bg-[var(--bg-card)] text-[var(--text-main)] outline-none" 
                onChange={(e) => { if (e.target.value) setTextDate(e.target.value); }} 
              />
            </div>
          )}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-2 gap-2 items-stretch max-h-[160px] overflow-y-auto pr-1">
              {categoriesList.map(({ value, label }) => (
                <button 
                  key={value} 
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === value ? null : value)} 
                  className={`text-xs px-3 py-2.5 rounded h-auto min-h-[42px] flex items-center justify-center text-center leading-tight transition-colors ${selectedCategory === value ? 'bg-[var(--sidebar-accent)] text-slate-900 font-bold' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'odeme' && (
             <div className="flex flex-col gap-2">
                {paymentMethodsList.map(({ value, label }) => (
                  <button 
                    key={value} 
                    type="button"
                    onClick={() => setSelectedPayment(selectedPayment === value ? null : value)} 
                    className={`text-xs p-2 rounded transition-colors ${selectedPayment === value ? 'bg-[var(--sidebar-accent)] text-slate-900 font-bold' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10'}`}
                  >
                    {label}
                  </button>
                ))}
             </div>
          )}
          {activeTab === 'tutar' && (
             <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <Input placeholder={t('filter_min_placeholder')} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
                </div>
                <div className="relative w-full">
                  <Input placeholder={t('filter_max_placeholder')} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
                </div>
             </div>
          )}
          {!activeTab && (
            <div className="flex items-center justify-center h-full min-h-[140px] text-xs text-[var(--text-muted)] text-center">
              {t('filter_tab_instruction') || "Detaylı filtreleme için üstteki sekmelerden birini seçin."}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-start gap-3 text-xs bg-[var(--bg-card)] px-3 py-2.5 rounded-xl border border-[var(--border-color)]">
            <span className="font-medium text-[var(--text-main)]">{t('filter_date_sort_label')}</span>
            <button 
              type="button" 
              onClick={handleToggleDateSort}
              className="font-bold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs shadow-sm"
            >
              {dateSort === 'asc' ? t('filter_sort_oldest') : t('filter_sort_newest')}
            </button>
          </div>
          <div className="flex items-center justify-start gap-3 text-xs bg-[var(--bg-card)] px-3 py-2.5 rounded-xl border border-[var(--border-color)]">
            <span className="font-medium text-[var(--text-main)]">{t('filter_amount_sort_label')}</span>
            <button 
              type="button" 
              onClick={handleToggleAmountSort}
              className="font-bold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs shadow-sm"
            >
              {amountSort === 'asc' ? t('filter_sort_low_to_high') : amountSort === 'desc' ? t('filter_sort_high_to_low') : (t('filter_sort_none') || 'Sıralama Yok')}
            </button>
          </div>
        </div>

        <Button variant="apply" className="w-full mt-2" onClick={handleApply}>{t('filter_btn_apply')}</Button>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
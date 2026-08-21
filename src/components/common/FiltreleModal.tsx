import React, { useState, useMemo } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { Search, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types/index';
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
  amountSort: 'asc' | 'desc';
}

interface FiltreleModalProps {
  onClose: () => void;
  setFilterCount: (count: number) => void;
  initialFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

type FilterTab = 'tarih' | 'kategori' | 'odeme' | 'tutar' | null;

const FiltreleModal: React.FC<FiltreleModalProps> = ({ 
  onClose, 
  setFilterCount, 
  initialFilters, 
  onApplyFilters 
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [searchTerm, setSearchTerm] = useState<string>(initialFilters.searchTerm);
  const [textDate, setTextDate] = useState<string>(initialFilters.date);
  const [activeTab, setActiveTab] = useState<FilterTab>(null);
  const [minAmount, setMinAmount] = useState<string>(initialFilters.minAmount);
  const [maxAmount, setMaxAmount] = useState<string>(initialFilters.maxAmount);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(initialFilters.category);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(initialFilters.paymentMethod);
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>(initialFilters.dateSort);
  const [amountSort, setAmountSort] = useState<'asc' | 'desc'>(initialFilters.amountSort);

  const kategoriler = [
    t('exp_cat_home'),
    t('exp_cat_market'),
    t('exp_cat_rent'),
    t('exp_cat_entertainment'),
    t('exp_cat_transport'),
    t('exp_cat_installments'),
    t('exp_cat_debts'),
    t('exp_cat_bills'),
    t('exp_cat_health'),
    t('exp_cat_other')
  ];

  const odemeYontemleri = [
    t('exp_pay_cash'),
    t('exp_pay_card'),
    t('exp_pay_transfer'),
    t('exp_pay_installment')
  ];

  const suggestions = useMemo(() => getSuggestions(searchTerm, kategoriler), [searchTerm, kategoriler]);

  const handleTextDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextDate(value);
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setTextDate(value);
    }
  };

  const handleApply = () => {
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

    let activeCount = 0;
    if (searchTerm.trim() !== '') activeCount++;
    if (textDate.trim() !== '') activeCount++;
    if (selectedCategory !== null) activeCount++;
    if (selectedPayment !== null) activeCount++;
    if (minAmount.trim() !== '' || maxAmount.trim() !== '') activeCount++;

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
    setAmountSort('desc');
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
      amountSort: 'desc'
    };
    onApplyFilters(clearedFilters);
    onClose();
  };

  const handleToggleDateSort = () => {
    setDateSort(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleToggleAmountSort = () => {
    setAmountSort(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const tabLabelKeyMap = {
    tarih: 'filter_tab_date',
    kategori: 'filter_tab_category',
    odeme: 'filter_tab_payment',
    tutar: 'filter_tab_amount'
  } as const;

  return (
    <BaseModal title={t('filter_modal_title')} onClose={onClose}>
      <div className="flex flex-col space-y-4 font-inter px-4 w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CDCDCD]">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[40px] pl-11 pr-4 rounded-[30px] border border-[#CDCDCD] bg-white text-xs text-[#333D50]"
              placeholder={t('filter_search_placeholder')} 
            />
            {searchTerm.length > 0 && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 max-h-[150px] overflow-y-auto">
                {suggestions.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => { 
                      setSearchTerm(s);
                    }} 
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-[#333D50] rounded"
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
            className="flex items-center justify-center h-[40px] px-3 bg-gray-100 text-[#333D50] rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0 text-xs font-medium gap-1"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">{t("filter_btn_clear")}</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-[#333D50] border-b border-gray-100 pb-2">
          {(['tarih', 'kategori', 'odeme', 'tutar'] as Exclude<FilterTab, null>[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(activeTab === tab ? null : tab)} className={`flex items-center justify-center gap-1 py-1 ${activeTab === tab ? 'text-[#7ECCF4]' : ''}`}>
              <span>{t(tabLabelKeyMap[tab])}</span>
              {activeTab === tab ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          ))}
        </div>

        <div className="bg-white/50 border border-dashed border-[#CDCDCD] rounded-xl p-4 min-h-[180px]">
          {activeTab === 'tarih' && (
            <div className="flex flex-col gap-2">
              <input type="text" value={textDate} onChange={handleTextDateChange} placeholder={t('filter_date_placeholder')} className="p-2 border rounded text-xs bg-white text-[#333D50]" />
              <input type="date" className="p-2 border rounded text-xs bg-white text-[#333D50]" onChange={handleCalendarChange} />
            </div>
          )}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-2 gap-2 items-stretch max-h-[160px] overflow-y-auto pr-1">
              {kategoriler.map((kat, index) => {
                const rawCategories: ExpenseCategory[] = [
                  'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
                  'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
                ];
                const rawValue = rawCategories[index];
                return (
                  <button 
                    key={kat} 
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === rawValue ? null : rawValue)} 
                    className={`text-xs px-3 py-2.5 rounded h-auto min-h-[42px] flex items-center justify-center text-center leading-tight ${selectedCategory === rawValue ? 'bg-[#7ECCF4] text-white' : 'bg-gray-100 text-[#333D50]'}`}
                  >
                    {kat}
                  </button>
                );
              })}
            </div>
          )}
          {activeTab === 'odeme' && (
             <div className="flex flex-col gap-2">
                {odemeYontemleri.map((y, index) => {
                  const rawPayments: PaymentMethod[] = ['Nakit', 'Kredi Kartı', 'Havale', 'Taksit'];
                  const rawValue = rawPayments[index];
                  return (
                    <button 
                      key={y} 
                      type="button"
                      onClick={() => setSelectedPayment(selectedPayment === rawValue ? null : rawValue)} 
                      className={`text-xs p-2 rounded ${selectedPayment === rawValue ? 'bg-[#7ECCF4] text-white' : 'bg-gray-100 text-[#333D50]'}`}
                    >
                      {y}
                    </button>
                  );
                })}
             </div>
          )}
          {activeTab === 'tutar' && (
             <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <Input placeholder={t('filter_min_placeholder')} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
                </div>
                <div className="relative w-full">
                  <Input placeholder={t('filter_max_placeholder')} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
                </div>
             </div>
          )}
          {!activeTab && (
            <div className="flex items-center justify-center h-full min-h-[140px] text-xs text-gray-400 text-center">
              {t('filter_tab_instruction') || "Detaylı filtreleme için üstteki sekmelerden birini seçin."}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-start gap-3 text-xs bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
            <span className="font-medium text-[#333D50]">{t('filter_date_sort_label')}</span>
            <button 
              type="button" 
              onClick={handleToggleDateSort}
              className="font-bold bg-white border border-gray-200 text-[#333D50] px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-xs shadow-sm"
            >
              {dateSort === 'asc' ? t('filter_sort_oldest') : t('filter_sort_newest')}
            </button>
          </div>
          <div className="flex items-center justify-start gap-3 text-xs bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
            <span className="font-medium text-[#333D50]">{t('filter_amount_sort_label')}</span>
            <button 
              type="button" 
              onClick={handleToggleAmountSort}
              className="font-bold bg-white border border-gray-200 text-[#333D50] px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-xs shadow-sm"
            >
              {amountSort === 'asc' ? t('filter_sort_low_to_high') : t('filter_sort_high_to_low')}
            </button>
          </div>
        </div>

        <Button variant="apply" className="w-full mt-2" onClick={handleApply}>{t('filter_btn_apply')}</Button>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
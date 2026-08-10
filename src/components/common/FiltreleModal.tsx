import React, { useState, useMemo } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types/index';
import { getSuggestions } from '../../utils/filterUtils';
import { useTranslation } from '../../context/LanguageContext';

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

  const tabLabelKeyMap = {
    tarih: 'filter_tab_date',
    kategori: 'filter_tab_category',
    odeme: 'filter_tab_payment',
    tutar: 'filter_tab_amount'
  } as const;

  return (
    <BaseModal title={t('filter_modal_title')} onClose={onClose}>
      <div className="flex flex-col space-y-4 font-inter px-4 w-full max-w-md mx-auto">
        
        <div className="relative w-full max-w-[340px] mx-auto">
          <div className="relative h-[40px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CDCDCD]">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-11 pr-4 rounded-[30px] border border-[#CDCDCD] bg-white text-xs"
              placeholder={t('filter_search_placeholder')} 
            />
          </div>
          {searchTerm.length > 0 && suggestions.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 max-h-[150px] overflow-y-auto">
              {suggestions.map((s) => (
              <button 
                key={s} 
                onClick={() => { 
                  setSearchTerm(s);
                  setTimeout(() => {
                    const updatedFilters: FilterState = {
                      ...initialFilters,
                      searchTerm: s,
                      expenseName: s
                    };
                    onApplyFilters(updatedFilters);
                    onClose();
                  }, 0);
                }} 
                className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded"
              >
                {s}
              </button>
            ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-[#333D50] border-b border-gray-100 pb-2">
          {(['tarih', 'kategori', 'odeme', 'tutar'] as Exclude<FilterTab, null>[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(activeTab === tab ? null : tab)} className={`flex items-center justify-center gap-1 py-1 ${activeTab === tab ? 'text-[#7ECCF4]' : ''}`}>
              <span>{t(tabLabelKeyMap[tab])}</span>
              {activeTab === tab ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          ))}
        </div>

        <div className="bg-white/50 border border-dashed border-[#CDCDCD] rounded-xl p-4 min-h-[200px]">
          {activeTab === 'tarih' && (
            <div className="flex flex-col gap-2">
              <input type="text" value={textDate} onChange={handleTextDateChange} placeholder={t('filter_date_placeholder')} className="p-2 border rounded text-xs" />
              <input type="date" className="p-2 border rounded" onChange={handleCalendarChange} />
            </div>
          )}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-2 gap-2 items-stretch">
              {kategoriler.map((kat, index) => {
                const rawCategories: ExpenseCategory[] = [
                  'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
                  'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
                ];
                const rawValue = rawCategories[index];
                return (
                  <button 
                    key={kat} 
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
                <Input placeholder={t('filter_min_placeholder')} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                <Input placeholder={t('filter_max_placeholder')} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
             </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs">
            <span>{t('filter_date_sort_label')}</span>
            <button onClick={() => setDateSort(prev => prev === 'asc' ? 'desc' : 'asc')} className="font-bold bg-gray-100 px-2 py-1 rounded">
              {dateSort === 'asc' ? t('filter_sort_oldest') : t('filter_sort_newest')}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>{t('filter_amount_sort_label')}</span>
            <button onClick={() => setAmountSort(prev => prev === 'asc' ? 'desc' : 'asc')} className="font-bold bg-gray-100 px-2 py-1 rounded">
              {amountSort === 'asc' ? t('filter_sort_low_to_high') : t('filter_sort_high_to_low')}
            </button>
          </div>
        </div>

        <Button variant="apply" className="w-full" onClick={handleApply}>{t('filter_btn_apply')}</Button>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
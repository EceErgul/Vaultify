import React, { useState, useMemo } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { Search, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types/index';
import { getSuggestions } from '../../utils/filterUtils';

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
  const [searchTerm, setSearchTerm] = useState<string>(initialFilters.searchTerm);
  const [textDate, setTextDate] = useState<string>(initialFilters.date);
  const [inputDateValue, setInputDateValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<FilterTab>(null);
  const [minAmount, setMinAmount] = useState<string>(initialFilters.minAmount);
  const [maxAmount, setMaxAmount] = useState<string>(initialFilters.maxAmount);
  const [expenseName, setExpenseName] = useState<string>(initialFilters.expenseName);
  
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(initialFilters.category);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(initialFilters.paymentMethod);

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>(initialFilters.dateSort);
  const [amountSort, setAmountSort] = useState<'asc' | 'desc'>(initialFilters.amountSort);

  const kategoriler: ExpenseCategory[] = [
    'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
    'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
  ];

  const odemeYontemleri: PaymentMethod[] = ['Nakit', 'Kredi Kartı', 'Havale', 'Taksit'];

  const suggestions = useMemo(() => getSuggestions(searchTerm, kategoriler), [searchTerm]);

  const handleTextDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextDate(value);
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      setTextDate(`${day}/${month}/${year}`);
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

  return (
    <BaseModal title="Filtrele" onClose={onClose}>
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
              placeholder="Ara" 
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
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {activeTab === tab ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          ))}
        </div>

        <div className="bg-white/50 border border-dashed border-[#CDCDCD] rounded-xl p-4 min-h-[200px]">
          {activeTab === 'tarih' && (
            <div className="flex flex-col gap-2">
              <input type="text" value={textDate} onChange={handleTextDateChange} placeholder="gg/aa/yyyy" className="p-2 border rounded text-xs" />
              <input type="date" className="p-2 border rounded" onChange={handleCalendarChange} />
            </div>
          )}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-2 gap-2">
              {kategoriler.map(kat => <button key={kat} onClick={() => setSelectedCategory(selectedCategory === kat ? null : kat)} className={`text-xs p-2 rounded ${selectedCategory === kat ? 'bg-[#7ECCF4] text-white' : 'bg-gray-100'}`}>{kat}</button>)}
            </div>
          )}
          {activeTab === 'odeme' && (
             <div className="flex flex-col gap-2">
                {odemeYontemleri.map(y => <button key={y} onClick={() => setSelectedPayment(selectedPayment === y ? null : y)} className={`text-xs p-2 rounded ${selectedPayment === y ? 'bg-[#7ECCF4] text-white' : 'bg-gray-100'}`}>{y}</button>)}
             </div>
          )}
          {activeTab === 'tutar' && (
             <div className="flex flex-col gap-2">
                <Input placeholder="Min" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                <Input placeholder="Max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
             </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs">
            <span>Tarih Sırala:</span>
            <button onClick={() => setDateSort(prev => prev === 'asc' ? 'desc' : 'asc')} className="font-bold bg-gray-100 px-2 py-1 rounded">
              {dateSort === 'asc' ? 'En Eski' : 'En Yeni'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Tutar Sırala:</span>
            <button onClick={() => setAmountSort(prev => prev === 'asc' ? 'desc' : 'asc')} className="font-bold bg-gray-100 px-2 py-1 rounded">
              {amountSort === 'asc' ? 'Düşükten Yükseğe' : 'Yüksekten Düşüğe'}
            </button>
          </div>
        </div>

        <Button variant="apply" className="w-full" onClick={handleApply}>Uygula</Button>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { Search, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types/index';

export interface FilterState {
  searchTerm: string;
  date: string;
  category: ExpenseCategory | null;
  paymentMethod: PaymentMethod | null;
  minAmount: string;
  maxAmount: string;
  expenseName: string;
  dateSort: SortOrder;
  amountSort: SortOrder;
}

interface FiltreleModalProps {
  onClose: () => void;
  setFilterCount: (count: number) => void;
  initialFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

type FilterTab = 'tarih' | 'kategori' | 'odeme' | 'tutar' | null;
type SortOrder = 'asc' | 'desc';

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

  const [dateSort, setDateSort] = useState<SortOrder>(initialFilters.dateSort);
  const [amountSort, setAmountSort] = useState<SortOrder>(initialFilters.amountSort);

  const kategoriler: ExpenseCategory[] = [
    'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
    'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
  ];

  const odemeYontemleri: PaymentMethod[] = [
    'Nakit', 'Kredi Kartı', 'Havale', 'Taksit'
  ];

  const handleTextDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextDate(value);

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);

    if (match) {
      const day = match[1];
      const month = match[2];
      const year = match[3];
      
      const parsedDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(parsedDate.getTime())) {
        setInputDateValue(`${year}-${month}-${day}`);
      }
    }
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setInputDateValue(value);
      const [year, month, day] = value.split('-');
      setTextDate(`${day}/${month}/${year}`);
    } else {
      setInputDateValue('');
      setTextDate('');
    }
  };

  const handleTabToggle = (tab: FilterTab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleApply = () => {
    const updatedFilters: FilterState = {
      searchTerm,
      date: textDate,
      category: selectedCategory,
      paymentMethod: selectedPayment,
      minAmount,
      maxAmount,
      expenseName,
      dateSort,
      amountSort
    };

    let activeCount = 0;
    if (searchTerm.trim() !== '') activeCount++;
    if (textDate.trim() !== '') activeCount++;
    if (selectedCategory !== null) activeCount++;
    if (selectedPayment !== null) activeCount++;
    if (minAmount.trim() !== '' || maxAmount.trim() !== '') activeCount++;
    if (expenseName.trim() !== '') activeCount++;

    setFilterCount(activeCount);
    onApplyFilters(updatedFilters);
    onClose();
  };

  return (
    <BaseModal title="Filtrele" onClose={onClose}>
      <div className="flex flex-col space-y-4 font-inter px-4 w-full max-w-md mx-auto box-border">

        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-[340px] h-[40px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CDCDCD]">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-11 pr-4 rounded-[30px] border border-[#CDCDCD] bg-white text-xs focus:outline-none placeholder:text-[#CDCDCD] placeholder:font-medium shadow-sm"
              placeholder="Ara" 
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 items-center w-full text-[11px] font-bold text-[#333D50] border-b border-gray-100 pb-2">
          <button 
            type="button"
            onClick={() => handleTabToggle('tarih')}
            className={`flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-50 transition-colors ${activeTab === 'tarih' ? 'text-[#7ECCF4]' : ''}`}
          >
            <span>Tarih</span>
            {activeTab === 'tarih' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          <button 
            type="button"
            onClick={() => handleTabToggle('kategori')}
            className={`flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-50 transition-colors ${activeTab === 'kategori' ? 'text-[#7ECCF4]' : ''}`}
          >
            <span>Kategori</span>
            {activeTab === 'kategori' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          <button 
            type="button"
            onClick={() => handleTabToggle('odeme')}
            className={`flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-50 transition-colors ${activeTab === 'odeme' ? 'text-[#7ECCF4]' : ''}`}
          >
            <span>Ödeme</span>
            {activeTab === 'odeme' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          <button 
            type="button"
            onClick={() => handleTabToggle('tutar')}
            className={`flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-50 transition-colors ${activeTab === 'tutar' ? 'text-[#7ECCF4]' : ''}`}
          >
            <span>Tutar</span>
            {activeTab === 'tutar' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>

        <div className="bg-white/50 border border-dashed border-[#CDCDCD] rounded-xl p-4 min-h-[200px] flex items-center justify-center w-full relative">
          
          {!activeTab && (
            <span className="text-gray-400 text-[11px] italic text-center px-4">
              İçeriği görmek için yukarıdaki oklardan birine tıklayın.
            </span>
          )}

          {activeTab === 'tarih' && (
            <div className="w-[200px] h-[175px] bg-white border border-[#CDCDCD] rounded-lg p-2 flex flex-col relative overflow-hidden shadow-sm animate-fadeIn">
              <input 
                type="text"
                value={textDate}
                onChange={handleTextDateChange}
                placeholder="gg/aa/yyyy"
                className="bg-[#CDCDCD]/20 text-[10px] p-1 text-center font-semibold rounded mb-2 focus:outline-none placeholder:text-gray-500"
              />
              
              <label className="flex-1 flex flex-col items-center justify-center text-gray-400 border border-dashed border-[#CDCDCD] rounded cursor-pointer hover:bg-gray-50 transition-colors relative">
                <CalendarIcon size={32} opacity={0.5} className="text-[#333D50]" />
                <span className="text-[10px] mt-2 font-medium text-[#333D50]/80">Takvim</span>

                <input 
                  type="date" 
                  value={inputDateValue}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleCalendarChange}
                  onClick={(e) => {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      try {
                        (e.target as HTMLInputElement).showPicker();
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                />
              </label>
            </div>
          )}

          {activeTab === 'kategori' && (
            <div className="w-full max-w-[240px] max-h-[170px] overflow-y-auto bg-white border border-gray-200 rounded-lg p-1 shadow-sm flex flex-col animate-fadeIn scrollbar-thin">
              {kategoriler.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === kat ? null : kat)}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    selectedCategory === kat 
                      ? 'bg-[#7ECCF4]/20 text-[#333D50] font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'odeme' && (
            <div className="w-full max-w-[240px] max-h-[170px] overflow-y-auto bg-white border border-gray-200 rounded-lg p-1 shadow-sm flex flex-col animate-fadeIn scrollbar-thin">
              {odemeYontemleri.map((yontem) => (
                <button
                  key={yontem}
                  type="button"
                  onClick={() => setSelectedPayment(selectedPayment === yontem ? null : yontem)}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    selectedPayment === yontem 
                      ? 'bg-[#7ECCF4]/20 text-[#333D50] font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {yontem}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'tutar' && (
            <div className="w-full px-2 flex flex-col space-y-3 justify-center animate-fadeIn">
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-[11px] font-semibold w-10 text-[#333D50] shrink-0">Tutar:</span>
                <Input 
                  className="h-7 text-[10px] flex-1 min-w-0" 
                  placeholder="Min tutar" 
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <span className="text-[#CDCDCD] font-bold shrink-0">-</span>
                <Input 
                  className="h-7 text-[10px] flex-1 min-w-0" 
                  placeholder="Max tutar" 
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-[11px] font-semibold w-10 text-[#333D50] shrink-0">Adı:</span>
                <Input 
                  className="h-7 text-[10px] flex-1 min-w-0" 
                  placeholder="Harcama Adı buraya" 
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-[#333D50]/70 space-y-1.5 pt-1 border-t border-gray-100 w-full pl-1">
          <div className="flex items-center gap-1">
            <span>Sırala {">"} Tarih:</span>
            <button
              type="button"
              onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
              className="font-bold text-black hover:text-[#7ECCF4] transition-colors bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
            >
              {dateSort === 'asc' ? 'En Eski - En Yeni' : 'En Yeni - En Eski'}
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <span>Sırala {">"} Tutar:</span>
            <button
              type="button"
              onClick={() => setAmountSort(amountSort === 'asc' ? 'desc' : 'asc')}
              className="font-bold text-black hover:text-[#7ECCF4] transition-colors bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
            >
              {amountSort === 'asc' ? 'En Düşük - En Yüksek' : 'En Yüksek - En Düşük'}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-1 w-full">
          <Button variant="apply" className="w-[100px] h-[32px] text-xs font-semibold" onClick={handleApply}>
            Uygula
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
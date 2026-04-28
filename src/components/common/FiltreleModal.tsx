import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../../types/index';

interface FiltreleModalProps {
  onClose: () => void;
}

const FiltreleModal: React.FC<FiltreleModalProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const kategoriler: ExpenseCategory[] = [
    'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
    'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
  ];

  const odemeYontemleri: PaymentMethod[] = [
    'Nakit', 'kredi Kartı', 'Havale', 'Taksit'
  ];

  return (
    <BaseModal title="Filtrele" onClose={onClose}>
      <div className="flex flex-col space-y-4 font-inter px-2">

        <div className="flex justify-center mb-2">
          <div className="relative w-[330px] h-[45px]">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#CDCDCD]">
              <Search size={20} strokeWidth={2.5} />
            </span>
            <input 
              className="w-full h-full pl-14 pr-4 rounded-[30px] border border-[#CDCDCD] bg-white text-sm focus:outline-none placeholder:text-[#CDCDCD] placeholder:font-medium"
              placeholder="🔎 Ara" //
            />
          </div>
        </div>

        <div className="flex justify-between items-start px-1 text-[11px] font-medium text-[#333D50]">
          <div className="flex flex-col items-center gap-1">Tarih <span className="text-[9px]">v</span></div>
          <div className="flex flex-col items-center gap-1">Harcama Adı <span className="text-[9px]">v</span></div>

          <div className="flex flex-col items-center gap-1">
            <span>Kategori <span className="text-[9px]">v</span></span>
            <div className="w-[115px]">
              <Dropdown options={kategoriler} onSelect={(v) => console.log(v)} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span>Ödeme Yöntemi <span className="text-[9px]">v</span></span>
            <div className="w-[201px]">
              <Dropdown options={odemeYontemleri} onSelect={(v) => console.log(v)} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">Tutar <span className="text-[9px]">v</span></div>
        </div>

        <div className="flex gap-4">
          <div className="w-[180px] h-[180px] bg-white border border-[#CDCDCD] rounded-lg p-2 flex flex-col relative overflow-hidden">
            <input 
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="gg/aa/yyyy"
              className="bg-[#CDCDCD]/30 text-[10px] p-1 text-center rounded mb-2 focus:outline-none placeholder:text-gray-500"
            />
            
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border border-dashed border-[#CDCDCD] rounded cursor-pointer hover:bg-gray-50 transition-colors relative">
              <CalendarIcon size={32} opacity={0.3} />
              <span className="text-[10px] mt-2 text-center">Takvim</span>

              <input 
                type="date" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(date.toLocaleDateString('tr-TR'));
                }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-12">Tutar:</span>
                <Input className="h-7 text-[10px]" placeholder="Min tutar" />
                <span className="text-[#CDCDCD]">-</span>
                <Input className="h-7 text-[10px]" placeholder="Max tutar" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-12">Adı:</span>
                <Input className="h-7 text-[10px]" placeholder="Harcama Adı buraya" />
              </div>
            </div>

            <div className="text-[10px] text-[#333D50]/70 space-y-1">
              <p>Sırala {">"} Tarih: <span className="font-semibold text-black">En Eski - En Yeni</span></p>
              <p className="ml-9">Tutar: <span className="font-semibold text-black">En Eski - En Yeni</span></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 pr-4">
          <Button variant="apply" className="w-[110px] h-[35px] text-sm">
            Uygula
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FiltreleModal;
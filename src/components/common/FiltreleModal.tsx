import React from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { Search, Calendar as CalendarIcon } from 'lucide-react';

const FiltreleModal = ({ onClose }: { onClose: () => void }) => {
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
              placeholder="Ara"
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-1 text-[11px] font-medium text-[#333D50]">
          <div className="flex items-center gap-1">Tarih <span className="text-[9px]">v</span></div>
          <div className="flex items-center gap-1">Harcama Adı <span className="text-[9px]">v</span></div>
          <div className="flex items-center gap-1">Kategori <span className="text-[9px]">v</span></div>
          <div className="flex items-center gap-1">Ödeme Yöntemi <span className="text-[9px]">v</span></div>
          <div className="flex items-center gap-1">Tutar <span className="text-[9px]">v</span></div>
        </div>

        <div className="flex gap-4">
          <div className="w-[180px] h-[180px] bg-white border border-[#CDCDCD] rounded-lg p-2 flex flex-col">
            <div className="bg-[#CDCDCD]/30 text-[10px] p-1 text-center rounded mb-2">
              Tarih yazma yeri (gg/aa/yyyy)
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border border-dashed border-[#CDCDCD] rounded">
              <CalendarIcon size={32} opacity={0.3} />
              <span className="text-[10px] mt-2 text-center">Takvim Görünümü</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-12">Tutar:</span>
                <Input className="h-7 text-[10px]" placeholder="Min" />
                <span className="text-[#CDCDCD]">-</span>
                <Input className="h-7 text-[10px]" placeholder="Max" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-12">Adı:</span>
                <Input className="h-7 text-[10px]" placeholder="Harcama adı..." />
              </div>
            </div>

            <div className="text-[10px] text-[#333D50]/70 space-y-1">
              <p>Sırala {">"} Tarih: <span className="font-semibold text-black">En Eski - En Yeni</span></p>
              <p className="ml-9">Tutar: <span className="font-semibold text-black">En Düşük - En Yüksek</span></p>
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
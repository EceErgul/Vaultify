import React from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { IncomeSource } from '../../types/index';

interface GelirModalProps {
  onClose: () => void;
  initialData?: {
    date?: string;
    name?: string;
    category?: IncomeSource;
    amount?: number;
  };
}

export const GelirEkleModal: React.FC<GelirModalProps> = ({ onClose }) => {
  const gelirKategorileri: IncomeSource[] = [
    'Maaş', 
    'Kira Geliri', 
    'Varlıklarım', 
    'İkramiye/Prim', 
    'Ek İş', 
    'Miras', 
    'Devlet Desteği', 
    'Diğer'
  ];

  return (
    <BaseModal title="Gelir Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input placeholder="Gelir adı" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <Dropdown 
          options={gelirKategorileri} 
          onSelect={(v) => console.log(v)} 
          placeholder="Dropdown Menüsü" 
        />

        <label className="font-medium text-sm text-[#333D50]">Miktar:</label>
        <Input type="number" placeholder="Gelir Miktarı" />

      </div>

      <div className="mt-10 flex justify-end pr-10 pb-2">
        <Button variant="add" className="w-[140px]">
          + Ekle
        </Button>
      </div>
    </BaseModal>
  );
};

export const GelirDuzenleModal: React.FC<GelirModalProps> = ({ onClose, initialData }) => {
  const gelirKategorileri: IncomeSource[] = [
    'Maaş', 
    'Kira Geliri', 
    'Varlıklarım', 
    'İkramiye/Prim', 
    'Ek İş', 
    'Miras', 
    'Devlet Desteği', 
    'Diğer'
  ];

  return (
    <BaseModal title="Gelir Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input defaultValue={initialData?.date} placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input defaultValue={initialData?.name} placeholder="Gelir adı buraya" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <Dropdown 
          options={gelirKategorileri} 
          onSelect={(v) => console.log(v)} 
          placeholder={initialData?.category || "Dropdown Menüsü"} 
        />

        <label className="font-medium text-sm text-[#333D50]">Miktar:</label>
        <Input type="number" defaultValue={initialData?.amount} placeholder="Gelir Miktarı" />

      </div>

      <div className="mt-10 flex justify-end pr-10 pb-2">
        <Button variant="apply" className="w-[140px]">
          Uygula
        </Button>
      </div>
    </BaseModal>
  );
};
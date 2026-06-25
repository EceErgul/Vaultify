import React from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { IncomeSource } from '../../types/index';

interface GelirModalProps {
  onClose: () => void;
  initialData?: {
    id?: string; // İsteğe bağlı (optional) yaparak TypeScript hatasını çözdük
    date?: string;
    name?: string;
    category?: IncomeSource;
    amount?: number;
  };
}

const GELIR_KATEGORILERI: IncomeSource[] = [
  'Maaş', 
  'Kira Geliri', 
  'Varlıklarım', 
  'İkramiye/Prim', 
  'Ek İş', 
  'Miras', 
  'Devlet Desteği', 
  'Diğer'
];

export const GelirEkleModal: React.FC<GelirModalProps> = ({ onClose }) => {
  return (
    <BaseModal title="Gelir Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input placeholder="Gelir adı" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        {/* max-h ve overflow ayarlarıyla aşağı kaydırılabilir stabil dropdown yapısı */}
        <div className="relative max-h-[200px]">
          <Dropdown 
            options={GELIR_KATEGORILERI} 
            onSelect={(v) => console.log(v)} 
            placeholder="Kategori Seçin" 
          />
        </div>

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
  return (
    <BaseModal title="Gelir Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input defaultValue={initialData?.date} placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input defaultValue={initialData?.name} placeholder="Gelir adı buraya" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <div className="relative max-h-[200px]">
          <Dropdown 
            options={GELIR_KATEGORILERI} 
            onSelect={(v) => console.log(v)} 
            placeholder={initialData?.category || "Kategori Seçin"} 
          />
        </div>

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
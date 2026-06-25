import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { ExpenseCategory, PaymentMethod } from '../../types/index';

interface HarcamaEkleModalProps {
  onClose: () => void;
}

const KATEGORILER: ExpenseCategory[] = [
  'Ev Alışverişi',
  'Market Alışverişi',
  'Kira',
  'Eğlence',
  'Ulaşım',
  'Taksitler',
  'Borçlar',
  'Faturalar',
  'Sağlık',
  'Diğer'
];

const ODEME_YONTEMLERI: PaymentMethod[] = [
  'Nakit',
  'Kredi Kartı',
  'Havale',
  'Taksit'
];

const HarcamaEkleModal: React.FC<HarcamaEkleModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<number | ''>('');

  return (
    <BaseModal title="Harcama Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">

        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input type="text" placeholder="gün/ay/yıl" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <div className="relative max-h-[200px]">
          <Dropdown 
            options={KATEGORILER} 
            onSelect={(v) => console.log(v)} 
            placeholder="Kategori Seçin"
          />
        </div>

        <label className="font-medium text-sm text-[#333D50]">Harcama Adı:</label>
        <Input placeholder="Buraya Yazılacak" />

       integrity  <label className="font-medium text-sm text-[#333D50]">Ödeme:</label>
        <div className="relative max-h-[200px]">
          <Dropdown 
            options={ODEME_YONTEMLERI} 
            onSelect={(v) => console.log(v)} 
            placeholder="Ödeme Yöntemi Seçin"
          />
        </div>

        <label className="font-medium text-sm text-[#333D50]">Tutar:</label>
        <Input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="ödeme tutarı" 
        />
      </div>

      <div className="mt-10 flex justify-end pr-6 pb-2">
        <Button variant="add" className="w-[140px]">
          + Ekle
        </Button>
      </div>
    </BaseModal>
  );
};

export default HarcamaEkleModal;
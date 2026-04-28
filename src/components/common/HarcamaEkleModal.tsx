import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { ExpenseCategory, PaymentMethod } from '../../types/index';

interface HarcamaEkleModalProps {
  onClose: () => void;
}

const HarcamaEkleModal: React.FC<HarcamaEkleModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<number | ''>('');

  const kategoriler: ExpenseCategory[] = [
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

  const odemeYontemleri: PaymentMethod[] = [
    'Nakit',
    'kredi Kartı',
    'Havale',
    'Taksit'
  ];

  return (
    <BaseModal title="Harcama Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">

        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input type="text" placeholder="gün/ay/yıl" />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <Dropdown 
          options={kategoriler} 
          onSelect={(v) => console.log(v)} 
          placeholder="Dropdown Seçimi"
        />

        <label className="font-medium text-sm text-[#333D50]">Harcama Adı:</label>
        <Input placeholder="Buraya Yazılacak" />

        <label className="font-medium text-sm text-[#333D50]">Ödeme:</label>
        <Dropdown 
          options={odemeYontemleri} 
          onSelect={(v) => console.log(v)} 
          placeholder="Kredi Kartı, Havale vb."
        />

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
import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';

interface VarlikAyrintisiDuzenleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; amount: string; price: string }) => Promise<void>;
  initialData?: {
    date?: string;
    amount?: string;
    price?: string;
  };
}

const VarlikAyrintisiDuzenle: React.FC<VarlikAyrintisiDuzenleProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [date, setDate] = useState(initialData?.date || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length >= 5) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setDate(value);
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const parts = date.split('/');
      const isoDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;

      await onSave({ date: isoDate, amount, price });
      onClose();
    } catch (error) {
      console.error("Kaydetme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title="Varlık Ayrıntısı Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[140px_1fr] items-center gap-y-6 font-inter pr-4 mt-4">
        <label className="font-bold text-lg text-black">Alış Tarihi:</label>
        <Input 
          value={date} 
          onChange={handleDateChange}
          placeholder="gg/aa/yyyy" 
          className="h-10 text-sm"
        />

        <label className="font-bold text-lg text-black">Miktar:</label>
        <Input 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          placeholder="ne kadar alındı?" 
          className="h-10 text-sm"
        />

        <label className="font-bold text-lg text-black">Alış Fiyatı:</label>
        <Input 
          value={price} 
          onChange={(e) => setPrice(e.target.value)}
          placeholder="miktarın alış fiyatı" 
          className="h-10 text-sm"
        />
      </div>

      <div className="mt-12 flex justify-end pr-10 pb-4">
        <Button 
          variant="apply" 
          className="w-[140px] h-[40px] text-base font-medium shadow-sm"
          onClick={handleApply}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Uygula'}
        </Button>
      </div>
    </BaseModal>
  );
};

export default VarlikAyrintisiDuzenle;
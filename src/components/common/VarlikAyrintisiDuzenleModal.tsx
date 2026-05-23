import React from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';

interface VarlikAyrintisiDuzenleProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    date?: string;
    amount?: string;
    price?: string;
  };
}

const VarlikAyrintisiDuzenle: React.FC<VarlikAyrintisiDuzenleProps> = ({ isOpen, onClose, initialData }) => {

  if (!isOpen) return null;

  return (
    <BaseModal title="Varlık Ayrıntısı Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[140px_1fr] items-center gap-y-6 font-inter pr-4 mt-4">

        <label className="font-bold text-lg text-black">Alış Tarihi:</label>
        <Input 
          defaultValue={initialData?.date} 
          placeholder="gün/ay/yıl" 
          className="h-10 text-sm"
        />

        <label className="font-bold text-lg text-black">Miktar:</label>
        <Input 
          defaultValue={initialData?.amount} 
          placeholder="ne kadar alındı?" 
          className="h-10 text-sm"
        />

        <label className="font-bold text-lg text-black">Alış Fiyatı:</label>
        <Input 
          defaultValue={initialData?.price} 
          placeholder="miktarın alış fiyatı" 
          className="h-10 text-sm"
        />

      </div>

      <div className="mt-12 flex justify-end pr-10 pb-4">
        <Button 
          variant="apply" 
          className="w-[140px] h-[40px] text-base font-medium shadow-sm"
          onClick={onClose}
        >
          Uygula
        </Button>
      </div>
    </BaseModal>
  );
};

export default VarlikAyrintisiDuzenle;
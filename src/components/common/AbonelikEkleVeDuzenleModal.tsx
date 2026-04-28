import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';

interface AbonelikModalProps {
  onClose: () => void;
  initialData?: {
    name?: string;
    payDay?: string;
    price?: string;
    startDate?: string;
    isTrial?: boolean;
  };
}

const TrialCheckbox = ({ active }: { active: boolean }) => (
  <div className="w-[50px] h-[50px] bg-[#EAEAEA] border border-black rounded-[6px] relative flex items-center justify-center cursor-pointer">
    {active && (
      <div className="absolute inset-0 p-2">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-black stroke-[4px]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      </div>
    )}
  </div>
);

export const AbonelikEkleModal: React.FC<AbonelikModalProps> = ({ onClose }) => {
  const [isTrial, setIsTrial] = useState(false);

  return (
    <BaseModal title="Abonelik Ekle" onClose={onClose}>
      <div className="grid grid-cols-[160px_1fr] items-center gap-y-4 font-inter pr-4 mt-2">
        
        <label className="font-bold text-lg">Abonelik Adı:</label>
        <Input placeholder="netflix, amazon prime vb." />

        <label className="font-bold text-lg">Ödeme Günü:</label>
        <Input placeholder="ayın kaçında ödeniyor?" />

        <label className="font-bold text-lg">Fiyat:</label>
        <Input placeholder="Abonelik fiyatı" />

        <label className="font-bold text-lg leading-tight">
          Abonelik<br />Başlangıcı:
        </label>
        <Input placeholder="Toplam harcanan para" />

        <label className="font-bold text-lg leading-tight">
          Deneme<br />Sürümü:
        </label>
        <div onClick={() => setIsTrial(!isTrial)}>
          <TrialCheckbox active={isTrial} />
        </div>

      </div>

      <div className="mt-8 flex justify-end pr-8 pb-4">
        <Button variant="add" className="w-[160px] h-[45px] shadow-md">
          + Ekle
        </Button>
      </div>
    </BaseModal>
  );
};

export const AbonelikDuzenleModal: React.FC<AbonelikModalProps> = ({ onClose, initialData }) => {
  const [isTrial, setIsTrial] = useState(initialData?.isTrial || false);

  return (
    <BaseModal title="Abonelik Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[160px_1fr] items-center gap-y-4 font-inter pr-4 mt-2">
        
        <label className="font-bold text-lg">Abonelik Adı:</label>
        <Input defaultValue={initialData?.name} placeholder="netflix, amazon prime vb." />

        <label className="font-bold text-lg">Ödeme Günü:</label>
        <Input defaultValue={initialData?.payDay} placeholder="ayın kaçında ödeniyor?" />

        <label className="font-bold text-lg">Fiyat:</label>
        <Input defaultValue={initialData?.price} placeholder="Abonelik fiyatı" />

        <label className="font-bold text-lg leading-tight">
          Abonelik<br />Başlangıcı:
        </label>
        <Input defaultValue={initialData?.startDate} placeholder="Başlangıç Günü" />

        <label className="font-bold text-lg leading-tight">
          Deneme<br />Sürümü:
        </label>
        <div onClick={() => setIsTrial(!isTrial)}>
          <TrialCheckbox active={isTrial} />
        </div>

      </div>

      <div className="mt-8 flex justify-end pr-8 pb-4">
        <Button variant="apply" className="w-[160px] h-[45px] shadow-md">
          Uygula
        </Button>
      </div>
    </BaseModal>
  );
};
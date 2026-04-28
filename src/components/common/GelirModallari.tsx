import React from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';

export const GelirEkleModal = ({ onClose }: { onClose: () => void }) => {
  const gelirKategorileri = [
    'Maaş', 'İkramiye / Prim', 'Ek iş', 'Kira', 'Miras', 'Devlet Desteği', 'Diğer'
  ];

  return (
    <BaseModal title="Gelir Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm">Tarih:</label>
        <Input placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm">Gelir Adı:</label>
        <Input placeholder="Gelir adı buraya" />

        <label className="font-medium text-sm">Kategori:</label>
        <Dropdown options={gelirKategorileri} onSelect={(v) => console.log(v)} placeholder="Dropdown Menüsü" />

        <label className="font-medium text-sm">Miktar:</label>
        <Input type="number" placeholder="Gelir Miktarı" />

      </div>

      <div className="mt-10 flex justify-end pr-10">
        <Button variant="add" className="w-[140px]">+ Ekle</Button>
      </div>
    </BaseModal>
  );
};

export const GelirDuzenleModal = ({ onClose, initialData }: { onClose: () => void, initialData?: any }) => {
  const gelirKategorileri = [
    'Maaş', 'İkramiye / Prim', 'Ek iş', 'Kira', 'Miras', 'Devlet Desteği', 'Diğer'
  ];

  return (
    <BaseModal title="Gelir Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="font-medium text-sm">Tarih:</label>
        <Input defaultValue={initialData?.date} placeholder="Gelirin Alındığı Tarih" />

        <label className="font-medium text-sm">Gelir Adı:</label>
        <Input defaultValue={initialData?.name} placeholder="Gelir adı buraya" />

        <label className="font-medium text-sm">Kategori:</label>
        <Dropdown 
          options={gelirKategorileri} 
          onSelect={(v) => console.log(v)} 
          placeholder={initialData?.category || "Dropdown Menüsü"} 
        />

        <label className="font-medium text-sm">Miktar:</label>
        <Input type="number" defaultValue={initialData?.amount} placeholder="Gelir Miktarı" />

      </div>

      <div className="mt-10 flex justify-end pr-10">
        <Button variant="apply" className="w-[140px]">Uygula</Button>
      </div>
    </BaseModal>
  );
};
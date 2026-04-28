import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { AssetsType } from '../../types/index';

interface VarlikEkleModalProps {
  onClose: () => void;
}

const VarlikEkleModal: React.FC<VarlikEkleModalProps> = ({ onClose }) => {
  const [assetName, setAssetName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AssetsType>('Borsa');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const assetTypeOptions: AssetsType[] = ['Borsa', 'Döviz', 'Altın', 'Kripto', 'Teemmü'];

  useEffect(() => {
    setTotal(amount * price);
  }, [amount, price]);

  const handleAdd = () => {
    console.log({
      asset_name: assetName,
      asset_type: selectedType,
      total_quantity: amount,
      total_cost: total
    });
    onClose();
  };

  return (
    <BaseModal title="Varlık Ekle" onClose={onClose}>
      <div className="grid grid-cols-[100px_1fr] items-center gap-y-5 font-inter pr-2">
        
        <label className="text-sm font-medium text-[#333D50]">Varlık:</label>
        <Input 
          placeholder="Varlık (altın, gümüş, hisse vb.) buraya girilecek" 
          onChange={(e) => setAssetName(e.target.value)}
        />

        <label className="text-sm font-medium text-[#333D50]">Tür:</label>
        <Dropdown 
          options={assetTypeOptions} 
          onSelect={(v) => setSelectedType(v as AssetsType)} 
          placeholder="Tür Seçiniz"
        />

        <label className="text-sm font-medium text-[#333D50]">Miktar:</label>
        <Input 
          type="number" 
          onChange={(e) => setAmount(Number(e.target.value))} 
          placeholder="Alınan miktar" 
        />

        <label className="text-sm font-medium text-[#333D50]">Fiyat:</label>
        <Input 
          type="number" 
          onChange={(e) => setPrice(Number(e.target.value))} 
          placeholder="Birim fiyat" 
        />

        <label className="text-sm font-medium text-[#333D50]">Toplam:</label>
        <Input 
          isTotal 
          value={total > 0 ? `${total.toLocaleString()} ₺` : "miktar ve fiyata göre otomatik hesaplanacak"} 
        />
      </div>

      <div className="mt-12 flex justify-end pr-8"> 
         <Button 
           variant="add" 
           onClick={handleAdd}
           className="w-[120px]"
         >
           + Ekle
         </Button>
      </div>
    </BaseModal>
  );
};

export default VarlikEkleModal;
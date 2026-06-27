import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { AssetsType } from '../../types/index';
import { apiRequest } from '../../utils/api';

interface VarlikEkleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded?: (asset: any) => void;
}

const VarlikEkleModal: React.FC<VarlikEkleModalProps> = ({ isOpen, onClose, onAssetAdded }) => {
  const [assetName, setAssetName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AssetsType>('Borsa');
  const [date, setDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const assetTypeOptions: AssetsType[] = ['Borsa', 'Döviz', 'Altın', 'Kripto', 'Teemmü'];

  useEffect(() => {
    setTotal(amount * price);
  }, [amount, price]);

  if (!isOpen) return null;

  const resetForm = () => {
    setAssetName('');
    setDate('');
    setAmount(0);
    setPrice(0);
    setTotal(0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setDate(value);
  };

  const handleAdd = async () => {
    if (!assetName.trim() || !date) {
      alert("Lütfen varlık adını ve tarihi giriniz.");
      return;
    }

    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      setLoading(true);

      const createdAsset = await apiRequest('/assets', {
        method: 'POST',
        body: {
          asset_name: assetName,
          asset_type: selectedType,
          date: formattedDate,
          total_quantity: amount,
          total_cost: total
        }
      });

      if (createdAsset) {
        onAssetAdded?.(createdAsset);
      }

      resetForm();
      onClose(); 
    } catch (error) {
      console.error("Varlık eklenirken bir hata oluştu:", error);
      alert("Varlık eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title="Varlık Ekle" onClose={onClose}>
      <div className="grid grid-cols-[100px_1fr] items-center gap-y-5 font-inter pr-2">
        
        <label className="text-sm font-medium text-[#333D50]">Tarih:</label>
        <Input 
          type="text"
          placeholder="GG/AA/YYYY" 
          value={date}
          onChange={handleDateChange}
          maxLength={10}
          disabled={loading}
        />

        <label className="text-sm font-medium text-[#333D50]">Varlık:</label>
        <Input 
          placeholder="Varlık adı (örn: Altın)" 
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          disabled={loading}
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
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))} 
          placeholder="Alınan miktar" 
          disabled={loading}
        />

        <label className="text-sm font-medium text-[#333D50]">Fiyat:</label>
        <Input 
          type="number" 
          value={price || ''}
          onChange={(e) => setPrice(Number(e.target.value))} 
          placeholder="Birim fiyat" 
          disabled={loading}
        />
      </div>

      <div className="mt-12 flex justify-end pr-8"> 
         <Button 
           variant="add" 
           onClick={handleAdd}
           className="w-[120px]"
           disabled={loading}
         >
           {loading ? 'Ekleniyor...' : '+ Ekle'}
         </Button>
      </div>
    </BaseModal>
  );
};

export default VarlikEkleModal;
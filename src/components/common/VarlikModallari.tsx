import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { AssetsType } from '../../types/index';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface VarlikModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  initialData?: {
    date?: string;
    assetName?: string;
    assetType?: AssetsType;
    amount?: string | number;
    price?: string | number;
  };
  onSave: (data: any) => Promise<void>;
}

const VarlikModallari: React.FC<VarlikModalProps> = ({ 
  isOpen, 
  onClose, 
  mode = 'add', 
  initialData, 
  onSave 
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [assetName, setAssetName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const assetTypeOptions = [
    t('asset_type_stock'),
    t('asset_type_currency'),
    t('asset_type_gold'),
    t('asset_type_crypto'),
    t('asset_type_other')
  ];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setDate(initialData.date || '');
        setAssetName(initialData.assetName || '');
        setSelectedType(initialData.assetType || '');
        setAmount(initialData.amount ? String(initialData.amount) : '');
        setPrice(initialData.price ? String(initialData.price) : '');
      } else {
        setDate('');
        setAssetName('');
        setSelectedType(t('asset_type_stock'));
        setAmount('');
        setPrice('');
      }
    }
  }, [isOpen, mode, initialData, t]);

  if (!isOpen) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (mode === 'edit') {
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length >= 5) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
      } else if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    } else {
      if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
      else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
      if (value.length > 10) value = value.slice(0, 10);
    }
    setDate(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const parts = date.split('/');
      const isoDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;

      await onSave({
        date: isoDate,
        asset_name: assetName,
        asset_type: selectedType,
        amount,
        price,
      });

      onClose();
    } catch (error) {
      console.error("İşlem hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <BaseModal title={isEdit ? t('asset_modal_title_edit') : t('asset_modal_title_add')} onClose={onClose}>
      <div className="grid grid-cols-[65px_1fr] sm:grid-cols-[100px_1fr] items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-2">
        
        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('asset_label_date')}</label>
        <Input 
          type="text"
          placeholder={t('asset_date_placeholder')} 
          value={date}
          onChange={handleDateChange}
          maxLength={10}
          disabled={loading}
        />

        {!isEdit && (
          <>
            <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('asset_label_name')}</label>
            <Input 
              placeholder={t('asset_name_placeholder')}
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              disabled={loading}
            />

            <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('asset_label_type')}</label>
            <Dropdown 
              options={assetTypeOptions}
              onSelect={(v) => setSelectedType(v as AssetsType)}
              placeholder={t('asset_type_placeholder')} 
              value={selectedType}
            />
          </>
        )}

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('asset_label_amount')}</label>
        <Input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)} 
          placeholder={t('asset_amount_placeholder')} 
          disabled={loading}
        />

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('asset_label_price')}</label>
        <div className="relative w-full">
          <Input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)} 
            placeholder={t('asset_price_placeholder')}
            disabled={loading}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2 col-span-2">
           <Button 
            variant={isEdit ? "apply" : "add"} 
            onClick={handleSubmit}
            className="w-[120px] sm:w-[140px] text-xs sm:text-sm"
            disabled={loading}
           >
            {loading ? t('asset_btn_loading') : (isEdit ? t('asset_btn_apply') : t('asset_btn_add'))}
           </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default VarlikModallari;
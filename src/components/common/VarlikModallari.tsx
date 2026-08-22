import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { AssetsType, CurrencyPreference } from '../../types/index';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatToDisplayDate, parseDisplayDateToISO, maskDateInput } from '../../utils/dateUtils';

interface VarlikModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  initialData?: {
    id?: string | number;
    date?: string;
    assetName?: string;
    assetType?: AssetsType;
    amount?: number | '';
    price?: number | '';
  };
  onSave: (data: any) => Promise<void>;
}

const currencySymbols: Record<CurrencyPreference, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const useAssetTypes = () => {
  const { t } = useTranslation();
  return [
    { label: t('asset_type_stock') || 'Borsa', value: 'Borsa' as AssetsType },
    { label: t('asset_type_currency') || 'Döviz', value: 'Döviz' as AssetsType },
    { label: t('asset_type_crypto') || 'Kripto', value: 'Kripto' as AssetsType },
    { label: t('asset_type_commodity') || 'Emtia', value: 'Emtia' as AssetsType },
    { label: t('asset_type_interest') || 'Faiz', value: 'Faiz' as AssetsType },
    { label: t('asset_type_other') || 'Diğer', value: 'Diğer' as AssetsType },
  ];
};

const VarlikModallari: React.FC<VarlikModalProps> = ({ 
  isOpen, 
  onClose, 
  mode = 'add', 
  initialData, 
  onSave 
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const assetTypes = useAssetTypes();

  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';

  const [date, setDate] = useState('');
  const [assetName, setAssetName] = useState('');
  const [selectedType, setSelectedType] = useState<AssetsType | ''>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setDate(formatToDisplayDate(initialData.date));
        setAssetName(initialData.assetName || '');
        setSelectedType(initialData.assetType || '');
        setAmount(initialData.amount ?? '');
        setPrice(initialData.price ?? '');
      } else {
        setDate('');
        setAssetName('');
        setSelectedType('');
        setAmount('');
        setPrice('');
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(maskDateInput(e.target.value));
  };

  const handleSubmit = async () => {
    if (!assetName.trim() || !date || !selectedType || amount === '' || price === '') {
      alert(t('exp_alert_missing_fields') || 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        date: parseDisplayDateToISO(date),
        asset_name: assetName,
        asset_type: selectedType,
        amount: Number(amount),
        price: Number(price),
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
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-4">
        
        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('asset_label_date')}</label>
        <Input 
          type="text"
          placeholder={t('asset_date_placeholder')} 
          value={date}
          onChange={handleDateChange}
          maxLength={10}
          disabled={loading}
        />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('asset_label_name')}</label>
        <Input 
          placeholder={t('asset_name_placeholder')}
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          disabled={loading || isEdit}
        />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('asset_label_type')}</label>
        <div className={`relative z-20 w-full ${isEdit ? 'pointer-events-none opacity-60' : ''}`}>
          <Dropdown 
            options={assetTypes.map(at => at.label)}
            onSelect={(label) => {
              if (isEdit) return;
              const matched = assetTypes.find(at => at.label === label);
              if (matched) setSelectedType(matched.value);
            }}
            placeholder={t('asset_type_placeholder')} 
            value={assetTypes.find(at => at.value === selectedType)?.label || ''}
          />
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('asset_label_amount')}</label>
        <Input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
          placeholder={t('asset_amount_placeholder')} 
          disabled={loading}
        />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('asset_label_price')}</label>
        <div className="relative w-full">
          <Input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} 
            placeholder={t('asset_price_placeholder')}
            disabled={loading}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>
      </div>

      <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2">
        <Button 
          variant={isEdit ? "apply" : "add"} 
          onClick={handleSubmit}
          className="w-full sm:w-[140px] text-xs sm:text-sm"
          disabled={loading}
        >
          {loading ? t('asset_btn_loading') : (isEdit ? t('asset_btn_apply') : t('asset_btn_add'))}
        </Button>
      </div>
    </BaseModal>
  );
};

export default VarlikModallari;
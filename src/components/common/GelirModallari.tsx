import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { IncomeSource } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';

interface GelirModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    date?: string;
    name?: string;
    category?: IncomeSource;
    amount?: number;
  };
}

const formatToDisplayDate = (isoDate?: string) => {
  if (!isoDate) return '';
  const dateObj = new Date(isoDate);
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
};

export const GelirEkleModal: React.FC<GelirModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const gelirKategorileri = [
    t('cat_salary'),
    t('cat_rent'),
    t('cat_assets'),
    t('cat_bonus'),
    t('cat_side_job'),
    t('cat_inheritance'),
    t('cat_government'),
    t('cat_other')
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setDate(value);
  };

  const handleAdd = async () => {
    const [d, m, y] = date.split('/');
    const isoDate = `${y}-${m}-${d}`;

    try {
      setLoading(true);
      await apiRequest('/incomes', {
        method: 'POST',
        body: { date: isoDate, income_name: name, income_category: category, income_amount: amount }
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={t('income_add_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-4">
        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_date')}</label>
        <Input placeholder={t('income_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_name')}</label>
        <Input placeholder={t('income_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_category')}</label>
        <div className="relative w-full z-[999]">
          <Dropdown 
            options={gelirKategorileri}
            value={category}
            onSelect={(v) => setCategory(v)}
            placeholder={t('placeholder_select')} 
          />
        </div>

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_amount')}</label>
        <Input type="number" placeholder={t('income_amount_placeholder')} value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2">
        <Button variant="add" className="w-full sm:w-[140px] text-xs sm:text-sm" onClick={handleAdd} disabled={loading}>
          {loading ? t('income_btn_adding') : t('income_btn_add')}
        </Button>
      </div>
    </BaseModal>
  );
};

export const GelirDuzenleModal: React.FC<GelirModalProps> = ({ onClose, initialData, onSuccess }) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(formatToDisplayDate(initialData?.date));
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [loading, setLoading] = useState(false);

  const gelirKategorileri = [
    t('cat_salary'),
    t('cat_rent'),
    t('cat_assets'),
    t('cat_bonus'),
    t('cat_side_job'),
    t('cat_inheritance'),
    t('cat_government'),
    t('cat_other')
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setDate(value);
  };

  const handleUpdate = async () => {
    const [d, m, y] = date.split('/');
    const isoDate = `${y}-${m}-${d}`;

    try {
      setLoading(true);
      await apiRequest(`/incomes/${initialData?.id}`, {
        method: 'PUT',
        body: { date: isoDate, income_name: name, income_category: category, income_amount: amount }
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={t('income_edit_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-4">
        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_date')}</label>
        <Input placeholder={t('income_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_name')}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_category')}</label>
        <div className="relative w-full z-[999]">
          <Dropdown 
            options={gelirKategorileri} 
            value={category} 
            onSelect={(v) => setCategory(v)} 
            placeholder={t('placeholder_select')} 
          />
        </div>

        <label className="font-medium text-xs sm:text-sm text-[#333D50]">{t('income_label_amount')}</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2">
        <Button variant="apply" className="w-full sm:w-[140px] text-xs sm:text-sm" onClick={handleUpdate} disabled={loading}>
          {loading ? t('income_btn_updating') : t('income_btn_apply')}
        </Button>
      </div>
    </BaseModal>
  );
};
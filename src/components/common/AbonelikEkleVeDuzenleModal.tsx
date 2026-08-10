import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface AbonelikModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    payDay?: string;
    price?: string;
    startDate?: string;
    isTrial?: boolean;
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

const TrialCheckbox = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <div 
    className="w-[50px] h-[50px] bg-[#EAEAEA] border border-black rounded-[6px] relative flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
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

export const AbonelikEkleModal: React.FC<AbonelikModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [name, setName] = useState('');
  const [payDay, setPayDay] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setStartDate(value);
  };

  const handleAdd = async () => {
    const [d, m, y] = startDate.split('/');
    const isoDate = `${y}-${m}-${d}`;

    try {
      setLoading(true);
      await apiRequest('/subscriptions', {
        method: 'POST',
        body: { 
          subscription_name: name,
          cost: Number(price),
          payment_day: payDay,
          start_date: isoDate,
          is_trial: isTrial
        }
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
    <BaseModal title={t('sub_modal_add_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-4 px-2 sm:pr-4 mt-2">
        <label className="font-medium text-base sm:text-lg">{t('sub_name_label')}</label>
        <Input placeholder={t('sub_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-base sm:text-lg">{t('sub_payday_label')}</label>
        <Input placeholder={t('sub_payday_placeholder')} value={payDay} onChange={(e) => setPayDay(e.target.value)} />

        <label className="font-medium text-base sm:text-lg">{t('sub_price_label')}</label>
        <div className="relative w-full">
          <Input placeholder={t('sub_price_placeholder')} value={price} onChange={(e) => setPrice(e.target.value)} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="font-medium text-base sm:text-lg leading-tight whitespace-pre-line">
          {t('sub_start_date_label')}
        </label>
        <Input placeholder={t('sub_date_placeholder')} value={startDate} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-base sm:text-lg leading-tight whitespace-pre-line">
          {t('sub_trial_label')}
        </label>
        <TrialCheckbox active={isTrial} onClick={() => setIsTrial(!isTrial)} />
      </div>

      <div className="mt-6 flex justify-end px-2 sm:pr-8 pb-2">
        <Button variant="add" className="w-full sm:w-[160px] h-[45px] shadow-md" onClick={handleAdd} disabled={loading}>
          {loading ? t('sub_btn_adding') : t('sub_btn_add')}
        </Button>
      </div>
    </BaseModal>
  );
};

export const AbonelikDuzenleModal: React.FC<AbonelikModalProps> = ({ onClose, initialData, onSuccess }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [name, setName] = useState(initialData?.name || '');
  const [payDay, setPayDay] = useState(initialData?.payDay || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [startDate, setStartDate] = useState(formatToDisplayDate(initialData?.startDate));
  const [isTrial, setIsTrial] = useState(initialData?.isTrial || false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setStartDate(value);
  };

  const handleUpdate = async () => {
    if (!initialData?.id) {
      console.error("HATA: Düzenlenecek abonelik ID'si bulunamadı!", initialData);
      alert(t('sub_error_id_missing'));
      return;
    }

    const [d, m, y] = startDate.split('/');
    const isoDate = `${y}-${m}-${d}`;

    try {
      setLoading(true);
      await apiRequest(`/subscriptions/${initialData.id}`, {
        method: 'PUT',
        body: { 
          subscription_name: name,
          cost: Number(price),
          payment_day: payDay,
          start_date: isoDate,
          is_trial: isTrial
        }
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
    <BaseModal title={t('sub_modal_edit_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-4 px-2 sm:pr-4 mt-2">
        <label className="font-medium text-base sm:text-lg">{t('sub_name_label')}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-base sm:text-lg">{t('sub_payday_label')}</label>
        <Input value={payDay} onChange={(e) => setPayDay(e.target.value)} />

        <label className="font-medium text-base sm:text-lg">{t('sub_price_label')}</label>
        <div className="relative w-full">
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="font-medium text-base sm:text-lg leading-tight whitespace-pre-line">
          {t('sub_start_date_label')}
        </label>
        <Input value={startDate} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-base sm:text-lg leading-tight whitespace-pre-line">
          {t('sub_trial_label')}
        </label>
        <TrialCheckbox active={isTrial} onClick={() => setIsTrial(!isTrial)} />
      </div>

      <div className="mt-6 flex justify-end px-2 sm:pr-8 pb-2">
        <Button variant="apply" className="w-full sm:w-[160px] h-[45px] shadow-md" onClick={handleUpdate} disabled={loading}>
          {loading ? t('sub_btn_updating') : t('sub_btn_apply')}
        </Button>
      </div>
    </BaseModal>
  );
};
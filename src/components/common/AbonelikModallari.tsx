import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import TrialCheckbox from './TrialCheckbox';
import { Subscription } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatToDisplayDate, parseDisplayDateToISO, maskDateInput } from '../../utils/dateUtils';

interface AbonelikModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<Subscription>;
}

export const AbonelikEkleModal: React.FC<AbonelikModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺', USD: '$', EUR: '€', GBP: '£'
  };
  
  const currencySymbol = currencySymbols[currency] || '₺';
  const [name, setName] = useState('');
  const [payDay, setPayDay] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(maskDateInput(e.target.value));
  };

  const handleAdd = async () => {
    if (!name.trim() || price === '' || payDay === '' || !startDate) {
      alert(t('sub_alert_missing_fields'));
      return;
    }

    const [d, m, y] = startDate.split('/');
    if (!d || !m || !y || startDate.length !== 10) {
      alert(t('sub_error_date_invalid') || 'Geçerli bir tarih giriniz.');
      return;
    }
    const isoDate = parseDisplayDateToISO(startDate);

    try {
      setLoading(true);
      await apiRequest('/subscriptions', {
        method: 'POST',
        body: { 
          subscription_name: name,
          cost: Number(price),
          payment_day: Number(payDay),
          start_date: isoDate,
          is_trial: isTrial
        }
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert(t('sub_error_adding'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={t('sub_modal_add_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-4 px-2 sm:pr-4 mt-2 font-inter text-[var(--text-main)]">
        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_name_label')}</label>
        <Input placeholder={t('sub_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_payday_label')}</label>
        <Input type="number" placeholder={t('sub_payday_placeholder')} value={payDay} onChange={(e) => setPayDay(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_price_label')}</label>
        <div className="relative w-full">
          <Input type="number" placeholder={t('sub_price_placeholder')} value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)] leading-tight whitespace-pre-line">
          {t('sub_start_date_label')}
        </label>
        <Input placeholder={t('sub_date_placeholder')} value={startDate} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)] leading-tight whitespace-pre-line">
          {t('sub_trial_label')}
        </label>
        <TrialCheckbox active={isTrial} onClick={() => setIsTrial(!isTrial)} />
      </div>

      <div className="mt-6 flex justify-end px-2 sm:pr-6 pb-2">
        <Button variant="add" className="w-full sm:w-[160px] h-[40px] text-xs sm:text-sm shadow-md" onClick={handleAdd} disabled={loading}>
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
    TL: '₺', USD: '$', EUR: '€', GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [name, setName] = useState(initialData?.subscription_name || '');
  const [payDay, setPayDay] = useState<number | ''>(initialData?.payment_day ?? '');
  const [price, setPrice] = useState<number | ''>(initialData?.cost ?? '');
  const [startDate, setStartDate] = useState(formatToDisplayDate(initialData?.start_date));
  const [isTrial, setIsTrial] = useState(initialData?.is_trial ?? false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(maskDateInput(e.target.value));
  };

  const handleUpdate = async () => {
    if (!initialData?.id) {
      console.error("HATA: Düzenlenecek abonelik ID'si bulunamadı!", initialData);
      alert(t('sub_error_id_missing'));
      return;
    }

    const [d, m, y] = startDate.split('/');
    if (!d || !m || !y || startDate.length !== 10) {
      alert('Geçerli bir tarih giriniz.');
      return;
    }
    const isoDate = parseDisplayDateToISO(startDate);

    try {
      setLoading(true);
      await apiRequest(`/subscriptions/${initialData.id}`, {
        method: 'PUT',
        body: { 
          subscription_name: name,
          cost: Number(price),
          payment_day: Number(payDay),
          start_date: isoDate,
          is_trial: isTrial
        }
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert(t('sub_error_updating'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={t('sub_modal_edit_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-4 px-2 sm:pr-4 mt-2 font-inter text-[var(--text-main)]">
        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_name_label')}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_payday_label')}</label>
        <Input type="number" value={payDay} onChange={(e) => setPayDay(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('sub_price_label')}</label>
        <div className="relative w-full">
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)] leading-tight whitespace-pre-line">
          {t('sub_start_date_label')}
        </label>
        <Input value={startDate} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)] leading-tight whitespace-pre-line">
          {t('sub_trial_label')}
        </label>
        <TrialCheckbox active={isTrial} onClick={() => setIsTrial(!isTrial)} />
      </div>

      <div className="mt-6 flex justify-end px-2 sm:pr-6 pb-2">
        <Button variant="apply" className="w-full sm:w-[160px] h-[40px] text-xs sm:text-sm shadow-md" onClick={handleUpdate} disabled={loading}>
          {loading ? t('sub_btn_updating') : t('sub_btn_apply')}
        </Button>
      </div>
    </BaseModal>
  );
};
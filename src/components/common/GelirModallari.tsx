import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { Income, IncomeSource, CurrencyPreference } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatToDisplayDate, parseDisplayDateToISO, maskDateInput } from '../../utils/dateUtils';

interface GelirModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Income;
}

const currencySymbols: Record<CurrencyPreference, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const useIncomeCategories = () => {
  const { t } = useTranslation();
  return [
    { label: t('cat_salary'), value: 'Maaş' as IncomeSource },
    { label: t('cat_rent'), value: 'Kira' as IncomeSource },
    { label: t('cat_assets'), value: 'Varlık' as IncomeSource },
    { label: t('cat_bonus'), value: 'Bonus' as IncomeSource },
    { label: t('cat_side_job'), value: 'Ek İş' as IncomeSource },
    { label: t('cat_inheritance'), value: 'Miras' as IncomeSource },
    { label: t('cat_government'), value: 'Devlet' as IncomeSource },
    { label: t('cat_other'), value: 'Diğer' as IncomeSource },
  ];
};

export const GelirEkleModal: React.FC<GelirModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';
  const categories = useIncomeCategories();
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IncomeSource | ''>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceDay, setRecurrenceDay] = useState<number | ''>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(maskDateInput(e.target.value));
  };

  const handleAdd = async () => {
    if (!name.trim() || amount === '' || !date || !category) {
      alert(t('exp_alert_missing_fields') || 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (isRecurring && (!recurrenceDay || Number(recurrenceDay) < 1 || Number(recurrenceDay) > 31)) {
      alert(t('income_alert_invalid_day') || 'Lütfen 1-31 arası bir gün girin.');
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/incomes', {
        method: 'POST',
        body: { 
          date: parseDisplayDateToISO(date), 
          income_name: name, 
          income_category: category, 
          income_amount: Number(amount),
          is_recurring: isRecurring,
          recurrence_day: isRecurring ? Number(recurrenceDay) : null
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
    <BaseModal title={t('income_add_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-4">
        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_date')}</label>
        <Input placeholder={t('income_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_name')}</label>
        <Input placeholder={t('income_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_category')}</label>
        <div className="relative w-full z-[999]">
          <Dropdown options={categories.map(c => c.label)} value={categories.find(c => c.value === category)?.label || ''} onSelect={(label) => setCategory(categories.find(c => c.label === label)?.value || '')} placeholder={t('placeholder_select')} />
        </div>

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_amount')}</label>
        <div className="relative w-full">
          <Input type="number" placeholder={t('income_amount_placeholder')} value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_label')}</label>
        <div className="flex items-center gap-2 py-1">
          <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-4 h-4 cursor-pointer" disabled={loading} />
          <span className="text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_desc')}</span>
        </div>

        {isRecurring && (
          <>
            <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_day')}</label>
            <Input type="number" placeholder={t('income_recurring_day_placeholder')} value={recurrenceDay} onChange={(e) => setRecurrenceDay(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          </>
        )}
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
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';
  const categories = useIncomeCategories();

  const [date, setDate] = useState(formatToDisplayDate(initialData?.date));
  const [name, setName] = useState(initialData?.income_name || '');
  const [category, setCategory] = useState<IncomeSource | ''>(initialData?.income_category || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.income_amount ?? '');
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(initialData?.is_recurring || false);
  const [recurrenceDay, setRecurrenceDay] = useState<number | ''>(initialData?.recurrence_day ?? '');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(maskDateInput(e.target.value));
  };

  const handleUpdate = async () => {
    if (!name.trim() || amount === '' || !date || !category) {
      alert(t('exp_alert_missing_fields') || 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (isRecurring && (!recurrenceDay || Number(recurrenceDay) < 1 || Number(recurrenceDay) > 31)) {
      alert('Lütfen 1-31 arası bir gün girin.');
      return;
    }
    
    try {
      setLoading(true);
      await apiRequest(`/incomes/${initialData?.id}`, {
        method: 'PUT',
        body: { 
          date: parseDisplayDateToISO(date), 
          income_name: name, 
          income_category: category, 
          income_amount: Number(amount),
          is_recurring: isRecurring,
          recurrence_day: isRecurring ? Number(recurrenceDay) : null
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
    <BaseModal title={t('income_edit_title')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-x-2 gap-y-3 sm:gap-y-5 font-inter pr-1 sm:pr-4">
        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_date')}</label>
        <Input placeholder={t('income_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_name')}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_category')}</label>
        <div className="relative w-full z-[999]">
          <Dropdown options={categories.map(c => c.label)} value={categories.find(c => c.value === category)?.label || ''} onSelect={(label) => setCategory(categories.find(c => c.label === label)?.value || '')} placeholder={t('placeholder_select')} />
        </div>

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_label_amount')}</label>
        <div className="relative w-full">
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_label')}</label>
        <div className="flex items-center gap-2 py-1">
          <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-4 h-4 cursor-pointer" disabled={loading} />
          <span className="text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_desc')}</span>
        </div>

        {isRecurring && (
          <>
            <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('income_recurring_day')}</label>
            <Input type="number" placeholder={t('income_recurring_day_placeholder')} value={recurrenceDay} onChange={(e) => setRecurrenceDay(e.target.value === '' ? '' : Number(e.target.value))} disabled={loading} />
          </>
        )}
      </div>

      <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2">
        <Button variant="apply" className="w-full sm:w-[140px] text-xs sm:text-sm" onClick={handleUpdate} disabled={loading}>
          {loading ? t('income_btn_updating') : t('income_btn_apply')}
        </Button>
      </div>
    </BaseModal>
  );
};
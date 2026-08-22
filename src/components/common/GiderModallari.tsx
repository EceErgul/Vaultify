import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { Expenses, ExpenseCategory, PaymentMethod, CurrencyPreference } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatToDisplayDate, parseDisplayDateToISO, maskDateInput } from '../../utils/dateUtils';

interface HarcamaData extends Partial<Expenses> {
  is_recurring?: boolean;
  recurrence_day?: number | null;
}

interface HarcamaEkleModalProps {
  onClose: () => void;
  onExpenseAdded?: (expense: Expenses) => void;
  initialData?: HarcamaData;
  isEditMode?: boolean;
}

const currencySymbols: Record<CurrencyPreference, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const useExpenseCategories = () => {
  const { t } = useTranslation();
  return [
    { label: t('exp_cat_home'), value: 'Ev Alışverişi' as ExpenseCategory },
    { label: t('exp_cat_market'), value: 'Market Alışverişi' as ExpenseCategory },
    { label: t('exp_cat_rent'), value: 'Kira' as ExpenseCategory },
    { label: t('exp_cat_entertainment'), value: 'Eğlence' as ExpenseCategory },
    { label: t('exp_cat_transport'), value: 'Ulaşım' as ExpenseCategory },
    { label: t('exp_cat_installments'), value: 'Taksitler' as ExpenseCategory },
    { label: t('exp_cat_debts'), value: 'Borçlar' as ExpenseCategory },
    { label: t('exp_cat_bills'), value: 'Faturalar' as ExpenseCategory },
    { label: t('exp_cat_health'), value: 'Sağlık' as ExpenseCategory },
    { label: t('exp_cat_other'), value: 'Diğer' as ExpenseCategory },
  ];
};

const usePaymentMethods = () => {
  const { t } = useTranslation();
  return [
    { label: t('exp_pay_cash'), value: 'Nakit' as PaymentMethod },
    { label: t('exp_pay_card'), value: 'Kredi Kartı' as PaymentMethod },
    { label: t('exp_pay_transfer'), value: 'Havale' as PaymentMethod },
    { label: t('exp_pay_installment'), value: 'Taksit' as PaymentMethod },
  ];
};

const HarcamaEkleModal: React.FC<HarcamaEkleModalProps> = ({ 
  onClose, 
  onExpenseAdded, 
  initialData, 
  isEditMode = false 
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';
  const categories = useExpenseCategories();
  const paymentMethods = usePaymentMethods();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState(initialData?.expense_name || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.expenses_amount ?? '');
  const [date, setDate] = useState(formatToDisplayDate(initialData?.date));
  const [category, setCategory] = useState<ExpenseCategory | ''>(initialData?.expense_category || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(initialData?.payment_method || '');
  const [isRecurring, setIsRecurring] = useState<boolean>(initialData?.is_recurring || false);
  const [recurrenceDay, setRecurrenceDay] = useState<number | ''>(initialData?.recurrence_day ?? '');

  useEffect(() => {
    if (initialData?.date && !date) {
      setDate(formatToDisplayDate(initialData.date));
    }
  }, [initialData, date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(maskDateInput(e.target.value));
  };

  const handleSave = async () => {
    if (!name.trim() || amount === '' || !date || !category || !paymentMethod) {
      alert(t('exp_alert_missing_fields') || 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (isRecurring && (!recurrenceDay || Number(recurrenceDay) < 1 || Number(recurrenceDay) > 31)) {
      alert(t('income_alert_invalid_day') || 'Lütfen 1 ile 31 arasında geçerli bir yinelenme günü girin.');
      return;
    }

    const formattedDate = parseDisplayDateToISO(date);

    const requestBody = {
      expense_name: name,
      expenses_amount: Number(amount),
      date: formattedDate,
      expense_category: category as ExpenseCategory,
      payment_method: paymentMethod as PaymentMethod,
      is_recurring: isRecurring,
      recurrence_day: isRecurring ? Number(recurrenceDay) : null
    };

    try {
      setLoading(true);
      let response;

      if (isEditMode && initialData?.id) {
        response = await apiRequest(`/expenses/${initialData.id}`, {
          method: 'PUT',
          body: requestBody
        });
      } else {
        response = await apiRequest('/expenses', {
          method: 'POST',
          body: requestBody
        });
      }

      onExpenseAdded?.(response);
      onClose();
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert(t('exp_alert_error') || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryLabel = categories.find(c => c.value === category)?.label || '';

  return (
    <BaseModal title={isEditMode ? t('exp_modal_title_edit') : t('exp_modal_title_add')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-5 gap-x-2 font-inter pr-1 sm:pr-4">
        
        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('exp_label_date')}</label>
        <Input type="text" placeholder={t('exp_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('exp_label_category')}</label>
        <div className="relative z-20 w-full">
          <Dropdown 
            options={categories.map(c => c.label)}
            onSelect={(label) => {
              const matched = categories.find(c => c.label === label);
              if (matched) setCategory(matched.value);
            }}
            value={selectedCategoryLabel}
            placeholder={t('exp_category_placeholder')} 
          />
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('exp_label_name')}</label>
        <Input placeholder={t('exp_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('exp_label_payment')}</label>
        <div className="relative z-10 w-full">
          <Dropdown 
            options={paymentMethods.map(method => method.label)}
            onSelect={(label) => {
              const matched = paymentMethods.find(method => method.label === label);
              if (matched) setPaymentMethod(matched.value);
            }}
            value={paymentMethods.find(method => method.value === paymentMethod)?.label || ''}
            placeholder={t('exp_payment_placeholder')} 
          />
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t('exp_label_amount')}</label>
        <div className="relative w-full">
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder={t('exp_amount_placeholder')} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>

        <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t("exp_is_recursive")}</label>
        <div className="flex items-center gap-2 py-1">
          <input 
            type="checkbox" 
            checked={isRecurring} 
            onChange={(e) => setIsRecurring(e.target.checked)} 
            className="w-4 h-4 text-blue-600 rounded border-[var(--border-color)] focus:ring-blue-500 cursor-pointer"
            disabled={loading}
          />
          <span className="text-xs sm:text-sm text-[var(--text-main)]">{t("exp_recursive_label")}</span>
        </div>

        {isRecurring && (
          <>
            <label className="text-xs sm:text-sm font-medium text-[var(--text-main)]">{t("exp_recurrence_day_label")}</label>
            <Input 
              type="number" 
              placeholder={t("exp_recurrence_day_placeholder")}
              value={recurrenceDay} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (Number(val) >= 1 && Number(val) <= 31)) {
                  setRecurrenceDay(val === '' ? '' : Number(val));
                }
              }} 
              disabled={loading} 
            />
          </>
        )}
      </div>

      <div className="mt-6 sm:mt-10 flex justify-end pr-2 sm:pr-6 pb-2">
        <Button 
          variant={isEditMode ? "apply" : "add"}
          onClick={handleSave} 
          className="w-full sm:w-[140px] text-xs sm:text-sm" 
          disabled={loading}
        >
          {loading ? t('exp_btn_processing') : (isEditMode ? t('exp_btn_confirm') : t('exp_btn_add'))}
        </Button>
      </div>
    </BaseModal>
  );
};

export default HarcamaEkleModal;
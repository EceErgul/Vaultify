import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { ExpenseCategory, PaymentMethod } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface HarcamaEkleModalProps {
  onClose: () => void;
  onExpenseAdded?: (expense: any) => void;
  initialData?: any;
  isEditMode?: boolean;
}

const HarcamaEkleModal: React.FC<HarcamaEkleModalProps> = ({ onClose, onExpenseAdded, initialData, isEditMode = false }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.amount || '');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [paymentMethod, setPaymentMethod] = useState<string>(initialData?.paymentMethod || '');

  const kategoriler = [
    t('exp_cat_home'),
    t('exp_cat_market'),
    t('exp_cat_rent'),
    t('exp_cat_entertainment'),
    t('exp_cat_transport'),
    t('exp_cat_installments'),
    t('exp_cat_debts'),
    t('exp_cat_bills'),
    t('exp_cat_health'),
    t('exp_cat_other')
  ];

  const odemeYontemleri = [
    t('exp_pay_cash'),
    t('exp_pay_card'),
    t('exp_pay_transfer'),
    t('exp_pay_installment')
  ];

  useEffect(() => {
    if (initialData?.date) {
      const [year, month, day] = initialData.date.split('T')[0].split('-');
      setDate(`${day}/${month}/${year}`);
    }
  }, [initialData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    if (value.length <= 10) setDate(value);
  };

  const handleSave = async () => {
    if (!name.trim() || !amount || !date || !category || !paymentMethod) {
      alert(t('exp_alert_missing_fields'));
      return;
    }

    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      setLoading(true);

      if (isEditMode) {
        await apiRequest(`/expenses/${initialData.id}`, {
          method: 'PUT',
          body: {
            expense_name: name,
            expenses_amount: Number(amount),
            date: formattedDate,
            expense_category: category,
            payment_method: paymentMethod
          }
        });
      } else {
        await apiRequest('/expenses', {
          method: 'POST',
          body: {
            expense_name: name,
            expenses_amount: Number(amount),
            date: formattedDate,
            expense_category: category,
            payment_method: paymentMethod
          }
        });
      }

      onExpenseAdded?.(null);
      onClose();
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert(t('exp_alert_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={isEditMode ? t('exp_modal_title_edit') : t('exp_modal_title_add')} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-y-3 sm:gap-y-5 gap-x-2 font-inter pr-1 sm:pr-4">
        
        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('exp_label_date')}</label>
        <Input type="text" placeholder={t('exp_date_placeholder')} value={date} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('exp_label_category')}</label>
        <div className="relative z-20 w-full">
          <Dropdown 
            options={kategoriler}
            onSelect={(v) => setCategory(v)}
            value={category}
            placeholder={t('exp_category_placeholder')} 
          />
        </div>

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('exp_label_name')}</label>
        <Input placeholder={t('exp_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('exp_label_payment')}</label>
        <div className="relative z-10 w-full">
          <Dropdown 
            options={odemeYontemleri}
            onSelect={(v) => setPaymentMethod(v)}
            value={paymentMethod}
            placeholder={t('exp_payment_placeholder')} 
          />
        </div>

        <label className="text-xs sm:text-sm font-medium text-[#333D50]">{t('exp_label_amount')}</label>
        <div className="relative w-full">
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder={t('exp_amount_placeholder')} disabled={loading} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
        </div>
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
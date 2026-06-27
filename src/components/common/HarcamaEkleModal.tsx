import React, { useState, useEffect } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { ExpenseCategory, PaymentMethod } from '../../types/index';
import { apiRequest } from '../../utils/api';

interface HarcamaEkleModalProps {
  onClose: () => void;
  onExpenseAdded?: (expense: any) => void;
  initialData?: any;
  isEditMode?: boolean;
}

const KATEGORILER: ExpenseCategory[] = [
  'Ev Alışverişi', 'Market Alışverişi', 'Kira', 'Eğlence', 
  'Ulaşım', 'Taksitler', 'Borçlar', 'Faturalar', 'Sağlık', 'Diğer'
];

const ODEME_YONTEMLERI: PaymentMethod[] = ['Nakit', 'Kredi Kartı', 'Havale', 'Taksit'];

const HarcamaEkleModal: React.FC<HarcamaEkleModalProps> = ({ onClose, onExpenseAdded, initialData, isEditMode = false }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.amount || '');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>(initialData?.category || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(initialData?.paymentMethod || '');

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
      alert("Lütfen tüm alanları doldurunuz.");
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
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={isEditMode ? "Harcamayı Düzenle" : "Harcama Ekle"} onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        
        <label className="text-sm font-medium text-[#333D50]">Tarih:</label>
        <Input type="text" placeholder="GG/AA/YYYY" value={date} onChange={handleDateChange} maxLength={10} disabled={loading} />

        <label className="text-sm font-medium text-[#333D50]">Kategori:</label>
        <div className="relative z-20">
          <Dropdown 
            options={KATEGORILER} 
            onSelect={(v) => setCategory(v as ExpenseCategory)} 
            placeholder={category || "Kategori Seçin"} 
          />
        </div>

        <label className="text-sm font-medium text-[#333D50]">Harcama Adı:</label>
        <Input placeholder="Buraya Yazılacak" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

        <label className="text-sm font-medium text-[#333D50]">Ödeme:</label>
        <div className="relative z-10">
          <Dropdown 
            options={ODEME_YONTEMLERI} 
            onSelect={(v) => setPaymentMethod(v as PaymentMethod)} 
            placeholder={paymentMethod || "Ödeme Yöntemi Seçin"} 
          />
        </div>

        <label className="text-sm font-medium text-[#333D50]">Tutar:</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="0.00" disabled={loading} />
      </div>

      <div className="mt-10 flex justify-end pr-6 pb-2">
        <Button 
          variant={isEditMode ? "apply" : "add"}
          onClick={handleSave} 
          className="w-[140px]" 
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : (isEditMode ? 'Onayla' : '+ Ekle')}
        </Button>
      </div>
    </BaseModal>
  );
};

export default HarcamaEkleModal;
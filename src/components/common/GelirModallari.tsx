import React, { useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { IncomeSource } from '../../types/index';
import { apiRequest } from '../../utils/api';

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

const GELIR_KATEGORILERI: IncomeSource[] = [
  'Maaş', 'Kira Geliri', 'Varlıklarım', 'İkramiye/Prim', 'Ek İş', 'Miras', 'Devlet Desteği', 'Diğer'
];

const formatToDisplayDate = (isoDate?: string) => {
  if (!isoDate) return '';
  const dateObj = new Date(isoDate);
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
};

export const GelirEkleModal: React.FC<GelirModalProps> = ({ onClose, onSuccess }) => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IncomeSource>('Maaş');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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
    <BaseModal title="Gelir Ekle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input placeholder="GG/AA/YYYY" value={date} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input placeholder="Gelir adı" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <div className="relative max-h-[200px] overflow-y-auto z-[999]"> 
          <Dropdown 
            options={GELIR_KATEGORILERI}
            onSelect={(v) => setCategory(v as IncomeSource)}
            placeholder={category} value={''}          
            />
        </div>

        <label className="font-medium text-sm text-[#333D50]">Miktar:</label>
        <Input type="number" placeholder="Gelir Miktarı" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div className="mt-10 flex justify-end pr-10 pb-2">
        <Button variant="add" className="w-[140px]" onClick={handleAdd} disabled={loading}>
          {loading ? 'Ekleniyor...' : '+ Ekle'}
        </Button>
      </div>
    </BaseModal>
  );
};

export const GelirDuzenleModal: React.FC<GelirModalProps> = ({ onClose, initialData, onSuccess }) => {
  const [date, setDate] = useState(formatToDisplayDate(initialData?.date));
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<IncomeSource>(initialData?.category || 'Maaş');
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [loading, setLoading] = useState(false);

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
    <BaseModal title="Gelir Düzenle" onClose={onClose}>
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-5 font-inter pr-4">
        <label className="font-medium text-sm text-[#333D50]">Tarih:</label>
        <Input placeholder="GG/AA/YYYY" value={date} onChange={handleDateChange} maxLength={10} />

        <label className="font-medium text-sm text-[#333D50]">Gelir Adı:</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <label className="font-medium text-sm text-[#333D50]">Kategori:</label>
        <div className="relative">
          <Dropdown options={GELIR_KATEGORILERI} onSelect={(v) => setCategory(v as IncomeSource)} placeholder={category} value={''} />
        </div>

        <label className="font-medium text-sm text-[#333D50]">Miktar:</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>

      <div className="mt-10 flex justify-end pr-10 pb-2">
        <Button variant="apply" className="w-[140px]" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Güncelleniyor...' : 'Uygula'}
        </Button>
      </div>
    </BaseModal>
  );
};
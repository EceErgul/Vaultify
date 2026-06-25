import React, { useMemo, useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { apiRequest } from '../../utils/api';

interface AssetTransactionModalProps {
  assetId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const transactionTypes = ['Alış', 'Satış'] as const;

type TransactionType = typeof transactionTypes[number];

const AssetTransactionModal: React.FC<AssetTransactionModalProps> = ({ assetId, isOpen, onClose, onCreated }) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('Alış');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalValue = useMemo(() => {
    const qty = Number(quantity);
    const pr = Number(price);
    return Number.isFinite(qty) && Number.isFinite(pr) ? (qty * pr).toFixed(2) : '0.00';
  }, [quantity, price]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest(`/assets/${assetId}/transactions`, {
        method: 'POST',
        body: {
          transaction_type: transactionType,
          date,
          total_quantity: Number(quantity),
          price_per_unit: Number(price),
          total_value: Number(totalValue)
        }
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'İşlem eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title="İşlem Ekle" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium text-sm text-[#333D50]">İşlem Türü</label>
          <select
            value={transactionType}
            onChange={(event) => setTransactionType(event.target.value as TransactionType)}
            className="w-full h-[45px] px-4 rounded-[6px] bg-white border border-[#CDCDCD] text-sm text-[#333D50] focus:border-gray-400"
          >
            {transactionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-sm text-[#333D50]">Tarih</label>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>

        <div>
          <label className="font-medium text-sm text-[#333D50]">Miktar</label>
          <Input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Örn: 1.25"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#333D50]">Birim Fiyat</label>
          <Input
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Örn: 1234.56"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#333D50]">Toplam Tutar</label>
          <Input value={totalValue} readOnly isTotal />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="delete" className="px-5" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="add" className="px-5" disabled={loading || !quantity || !price}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AssetTransactionModal;

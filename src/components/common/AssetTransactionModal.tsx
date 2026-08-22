import React, { useMemo, useState } from 'react';
import BaseModal from './Modal';
import Input from './Input';
import Button from './Button';
import { AssetTransaction, CurrencyPreference } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currencyUtils';

interface AssetTransactionModalProps {
  assetId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type TransactionType = AssetTransaction['transaction_type'];

const currencySymbols: Record<CurrencyPreference, string> = {
  TL: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const AssetTransactionModal: React.FC<AssetTransactionModalProps> = ({ assetId, isOpen, onClose, onCreated }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbol = currencySymbols[currency as CurrencyPreference] || '₺';

  const [transactionType, setTransactionType] = useState<TransactionType>('Alış');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
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
    if (quantity === '' || price === '') return;

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
      setError(err?.message || t('asset_trans_error_default') || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title={t('asset_trans_title')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 font-inter text-[var(--text-main)]">
        <div>
          <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('asset_trans_type')}</label>
          <select
            value={transactionType}
            onChange={(event) => setTransactionType(event.target.value as TransactionType)}
            disabled={loading}
            className="w-full h-[40px] sm:h-[45px] px-3 sm:px-4 rounded-[6px] bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] focus:border-[var(--text-muted)] mt-1 outline-none"
          >
            <option value="Alış" className="bg-[var(--bg-card)] text-[var(--text-main)]">{t('asset_trans_buy')}</option>
            <option value="Satış" className="bg-[var(--bg-card)] text-[var(--text-main)]">{t('asset_trans_sell')}</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('asset_trans_date')}</label>
          <div className="mt-1">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={loading} />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('asset_trans_quantity')}</label>
          <div className="mt-1">
            <Input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value === '' ? '' : Number(event.target.value))}
              placeholder={t('asset_trans_qty_placeholder')}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('asset_trans_unit_price')}</label>
          <div className="mt-1 relative w-full">
            <Input
              type="number"
              min="0"
              step="any"
              value={price}
              onChange={(event) => setPrice(event.target.value === '' ? '' : Number(event.target.value))}
              placeholder={t('asset_trans_price_placeholder')}
              disabled={loading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
          </div>
        </div>

        <div>
          <label className="font-medium text-xs sm:text-sm text-[var(--text-main)]">{t('asset_trans_total_value')}</label>
          <div className="mt-1 relative w-full">
            <Input 
              value={formatCurrency(Number(totalValue), currency)} 
              readOnly 
              isTotal 
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs sm:text-sm select-none pointer-events-none">{currencySymbol}</span>
          </div>
        </div>

        {error && <p className="text-xs sm:text-sm text-[var(--danger-text)]">{error}</p>}

        <div className="flex justify-end gap-2 sm:gap-3 pt-2">
          <Button type="button" variant="delete" className="px-4 sm:px-5 h-[36px] sm:h-[40px] text-xs sm:text-sm" onClick={onClose} disabled={loading}>
            {t('asset_trans_btn_cancel')}
          </Button>
          <Button type="submit" variant="add" className="px-4 sm:px-5 h-[36px] sm:h-[40px] text-xs sm:text-sm" disabled={loading || quantity === '' || price === ''}>
            {loading ? t('asset_trans_btn_saving') : t('asset_trans_btn_save')}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AssetTransactionModal;
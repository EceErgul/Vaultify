import React, { useState } from 'react';
import BaseModal from './Modal';
import Button from './Button';
import { Subscription } from '../../types/index';
import { apiRequest } from '../../utils/api';
import { useTranslation } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currencyUtils';

interface AbonelikSilModalProps {
  onClose: () => void;
  subscriptions: Subscription[];
  onSuccess?: () => void;
}

const AbonelikSilModal: React.FC<AbonelikSilModalProps> = ({ onClose, subscriptions, onSuccess }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const calculateKalanGun = (paymentDay: number) => {
    const bugun = new Date().getDate();
    let kalan = paymentDay - bugun;
    if (kalan < 0) kalan += 30;
    return kalan === 0 ? t('sub_today') : `${kalan} ${t('sub_days_left')}`;
  };

  const calculateSure = (startDateStr: string) => {
    const baslangic = new Date(startDateStr);
    if (isNaN(baslangic.getTime())) return 1;
    const simdi = new Date();
    const ayFarki = (simdi.getFullYear() - baslangic.getFullYear()) * 12 + (simdi.getMonth() - baslangic.getMonth());
    return ayFarki <= 0 ? 1 : ayFarki;
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    
    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map((id) => 
          apiRequest(`/subscriptions/${id}`, { 
            method: 'DELETE' 
          })
        )
      );
      
      onSuccess?.();
      onClose(); 
    } catch (error) {
      console.error('Silme hatası:', error);
      alert(t('sub_error_delete') || 'Silme işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
      setIsConfirming(false);
    }
  };

  const CustomCheckbox = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange?: () => void;
  }) => (
    <div
      onClick={onChange}
      className="w-5 h-5 bg-[var(--bg-card)] border border-[var(--danger-border)] rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
    >
      {checked && (
        <svg viewBox="0 0 100 100" className="w-3 h-3 stroke-[var(--text-main)] stroke-[15px]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      )}
    </div>
  );

  return (
    <BaseModal title={isConfirming ? t('sub_del_confirm_title') : t('sub_del_title')} onClose={onClose}>
      <div className="flex flex-col font-inter pr-1 w-full p-2 text-[var(--text-main)]">
        
        {!isConfirming ? (
          <>
            <div className="flex items-center gap-2 mb-3 ml-2 select-none">
              <CustomCheckbox 
                checked={selectedIds.length === subscriptions.length && subscriptions.length > 0}
                onChange={() => {
                  if (selectedIds.length === subscriptions.length) setSelectedIds([]);
                  else setSelectedIds(subscriptions.map(a => a.id));
                }}
              />
              <span className="text-sm font-bold text-[var(--text-main)]">{t('sub_select_all')}</span>
            </div>

            <div className="max-h-[240px] overflow-y-auto border border-[var(--danger-border)] rounded-sm">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[var(--danger-header-bg)] text-white text-xs h-10">
                    <th className="w-12 border-b border-r border-[var(--danger-border)]"></th>
                    <th className="p-2 border-b border-r border-[var(--danger-border)] text-left font-bold">{t('sub_name_label')}</th>
                    <th className="p-2 border-b border-r border-[var(--danger-border)] font-bold text-center">{t('sub_payday_label')}</th>
                    <th className="p-2 border-b border-r border-[var(--danger-border)] font-bold text-center">{t('sub_price_label')}</th>
                    <th className="p-2 border-b border-[var(--danger-border)] font-bold text-center">{t('sub_duration_months')}</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr className="bg-[var(--danger-row-odd)] text-[var(--text-main)]">
                      <td colSpan={5} className="text-center p-4 text-xs italic">{t('sub_empty_list')}</td>
                    </tr>
                  ) : (
                    subscriptions.map((sub, index) => {
                      const isChecked = selectedIds.includes(sub.id);
                      return (
                        <tr 
                          key={sub.id} 
                          className={`text-[11px] h-10 border-b border-[var(--danger-border)] cursor-pointer hover:opacity-90 select-none text-[var(--text-main)] ${
                            (index + 1) % 2 === 0 
                              ? 'bg-[var(--danger-row-even)]' 
                              : 'bg-[var(--danger-row-odd)]'
                          }`}
                          onClick={() => {
                            if (loading) return;
                            if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                            else setSelectedIds([...selectedIds, sub.id]);
                          }}
                        >
                          <td className="text-center p-2 border-r border-[var(--danger-border)]">
                            <div className="flex justify-center items-center">
                              <CustomCheckbox checked={isChecked} />
                            </div>
                          </td>
                          <td className="p-2 border-r border-[var(--danger-border)] font-medium">{sub.subscription_name}</td>
                          <td className="p-2 border-r border-[var(--danger-border)] text-center">{calculateKalanGun(sub.payment_day)}</td>
                          <td className="p-2 border-r border-[var(--danger-border)] text-center font-semibold">{formatCurrency(Number(sub.cost || 0), currency)}</td>
                          <td className="p-2 text-center">{calculateSure(sub.start_date)} {t('sub_duration_months')}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-2 pr-2">
              <Button variant="cancel" onClick={onClose} className="h-[40px]">{t('sub_btn_cancel')}</Button>
              <Button 
                variant="delete" 
                disabled={selectedIds.length === 0} 
                onClick={() => setIsConfirming(true)}
                className="h-[40px]"
              >
                {t('sub_btn_delete_count')?.replace('{count}', String(selectedIds.length)) || `${selectedIds.length} Öğeyi Sil`}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <p className="text-center font-medium text-lg text-[var(--text-main)]">
              <span className="font-bold">{selectedIds.length}</span> {t('sub_confirm_message') || 'adet aboneliği silmek istediğinize emin misiniz?'} <br/>
              {t('sub_confirm_warning')}
            </p>
            <div className="flex gap-4">
              <Button variant="cancel" onClick={() => setIsConfirming(false)} className="w-[120px]">{t('sub_btn_cancel')}</Button>
              <Button variant="delete" onClick={handleDelete} disabled={loading} className="w-[120px]">
                {loading ? t('sub_btn_deleting') : t('sub_btn_yes_delete')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AbonelikSilModal;
import React, { useState } from 'react';
import BaseModal from './Modal';
import Button from './Button';
import { apiRequest } from '../../utils/api';

interface Subscription {
  id: string;
  user_id: string;
  subscription_name: string;
  cost: number | string;
  payment_day: number;
  start_date: string;
  is_trial: boolean;
}

interface AbonelikSilModalProps {
  onClose: () => void;
  subscriptions: Subscription[];
}

const AbonelikSilModal: React.FC<AbonelikSilModalProps> = ({ onClose, subscriptions }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const calculateKalanGun = (paymentDay: number) => {
    const bugun = new Date().getDate();
    let kalan = paymentDay - bugun;
    if (kalan < 0) kalan += 30;
    return kalan === 0 ? "Bugün" : `${kalan} Gün Kaldı`;
  };

  const calculateSure = (startDateStr: string) => {
    const baslangic = new Date(startDateStr);
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
      
      onClose(); 
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
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
      className="w-5 h-5 bg-white border border-black rounded-[4px] flex items-center justify-center shrink-0"
    >
      {checked && (
        <svg viewBox="0 0 100 100" className="w-3 h-3 stroke-black stroke-[15px]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      )}
    </div>
  );

  return (
    <BaseModal title={isConfirming ? "Emin misiniz?" : "Abonelik Sil"} onClose={onClose}>
      <div className="flex flex-col font-inter pr-1 w-full p-2">
        
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
              <span className="text-sm font-bold text-black">Hepsini Seç</span>
            </div>

            <div className="max-h-[240px] overflow-y-auto border border-black/20 rounded-sm">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#FF7B7B] text-black text-xs h-10">
                    <th className="w-12 border-b border-r border-black/20"></th>
                    <th className="p-2 border-b border-r border-black/20 text-left font-bold">Abonelik Adı</th>
                    <th className="p-2 border-b border-r border-black/20 font-bold text-center">Ödeme Durumu</th>
                    <th className="p-2 border-b border-r border-black/20 font-bold text-center">Fiyat</th>
                    <th className="p-2 border-b font-bold text-center">Süre</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr className="bg-[#FFBABA]"><td colSpan={5} className="text-center p-4 text-xs italic">Silinecek abonelik yok.</td></tr>
                  ) : (
                    subscriptions.map((sub, index) => {
                      const isChecked = selectedIds.includes(sub.id);
                      return (
                        <tr 
                          key={sub.id} 
                          style={{ backgroundColor: (index + 1) % 2 === 0 ? '#FFBABA' : '#FF9E9E' }}
                          onClick={() => {
                            if (loading) return;
                            const isChecked = selectedIds.includes(sub.id);
                            if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                            else setSelectedIds([...selectedIds, sub.id]);
                          }}
                          className="text-[11px] h-10 border-b border-black/10 cursor-pointer hover:opacity-90 select-none"
                        >
                          <td className="text-center p-2 border-r border-black/10">
                            <div className="flex justify-center items-center">
                              <CustomCheckbox checked={selectedIds.includes(sub.id)} />
                            </div>
                          </td>
                          <td className="p-2 border-r border-black/10 font-medium">{sub.subscription_name}</td>
                          <td className="p-2 border-r border-black/10 text-center">{calculateKalanGun(sub.payment_day)}</td>
                          <td className="p-2 border-r border-black/10 text-center font-semibold">{Number(sub.cost).toLocaleString('tr-TR')} ₺</td>
                          <td className="p-2 text-center">{calculateSure(sub.start_date)} Aydır</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-2 pr-2">
              <Button variant="cancel" onClick={onClose} className="h-[40px]">Vazgeç</Button>
              <Button 
                variant="delete" 
                disabled={selectedIds.length === 0} 
                onClick={() => setIsConfirming(true)}
                className="h-[40px]"
              >
                Abonelik Sil ({selectedIds.length})
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <p className="text-center font-medium text-lg">
              Seçili <span className="font-bold">{selectedIds.length}</span> aboneliği silmek istediğinize emin misiniz? <br/>
              Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-4">
              <Button variant="cancel" onClick={() => setIsConfirming(false)} className="w-[120px]">Vazgeç</Button>
              <Button variant="delete" onClick={handleDelete} disabled={loading} className="w-[120px]">
                {loading ? "Siliniyor..." : "Evet, Sil"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AbonelikSilModal;
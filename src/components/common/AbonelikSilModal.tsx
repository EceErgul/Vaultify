import React, { useState } from 'react';
import BaseModal from './Modal';
import { GeneralDeleteComponent } from './GeneralDeleteComponent';
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
      await apiRequest('/subscriptions/delete', {
        method: 'POST',
        body: { ids: selectedIds },
      });
      
      onClose();
    } catch (error) {
      console.error('Abonelikler silinirken hata oluştu:', error);
      alert('Silme işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        if (!loading) onChange();
      }}
      className={`w-5 h-5 bg-white border border-black rounded-[4px] cursor-pointer flex items-center justify-center shrink-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    <BaseModal title="Abonelik Sil" onClose={onClose}>
      <div className="flex flex-col font-inter pr-1 w-full">
        
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
          <table className="w-full border-collapse table-layout-auto">
            <thead>
              <tr className="bg-[#FF7B7B] text-black text-xs h-10 sticky top-0 z-10">
                <th className="w-12 border-b border-r border-black/20 bg-[#FF7B7B]"></th>
                <th className="p-2 border-b border-r border-black/20 text-left font-bold">Abonelik Adı</th>
                <th className="p-2 border-b border-r border-black/20 font-bold text-center">Ödeme Durumu</th>
                <th className="p-2 border-b border-r border-black/20 font-bold text-center">Fiyat</th>
                <th className="p-2 border-b font-bold text-center">Süre</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr className="bg-[#FFBABA]">
                  <td colSpan={5} className="text-center p-4 text-xs italic text-gray-700">
                    Silinecek abonelik bulunamadı.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => {
                  const isEven = (index + 1) % 2 === 0;
                  const rowColor = isEven ? '#FFBABA' : '#FF9E9E';
                  const isChecked = selectedIds.includes(sub.id);

                  return (
                    <tr 
                      key={sub.id} 
                      style={{ backgroundColor: rowColor }}
                      onClick={() => {
                        if (loading) return;
                        if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                        else setSelectedIds([...selectedIds, sub.id]);
                      }}
                      className="text-[11px] h-10 border-b border-black/10 cursor-pointer hover:opacity-95 select-none"
                    >
                      <td className="text-center p-2 border-r border-black/10">
                        <div className="flex justify-center items-center">
                          <CustomCheckbox 
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                              else setSelectedIds([...selectedIds, sub.id]);
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-2 border-r border-black/10 font-medium">{sub.subscription_name}</td>
                      <td className="p-2 border-r border-black/10 text-center">
                        {calculateKalanGun(sub.payment_day)}
                      </td>
                      <td className="p-2 border-r border-black/10 text-center font-semibold">
                        {Number(sub.cost).toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="p-2 text-center">
                        {calculateSure(sub.start_date)} Aydır
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end pr-2 pb-2">
          <GeneralDeleteComponent 
            label={loading ? "Siliniyor..." : `Abonelik Sil (${selectedIds.length})`} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default AbonelikSilModal;
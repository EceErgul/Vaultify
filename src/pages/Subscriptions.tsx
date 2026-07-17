import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { AbonelikEkleModal, AbonelikDuzenleModal } from '../components/common/AbonelikEkleVeDuzenleModal';
import AbonelikSilModal from '../components/common/AbonelikSilModal';
import { apiRequest } from '../utils/api';

interface Subscription {
  id: string;
  user_id: string;
  subscription_name: string;
  cost: number | string;
  payment_day: number;
  start_date: string;
  is_trial: boolean;
}

const Subscriptions = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/subscriptions');
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Abonelikler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const getCardColor = (paymentDay: number, isTrial: boolean) => {
    if (isTrial) return '#B9B9B9';
    
    const bugun = new Date().getDate();
    let kalan = paymentDay - bugun;
    if (kalan < 0) kalan += 30;

    if (kalan === 0 || kalan <= 2) return '#FF9E9E';
    if (kalan <= 5) return '#FFF6AF';
    return '#B1E5FF';
  };

  const getKalanGun = (paymentDay: number) => {
    const bugun = new Date().getDate();
    let kalan = paymentDay - bugun;
    if (kalan < 0) kalan += 30;
    return kalan;
  };

  const getAbonelikSuresi = (startDateStr: string) => {
    const baslangic = new Date(startDateStr);
    const simdi = new Date();
    const ayFarki = (simdi.getFullYear() - baslangic.getFullYear()) * 12 + (simdi.getMonth() - baslangic.getMonth());
    return ayFarki <= 0 ? 1 : ayFarki;
  };

  const getLogoUrl = (name: string) => {
  const cleanName = name
    .toLowerCase()
    .replace(/premium|plus|family|tv|music|pro|app/g, '')
    .replace(/\s+/g, '')
    .trim();

    return `https://icon.horse/icon/${cleanName}.com`;
  };

  const aylikToplam = subscriptions.reduce((acc, curr) => acc + Number(curr.cost), 0);
  
  const siradakiOdeme = subscriptions.length > 0 
    ? [...subscriptions].sort((a, b) => getKalanGun(a.payment_day) - getKalanGun(b.payment_day))[0] 
    : null;

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto flex flex-col items-center">
      
      <div className="flex gap-10 mb-16">
        <div className="w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4">
          <h3 className="text-xl font-medium mb-4">Aylık Toplam</h3>
          <p className="text-sm leading-relaxed">
            Bu ay toplam {aylikToplam.toLocaleString('tr-TR')} ₺<br/>abonelik ödemeniz var.
          </p>
        </div>
        <div className="w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4">
          <h3 className="text-xl font-medium mb-4">Sıradaki Ödeme</h3>
          {siradakiOdeme ? (
            <p className="text-sm leading-relaxed">
              {siradakiOdeme.subscription_name}<br/>
              {getKalanGun(siradakiOdeme.payment_day) === 0 ? 'Bugün' : `${getKalanGun(siradakiOdeme.payment_day)} gün sonra`} ({Number(siradakiOdeme.cost).toLocaleString('tr-TR')} ₺)
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Kayıtlı abonelik yok.</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-8 tracking-wider">ABONELİKLERİM</h2>

      <div className="flex gap-6 mb-6 w-full justify-center overflow-x-auto pb-4">
        <div 
          onClick={() => setIsAddOpen(true)}
          className="min-w-[220px] h-[300px] bg-[#B9B9B9] rounded-2xl shadow-md border border-black/5 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="text-4xl text-white">+</span>
        </div>

        {loading ? (
          <div className="min-w-[220px] h-[300px] flex items-center justify-center text-sm text-gray-400">
            Yükleniyor...
          </div>
        ) : (
          subscriptions.map((sub) => {
            const kalanGun = getKalanGun(sub.payment_day);
            const abonelikSuresi = getAbonelikSuresi(sub.start_date);

            return (
              <div 
                key={sub.id} 
                style={{ backgroundColor: getCardColor(sub.payment_day, sub.is_trial) }}
                className="min-w-[220px] h-[300px] rounded-2xl shadow-md p-5 flex flex-col relative border border-black/5"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/10">
                    <img 
                      src={getLogoUrl(sub.subscription_name)} 
                      alt={sub.subscription_name} 
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2721/2721980.png'; 
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedSubscription(sub);
                      setIsEditOpen(true);
                    }}
                    className="text-[12px] font-regular hover:underline"
                  >
                    Düzenle
                  </button>
                </div>

                <h4 className="text-[15px] font-semibold mb-3">{sub.subscription_name}</h4>
                
                <div className="space-y-2 text-[12px] font-regular">
                  <p>{Number(sub.cost).toLocaleString('tr-TR')} ₺ /ay</p>
                  <p className="font-medium">
                    {kalanGun === 0 ? 'Bugün Ödeme Günü' : `${kalanGun} Gün Sonra Ödeme`}
                  </p>
                  <p className="pt-2">{abonelikSuresi} Aydır Abonesin</p>
                  <p className="text-[11px] opacity-80 italic">
                    Her ayın <span className="font-bold">{sub.payment_day}</span>. günü <br /> ödenir.
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3 mb-10">
        {[...Array(subscriptions.length + 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full ${
              activeIndex === i ? 'w-8 bg-[#B9B9B9]' : 'w-2 bg-[#D9D9D9]'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-10">
        <Button 
          variant="add" 
          className="w-[160px] h-[35px] text-[12px] shadow-sm"
          onClick={() => setIsAddOpen(true)}
        >
          + Abonelik Ekle
        </Button>
        <Button 
          variant="delete" 
          className="w-[160px] h-[35px] text-[12px] shadow-sm"
          onClick={() => setIsDeleteOpen(true)}
        >
          - Abonelik Sil
        </Button>
      </div>

      {isAddOpen && (
        <AbonelikEkleModal 
          onClose={() => { setIsAddOpen(false); fetchSubscriptions(); }} 
        />
      )}
      
      {isEditOpen && selectedSubscription && (
        <AbonelikDuzenleModal 
          initialData={{
            id: selectedSubscription.id,
            name: selectedSubscription.subscription_name,
            payDay: String(selectedSubscription.payment_day),
            price: String(selectedSubscription.cost),
            startDate: selectedSubscription.start_date,
            isTrial: selectedSubscription.is_trial,
          }}
          onClose={() => { 
            setIsEditOpen(false); 
            setSelectedSubscription(null); 
            fetchSubscriptions(); 
          }} 
          onSuccess={fetchSubscriptions}
        />
      )}
      
      {isDeleteOpen && (
        <AbonelikSilModal 
          subscriptions={subscriptions}
          onClose={() => { setIsDeleteOpen(false); fetchSubscriptions(); }} 
        />
      )}
    </div>
  );
};

export default Subscriptions;
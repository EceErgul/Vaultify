import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { AbonelikEkleModal, AbonelikDuzenleModal } from '../components/common/AbonelikEkleVeDuzenleModal';
import AbonelikSilModal from '../components/common/AbonelikSilModal';
import { apiRequest } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

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
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const getItemsPerPage = () => {
    if (window.innerWidth < 500) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const listWithAdd = [...(Array.isArray(subscriptions) ? subscriptions : []), { id: 'add-card' } as any];
  const totalPages = Math.ceil(listWithAdd.length / itemsPerPage);

  useEffect(() => {
    if (activeIndex >= totalPages && totalPages > 0) {
      setActiveIndex(totalPages - 1);
    }
  }, [itemsPerPage, totalPages]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/subscriptions');
      if (Array.isArray(data)) {
        setSubscriptions(data);
      } else if (data && typeof data === 'object') {
        setSubscriptions(data.subscriptions || data.data || []);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Abonelikler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    const handleUpdate = () => fetchSubscriptions();
    window.addEventListener('abonelikGuncellendi', handleUpdate);
    return () => window.removeEventListener('abonelikGuncellendi', handleUpdate);
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
    const cleanName = name.toLowerCase().replace(/premium|plus|family|tv|music|pro|app/g, '').replace(/\s+/g, '').trim();
    return `https://icon.horse/icon/${cleanName}.com`;
  };

  const sortedSubs = [...subscriptions].sort((a, b) => {
    const daysA = getKalanGun(a.payment_day);
    const daysB = getKalanGun(b.payment_day);
    if (daysA !== daysB) return daysA - daysB;
    return a.subscription_name.localeCompare(b.subscription_name);
  });
  
  const sortedListWithAdd = [...sortedSubs, { id: 'add-card' } as any];
  const validSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];
  const aylikToplam = validSubscriptions.reduce((acc, curr) => acc + Number(curr.cost), 0);
  
  const siradakiOdeme = validSubscriptions.length > 0 
  ? [...validSubscriptions].sort((a, b) => getKalanGun(a.payment_day) - getKalanGun(b.payment_day))[0] 
  : null;

  const sliderMaxWidthClass = itemsPerPage === 1 ? 'max-w-[240px]' : itemsPerPage === 2 ? 'max-w-[480px]' : 'max-w-[720px]';
  const cardWidthClass = itemsPerPage === 1 ? 'min-w-full' : itemsPerPage === 2 ? 'min-w-[50%]' : 'min-w-[33.333%]';

  return (
    <div className="p-4 sm:p-8 font-inter w-full max-w-6xl mx-auto flex flex-col items-center overflow-x-hidden box-border">
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 sm:mb-16 w-full justify-center items-center">
        <div className="w-full sm:w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4 box-border">
          <h3 className="text-xl font-medium mb-4">{t('subs_monthly_total')}</h3>
          <p className="text-sm leading-relaxed">
            {t('subs_monthly_text_part1')}{aylikToplam.toLocaleString('tr-TR')} {currencySymbol}<br/>{t('subs_monthly_text_part2')}
          </p>
        </div>
        <div className="w-full sm:w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4 box-border">
          <h3 className="text-xl font-medium mb-4">{t('subs_next_payment')}</h3>
          {siradakiOdeme ? (
            <p className="text-sm leading-relaxed">
              {siradakiOdeme.subscription_name}<br/>
              {getKalanGun(siradakiOdeme.payment_day) === 0 ? t('subs_today') : `${getKalanGun(siradakiOdeme.payment_day)}${t('subs_days_later_suffix')}`} ({Number(siradakiOdeme.cost).toLocaleString('tr-TR')} {currencySymbol})
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">{t('subs_empty')}</p>
          )}
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 tracking-wider text-center">{t('subs_title')}</h2>

      <div className={`w-full ${sliderMaxWidthClass} overflow-hidden mb-6 min-h-[320px] transition-all duration-300 box-border`}>
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center text-sm text-gray-400 min-h-[300px]">
              {t('subs_loading')}
            </div>
          ) : (
            sortedListWithAdd.map((item) => {
              if (item.id === 'add-card') {
                return (
                  <div key="add-card" className={`${cardWidthClass} p-2 flex-shrink-0 box-border`}>
                    <div 
                      onClick={() => setIsAddOpen(true)}
                      className="w-full h-[300px] bg-[#B9B9B9] rounded-2xl shadow-lg border border-black/5 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <span className="text-4xl text-white">+</span>
                    </div>
                  </div>
                );
              }

              const sub = item as Subscription;
              const kalanGun = getKalanGun(sub.payment_day);
              const abonelikSuresi = getAbonelikSuresi(sub.start_date);

              return (
                <div key={sub.id} className={`${cardWidthClass} p-2 flex-shrink-0 box-border`}>
                  <div 
                    style={{ backgroundColor: getCardColor(sub.payment_day, sub.is_trial) }}
                    className="w-full h-[300px] rounded-2xl shadow-lg p-5 flex flex-col relative border border-black/5 transition-transform hover:scale-[1.02] box-border"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/10">
                        <img 
                          src={getLogoUrl(sub.subscription_name)} 
                          alt={sub.subscription_name} 
                          className="w-6 h-6 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2721/2721980.png'; }}
                        />
                      </div>
                      <button onClick={() => { setSelectedSubscription(sub); setIsEditOpen(true); }} className="text-[12px] font-regular hover:underline">{t('subs_edit')}</button>
                    </div>

                    <h4 className="text-[15px] font-semibold mb-3 truncate">{sub.subscription_name}</h4>
                    
                    <div className="space-y-2 text-[12px] font-regular">
                      <p>{Number(sub.cost).toLocaleString('tr-TR')} {currencySymbol}{t('subs_per_month')}</p>
                      <p className="font-medium">{kalanGun === 0 ? t('subs_today_payment') : `${kalanGun}${t('subs_days_later_payment_suffix')}`}</p>
                      <p className="pt-2">{abonelikSuresi}{t('subs_months_subscribed_suffix')}</p>
                      <p className="text-[11px] opacity-80 italic whitespace-pre-line">{t('subs_payment_day_p1')}<span className="font-bold">{sub.payment_day}</span>{t('subs_payment_day_p2')}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex gap-3 mb-10 items-center">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 flex-shrink-0 transition-all duration-300 rounded-full ${activeIndex === i ? 'w-8 bg-[#B9B9B9]' : 'w-2 bg-[#D9D9D9]'}`}
          />
        ))}
      </div>

      <div className="flex gap-10">
        <Button variant="delete" className="w-[160px] h-[35px] text-[12px] shadow-sm" onClick={() => setIsDeleteOpen(true)}>
          {t('subs_delete_btn')}
        </Button>
      </div>

      {isAddOpen && <AbonelikEkleModal onClose={() => { setIsAddOpen(false); fetchSubscriptions(); }} />}
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
          onClose={() => { setIsEditOpen(false); setSelectedSubscription(null); fetchSubscriptions(); }} 
          onSuccess={() => { fetchSubscriptions(); window.dispatchEvent(new Event('abonelikGuncellendi')); }}
        />
      )}
      {isDeleteOpen && <AbonelikSilModal subscriptions={subscriptions} onClose={() => { setIsDeleteOpen(false); fetchSubscriptions(); }} />}
    </div>
  );
};

export default Subscriptions;
import React, { useState } from 'react';
import Button from '../components/common/Button';
import { AbonelikEkleModal, AbonelikDuzenleModal } from '../components/common/AbonelikEkleVeDuzenleModal';
import AbonelikSilModal from '../components/common/AbonelikSilModal';

interface Subscription {
  id: number;
  ad: string;
  fiyat: number;
  kalanGun: number;
  sure: number;
  oncekiFiyat: number;
  logo: string;
  isTrial?: boolean;
}

const Subscriptions = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const subscriptions: Subscription[] = [
    { id: 1, ad: 'Youtube Premium', fiyat: 52.99, kalanGun: 1, sure: 6, oncekiFiyat: 32.99, logo: 'https://www.youtube.com/favicon.ico' },
    { id: 2, ad: 'Spotify Premium', fiyat: 52.99, kalanGun: 3, sure: 14, oncekiFiyat: 52.99, logo: 'https://www.spotify.com/favicon.ico' },
    { id: 3, ad: 'Gmail Workspace', fiyat: 699.99, kalanGun: 16, sure: 27, oncekiFiyat: 699.99, logo: 'https://www.google.com/favicon.ico' },
  ];

  const getCardColor = (sub: Subscription) => {
    if (sub.isTrial) return '#B9B9B9';
    if (sub.kalanGun <= 2) return '#FF9E9E';
    if (sub.kalanGun <= 5) return '#FFF6AF';
    return '#B1E5FF';
  };

  const aylikToplam = subscriptions.reduce((acc, curr) => acc + curr.fiyat, 0);
  const siradakiOdeme = [...subscriptions].sort((a, b) => a.kalanGun - b.kalanGun)[0];

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto flex flex-col items-center">
      
      <div className="flex gap-10 mb-16">
        <div className="w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4">
          <h3 className="text-xl font-medium mb-4">Aylık Toplam</h3>
          <p className="text-sm leading-relaxed">Bu ay toplam {aylikToplam.toLocaleString('tr-TR')} ₺<br/>abonelik ödemeniz var.</p>
        </div>
        <div className="w-[280px] h-[160px] bg-[#EBEBEB]/60 border border-black/20 rounded-sm flex flex-col items-center justify-center text-center p-4">
          <h3 className="text-xl font-medium mb-4">Sıradaki Ödeme</h3>
          <p className="text-sm leading-relaxed">{siradakiOdeme.ad}<br/>{siradakiOdeme.kalanGun} gün sonra ({siradakiOdeme.fiyat} ₺)</p>
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

        {subscriptions.map((sub) => (
          <div 
            key={sub.id} 
            style={{ backgroundColor: getCardColor(sub) }}
            className="min-w-[220px] h-[300px] rounded-2xl shadow-md p-5 flex flex-col relative border border-black/5"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/10">
                <img src={sub.logo} alt={sub.ad} className="w-6 h-6 object-contain" />
              </div>
              <button 
                onClick={() => setIsEditOpen(true)}
                className="text-[12px] font-regular hover:underline"
              >
                Düzenle
              </button>
            </div>

            <h4 className="text-[15px] font-semibold mb-3">{sub.ad}</h4>
            
            <div className="space-y-2 text-[12px] font-regular">
              <p>{sub.fiyat} ₺ /ay</p>
              <p className="font-medium">{sub.kalanGun} Gün Sonra Ödeme</p>
              <p className="pt-2">{sub.sure} Aydır Abonesin</p>
              <p className="text-[11px] opacity-80 italic">
                Önceki ay <br/> {sub.oncekiFiyat} ₺ /ay ödedin.
              </p>
            </div>
          </div>
        ))}
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

      {isAddOpen && <AbonelikEkleModal onClose={() => setIsAddOpen(false)} />}
      {isEditOpen && <AbonelikDuzenleModal onClose={() => setIsEditOpen(false)} />}
      {isDeleteOpen && <AbonelikSilModal onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
};

export default Subscriptions;
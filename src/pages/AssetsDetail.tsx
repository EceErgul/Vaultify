import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import VarlikAyrintisiDuzenle from '../components/common/VarlikAyrintisiDuzenleModal';

const AssetsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lastUpdate] = useState("1dk önce");

  const assetName = id === "1" ? "APPLE" : "Altın"; 

  const details = [
    { id: 1, date: '02.05.2026', amount: '10 gram', price: '7.100 ₺', current: '7500 ₺', profit: '+400 ₺', ratio: '%5.6' },
    { id: 2, date: '18.04.2026', amount: '18 gram', price: '6.800 ₺', current: '7500 ₺', profit: '+700 ₺', ratio: '%10.2' },
    { id: 3, date: '14.04.2026', amount: '25 gram', price: '6.500 ₺', current: '7500 ₺', profit: '+1.000 ₺', ratio: '%15.3' },
    { id: 4, date: '09.04.2026', amount: '35 gram', price: '6.300 ₺', current: '7500 ₺', profit: '+1.200 ₺', ratio: '%19.0' },
  ];

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Bu varlık kaydını silmek istediğinize emin misiniz?");
    if (confirmDelete) {
      console.log(`${id} silindi.`);
    }
  };

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-center items-center relative mb-10">
        <h1 className="text-3xl font-medium text-black uppercase tracking-tight">
          {assetName} Detayları
        </h1>
        <div className="absolute right-0">
          <Button 
            variant="add" 
            className="w-[130px] h-[35px] text-sm shadow-md"
            onClick={() => navigate(-1)}
          >
            ← Geri Dön
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Toplam Miktar", value: "88 gram" },
          { label: "Ortalama Maliyet", value: "2.550 ₺" },
          { label: "Toplam Maliyet", value: "89.250 ₺" },
          { label: "Toplam Değer", value: "92.500 ₺" }
        ].map((card, i) => (
          <div key={i} className="bg-[#FFF5D9] border border-black rounded-[15px] h-44 flex flex-col items-center justify-center p-4 text-center shadow-sm transition-transform hover:scale-[1.02]">
            <span className="font-medium text-lg text-gray-700 mb-4 leading-tight">{card.label}</span>
            <span className="font-bold text-2xl text-black">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-[11px] font-medium text-gray-500 italic">En Son Güncelleme: {lastUpdate}</span>
      </div>

      <div className="border border-black overflow-hidden rounded-md shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FFEF79] h-12 border-b border-black text-black text-sm">
              <th className="border-r border-black p-2 font-bold uppercase">Alış Tarihi</th>
              <th className="border-r border-black p-2 font-bold uppercase">Miktar</th>
              <th className="border-r border-black p-2 font-bold uppercase">Alış Fiyatı</th>
              <th className="border-r border-black p-2 font-bold uppercase">Bugünkü Değer</th>
              <th className="border-r border-black p-2 font-bold uppercase">Kâr/Zarar</th>
              <th className="p-2 font-bold uppercase">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, index) => {
              const isEven = (index + 1) % 2 === 0;
              const bgColor = isEven ? '#FFF5AD' : '#FFF5D9';

              return (
                <tr 
                  key={row.id} 
                  style={{ backgroundColor: bgColor }}
                  className="h-14 border-b border-black last:border-0 text-sm text-black hover:brightness-95 transition-all"
                >
                  <td className="border-r border-black text-center">{row.date}</td>
                  <td className="border-r border-black text-center">{row.amount}</td>
                  <td className="border-r border-black text-center">{row.price}</td>
                  <td className="border-r border-black text-center">{row.current}</td>
                  
                  <td className="border-r border-black text-center relative group cursor-help font-semibold">
                    <span className={row.profit.includes('+') ? 'text-green-700' : 'text-red-700'}>
                      {row.profit}
                    </span>
                    <div className="invisible group-hover:visible absolute z-20 -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 text-[11px] rounded-full shadow-xl">
                      Oran: {row.ratio}
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button 
                        onClick={() => setIsEditModalOpen(true)} 
                        className="hover:scale-125 transition-transform text-xl"
                        title="Düzenle"
                      >
                        📝
                      </button>
                      <span className="text-gray-400">|</span>
                      <button 
                        onClick={() => handleDelete(row.id)} 
                        className="hover:scale-125 transition-transform text-xl"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <VarlikAyrintisiDuzenle 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default AssetsDetail;
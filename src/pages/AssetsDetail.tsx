import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import VarlikAyrintisiDuzenle from '../components/common/VarlikAyrintisiDuzenleModal';

const AssetsDetail = ({ assetName = "Altın" }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lastUpdate] = useState("1dk önce");

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
    <div className="p-8 font-inter max-w-6xl mx-auto">
      <div className="flex justify-center items-center relative mb-10">
        <h1 className="text-3xl font-semibold text-black">{assetName}</h1>
        <div className="absolute right-0">
          <Button 
            variant="add" 
            className="w-[120px] h-[35px] text-sm shadow-md"
            onClick={() => navigate(-1)}
          >
            ← Geri Dön
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-12">
        {[
          { label: "Toplam Miktar", value: "88 gram" },
          { label: "Ortalama Maliyet", value: "2.550 ₺" },
          { label: "Toplam Maliyet", value: "89.250 ₺" },
          { label: "Toplam Değer", value: "92.500 ₺" }
        ].map((card, i) => (
          <div key={i} className="bg-[#FFF5D9] border border-black rounded-[15px] h-48 flex flex-col items-center justify-center p-4 text-center shadow-sm">
            <span className="font-medium text-xl text-black mb-6 leading-tight">{card.label}</span>
            <span className="font-regular text-lg text-black">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end mb-1 px-1">
        <span className="text-[10px] font-regular text-gray-500">En Son Güncelleme: {lastUpdate}</span>
      </div>

      <div className="border border-black overflow-hidden rounded-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FFEF79] h-10 border-b border-black text-black text-sm">
              <th className="border-r border-black p-2 font-medium">Alış Tarihi</th>
              <th className="border-r border-black p-2 font-medium">Miktar</th>
              <th className="border-r border-black p-2 font-medium">Alış Fiyatı</th>
              <th className="border-r border-black p-2 font-medium">Bugünkü Değer</th>
              <th className="border-r border-black p-2 font-medium">Kâr/Zarar</th>
              <th className="p-2 font-medium">İşlem</th>
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
                  className="h-12 border-b border-black last:border-0 text-sm text-black"
                >
                  <td className="border-r border-black text-center font-regular">{row.date}</td>
                  <td className="border-r border-black text-center font-regular">{row.amount}</td>
                  <td className="border-r border-black text-center font-regular">{row.price}</td>
                  <td className="border-r border-black text-center font-regular">{row.current}</td>
                  
                  <td className="border-r border-black text-center font-regular relative group cursor-help">
                    {row.profit}
                    <div className="invisible group-hover:visible absolute z-10 -top-8 left-1/2 -translate-x-1/2 bg-white border border-black px-2 py-1 text-[10px] rounded shadow-lg">
                      {row.ratio}
                    </div>
                  </td>

                  <td className="text-center font-regular">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => setIsEditModalOpen(true)} className="hover:scale-110 transition-transform">
                        <span role="img" aria-label="edit">📝</span>
                      </button>
                      <span className="text-gray-400">/</span>
                      <button onClick={() => handleDelete(row.id)} className="hover:scale-110 transition-transform">
                        <span role="img" aria-label="delete">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <VarlikAyrintisiDuzenle onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default AssetsDetail;
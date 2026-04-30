import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';

const Assets = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const Assets = [
    { id: 1, ad: 'APPLE', tur: 'Hisse', miktar: '10 adet', fiyat: '220 $', toplam: '72.600 ₺' },
    { id: 2, ad: 'Altın', tur: 'Döviz', miktar: '50 gram', fiyat: '500.000 ₺', toplam: '500.000 ₺' },
    { id: 3, ad: 'Euro', tur: 'Döviz', miktar: '9.000 €', fiyat: '9.000 €', toplam: '50.000 ₺' },
    { id: 4, ad: 'İşbank Faiz', tur: 'Faiz', miktar: '560.000 ₺', fiyat: '560.000 ₺', toplam: '560.000 ₺' },
  ];

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto">

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Toplam Varlıklarım</h2>
        <div className="flex flex-col gap-2">
          <Button variant="add" className="w-[120px] h-[30px] text-[10px]">+ Varlık Ekle</Button>
          <GeneralDeleteComponent label="Varlık Sil" className="w-[120px] h-[30px] text-[10px]" onDelete={() => {}} />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2 ml-1">
        <GeneralDeleteCheckbox checked={selectedIds.length === Assets.length} onChange={() => {}} />
        <span className="text-sm font-medium">Hepsini Seç</span>
      </div>

      <div className="border border-black overflow-hidden rounded-sm">
        <table className="w-full border-collapse">
          <thead>            
            <tr className="bg-[#7ECCF4] h-10 border-b border-black">
              <th className="w-12 border-r border-black"></th>
              <th className="border-r border-black p-2 font-medium text-black">Varlık</th>
              <th className="border-r border-black p-2 font-medium text-black">Tür</th>
              <th className="border-r border-black p-2 font-medium text-black">Miktar</th>
              <th className="border-r border-black p-2 font-medium text-black">Fiyat</th>
              <th className="p-2 font-medium text-black">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {Assets.map((item, index) => {
              const isEvenRow = (index + 1) % 2 === 0;
              const bgColor = isEvenRow ? '#B1E5FF' : '#D8F2FF';

              return (
                <tr 
                  key={item.id} 
                  style={{ backgroundColor: bgColor }}
                  className="h-12 border-b border-black last:border-0 text-sm text-black"
                >
                  <td className="flex justify-center items-center h-12 border-r border-black/20">
                    <GeneralDeleteCheckbox 
                      checked={selectedIds.includes(item.id)} 
                      onChange={() => {}} 
                    />
                  </td>
                  <td className="border-r border-black px-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.ad}</span>
                      <button 
                        onClick={() => navigate('/assets-detail')}
                        className="hover:translate-x-1 transition-transform p-1 font-bold"
                      >
                        {">"}
                      </button>
                    </div>
                  </td>
                  <td className="border-r border-black text-center">{item.tur}</td>
                  <td className="border-r border-black text-center">{item.miktar}</td>
                  <td className="border-r border-black text-center">{item.fiyat}</td>
                  <td className="text-center font-bold">{item.toplam}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="apply" className="w-[120px] h-[35px] text-sm">Onayla</Button>
      </div>
    </div>
  );
};

export default Assets;
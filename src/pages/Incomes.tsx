import React, { useState } from 'react';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import { GelirEkleModal, GelirDuzenleModal } from '../components/common/GelirModallari';

const Incomes = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const gelirler = [
    { id: 1, tarih: '20.05.2026', ad: 'Maaş', kategori: 'Maaş', miktar: '315.000 ₺' },
    { id: 2, tarih: '19.05.2026', ad: 'Kira', kategori: 'Kira', miktar: '85.000 ₺' },
    { id: 3, tarih: '19.05.2026', ad: 'Varlıklarım', kategori: 'Varlıklarım', miktar: '3.000.000 ₺' },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-semibold text-black">Gelirler</h2>
        <div className="flex flex-col gap-2">
          <Button 
            variant="add" 
            className="w-[140px] h-[32px] text-[11px] shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Gelir Ekle
          </Button>
          
          <GeneralDeleteComponent 
            label="Gelir Sil" 
            className="w-[140px] h-[32px] text-[11px]" 
            onDelete={() => {
              setIsDeleteMode(!isDeleteMode);
              setSelectedIds([]);
            }} 
          />

          <Button 
            variant="filter" 
            className="w-[140px] h-[32px] text-[11px] bg-[#FFEF79] border border-black shadow-sm text-black"
            onClick={() => setIsEditModalOpen(true)}
          >
            Gelir Düzenle
          </Button>
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in duration-300">
          <GeneralDeleteCheckbox 
            checked={selectedIds.length === gelirler.length && gelirler.length > 0} 
            onChange={() => {
              if (selectedIds.length === gelirler.length) setSelectedIds([]);
              else setSelectedIds(gelirler.map(g => g.id));
            }} 
          />
          <span className="text-sm font-regular">Hepsini Seç</span>
        </div>
      )}

      <div className="border border-black overflow-hidden rounded-sm shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#7ECCF4] h-11 border-b border-black text-black text-sm">
              {isDeleteMode && <th className="w-12 border-r border-black"></th>}
              <th className="border-r border-black p-2 font-regular">Tarih</th>
              <th className="border-r border-black p-2 font-regular">Gelir Adı</th>
              <th className="border-r border-black p-2 font-regular">Kategori</th>
              <th className="p-2 font-regular">Miktar</th>
            </tr>
          </thead>
          <tbody>
            {gelirler.map((item, index) => {
              const isEven = (index + 1) % 2 === 0;
              const bgColor = isEven ? '#B1E5FF' : '#D8F2FF';

              return (
                <tr 
                  key={item.id} 
                  style={{ backgroundColor: bgColor }}
                  className="h-12 border-b border-black last:border-0 text-sm text-black"
                >
                  {isDeleteMode && (
                    <td className="text-center border-r border-black/20">
                      <div className="flex justify-center items-center h-full">
                        <GeneralDeleteCheckbox 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => toggleSelect(item.id)} 
                        />
                      </div>
                    </td>
                  )}
                  <td className="border-r border-black px-4 text-center font-regular">{item.tarih}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.ad}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.kategori}</td>
                  <td className="text-center font-regular px-4 font-regular">{item.miktar}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isDeleteMode && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button 
            variant="apply" 
            className="w-[110px] h-[32px] text-sm shadow-md"
            onClick={() => console.log("Silinecek Gelirler:", selectedIds)}
          >
            Onayla
          </Button>
        </div>
      )}

      {isAddModalOpen && (
        <GelirEkleModal onClose={() => setIsAddModalOpen(false)} />
      )}
      
      {isEditModalOpen && (
        <GelirDuzenleModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default Incomes;
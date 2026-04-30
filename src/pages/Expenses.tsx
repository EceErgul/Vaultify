import React, { useState } from 'react';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import HarcamaEkleModal from '../components/common/HarcamaEkleModal';
import FiltreleModal from '../components/common/FiltreleModal';

const Expenses = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filterCount, setFilterCount] = useState(2);

  const harcamalar = [
    { id: 1, tarih: '20.05.2026 14.06.34', ad: 'Market Alışverişi', kategori: 'Ev Alışverişi', yontem: 'Kredi kartı', tutar: '4.000 ₺' },
    { id: 2, tarih: '19.05.2026 18.46.09', ad: 'Giysi Alışverişi', kategori: 'Giysi Alışverişi', yontem: 'Kredi kartı', tutar: '6.500 ₺' },
    { id: 3, tarih: '19.05.2026 18.35.57', ad: 'Dışarıda Yemek', kategori: 'Eğlence', yontem: 'Kredi kartı', tutar: '750 ₺' },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Toplam Harcamalarım</h2>
        <div className="flex flex-col gap-2">
          <Button 
            variant="add" 
            className="w-[140px] h-[32px] text-[11px] shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Harcama Ekle
          </Button>
          
          <GeneralDeleteComponent 
            label="Harcama Sil" 
            className="w-[140px] h-[32px] text-[11px]" 
            onDelete={() => {
                setIsDeleteMode(!isDeleteMode);
                setSelectedIds([]);
            }} 
          />

          <Button 
            variant="filter"
            className="w-[140px] h-[32px] text-[11px] bg-[#FFEF79] border border-black shadow-sm"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filtrele ≡ ({filterCount})
          </Button>
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <GeneralDeleteCheckbox 
            checked={selectedIds.length === harcamalar.length && harcamalar.length > 0} 
            onChange={() => {
              if (selectedIds.length === harcamalar.length) setSelectedIds([]);
              else setSelectedIds(harcamalar.map(h => h.id));
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
              <th className="border-r border-black p-2 font-regular">Harcama Adı</th>
              <th className="border-r border-black p-2 font-regular">Kategori</th>
              <th className="border-r border-black p-2 font-regular">Ödeme Yöntemi</th>
              <th className="p-2 font-regular">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {harcamalar.map((item, index) => {
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
                  <td className="border-r border-black px-4 font-regular">{item.ad}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.kategori}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.yontem}</td>
                  <td className="text-center font-regular px-4">{item.tutar}</td>
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
            className="w-[120px] h-[35px] text-sm shadow-md"
            onClick={() => console.log("Silinecekler:", selectedIds)}
          >
            Onayla
          </Button>
        </div>
      )}

      {isAddModalOpen && (
        <HarcamaEkleModal onClose={() => setIsAddModalOpen(false)} />
      )}
      
      {isFilterModalOpen && (
        <FiltreleModal 
          onClose={() => setIsFilterModalOpen(false)}
          setFilterCount={setFilterCount}
        />
      )}
    </div>
  );
};

export default Expenses;
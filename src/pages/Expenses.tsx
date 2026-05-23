import React, { useState, useMemo } from 'react';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import HarcamaEkleModal from '../components/common/HarcamaEkleModal';
import FiltreleModal, { FilterState } from '../components/common/FiltreleModal';

const initialFilterValues: FilterState = {
  searchTerm: '',
  date: '',
  category: null,
  paymentMethod: null,
  minAmount: '',
  maxAmount: '',
  expenseName: '',
  dateSort: 'asc',
  amountSort: 'asc',
};

const Expenses = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilterValues);

  const harcamalar = [
    { id: 1, tarih: '20.05.2026 14.06.34', ad: 'Market Alışverişi', kategori: 'Ev Alışverişi', yontem: 'Kredi Kartı', tutar: '4.000 ₺', rawTutar: 4000 },
    { id: 2, tarih: '19.05.2026 18.46.09', ad: 'Giysi Alışverişi', kategori: 'Giysi Alışverişi', yontem: 'Kredi Kartı', tutar: '6.500 ₺', rawTutar: 6500 },
    { id: 3, tarih: '19.05.2026 18.35.57', ad: 'Dışarıda Yemek', kategori: 'Eğlence', yontem: 'Kredi Kartı', tutar: '750 ₺', rawTutar: 750 },
  ];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentFilters.searchTerm.trim() !== '') count++;
    if (currentFilters.date.trim() !== '') count++;
    if (currentFilters.category !== null) count++;
    if (currentFilters.paymentMethod !== null) count++;
    if (currentFilters.minAmount.trim() !== '' || currentFilters.maxAmount.trim() !== '') count++;
    if (currentFilters.expenseName.trim() !== '') count++;
    return count;
  }, [currentFilters]);

  const filteredHarcamalar = useMemo(() => {
    let result = [...harcamalar];

    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase();
      result = result.filter(item => 
        item.ad.toLowerCase().includes(term) || 
        item.kategori.toLowerCase().includes(term)
      );
    }

    if (currentFilters.expenseName) {
      result = result.filter(item => 
        item.ad.toLowerCase().includes(currentFilters.expenseName.toLowerCase())
      );
    }

    if (currentFilters.category) {
      result = result.filter(item => item.kategori === currentFilters.category);
    }

    if (currentFilters.paymentMethod) {
      result = result.filter(item => item.yontem.toLowerCase() === currentFilters.paymentMethod?.toLowerCase());
    }

    if (currentFilters.minAmount) {
      result = result.filter(item => item.rawTutar >= parseFloat(currentFilters.minAmount));
    }
    if (currentFilters.maxAmount) {
      result = result.filter(item => item.rawTutar <= parseFloat(currentFilters.maxAmount));
    }

    if (currentFilters.date) {
      result = result.filter(item => item.tarih.startsWith(currentFilters.date));
    }

    result.sort((a, b) => {
      const parseDateStr = (str: string) => {
        const [datePart, timePart] = str.split(' ');
        const [d, m, y] = datePart.split('.');
        const [h, min, s] = timePart.split('.');
        return new Date(`${y}-${m}-${d}T${h}:${min}:${s}`).getTime();
      };

      const dateA = parseDateStr(a.tarih);
      const dateB = parseDateStr(b.tarih);

      if (dateA !== dateB) {
        return currentFilters.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
      }

      return currentFilters.amountSort === 'asc' 
        ? a.rawTutar - b.rawTutar 
        : b.rawTutar - a.rawTutar;
    });

    return result;
  }, [currentFilters]);

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
            Filtrele ≡ ({activeFilterCount})
          </Button>
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <GeneralDeleteCheckbox 
            checked={selectedIds.length === filteredHarcamalar.length && filteredHarcamalar.length > 0} 
            onChange={() => {
              if (selectedIds.length === filteredHarcamalar.length) setSelectedIds([]);
              else setSelectedIds(filteredHarcamalar.map(h => h.id));
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
            {filteredHarcamalar.map((item, index) => {
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
                  <td className="border-r border-black px-4 text-center font-regular">{item.yontem}</td>
                  <td className="text-center font-regular px-4">{item.tutar}</td>
                </tr>
              );
            })}
            {filteredHarcamalar.length === 0 && (
              <tr className="h-12 bg-white">
                <td colSpan={isDeleteMode ? 6 : 5} className="text-center text-gray-400 italic text-xs">
                  Aranan kriterlere uygun harcama bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDeleteMode && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button 
            variant="applyDelete" 
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
          setFilterCount={() => {}}
          initialFilters={currentFilters}
          onApplyFilters={(updatedFilters) => setCurrentFilters(updatedFilters)}
        />
      )}
    </div>
  );
};

export default Expenses;
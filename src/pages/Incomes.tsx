import React, { useState, useEffect } from 'react';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import { GelirEkleModal, GelirDuzenleModal } from '../components/common/GelirModallari';
import BaseModal from '../components/common/Modal';
import { apiRequest } from '../utils/api';

interface IncomeItem {
  id: string;
  date: string;
  income_name: string;
  income_category: string;
  income_amount: number | string;
}

const Incomes = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Onay modalı state'i
  const [selectedIncome, setSelectedIncome] = useState<IncomeItem | null>(null);
  const [gelirler, setGelirler] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/incomes');
      setGelirler(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRowDoubleClick = (item: IncomeItem) => {
    if (isDeleteMode) return;
    setSelectedIncome(item);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map(id => apiRequest(`/incomes/${id}`, { method: 'DELETE' }))
      );
      
      fetchIncomes();
      setIsDeleteMode(false);
      setSelectedIds([]);
      setIsConfirmModalOpen(false); // Modalı kapat
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-black">Gelirler</h2>
          {!isDeleteMode && (
            <p className="text-xs text-gray-400 mt-1 italic">
              Düzenlemek istediğiniz gelirin üzerine <span className="font-semibold text-gray-600">çift tıklayabilirsiniz.</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="add" 
            className="w-[140px] h-[32px] text-[11px] shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Gelir Ekle
          </Button>
          
          <GeneralDeleteComponent
            label={isDeleteMode ? "Vazgeç" : "Gelir Sil"} 
            className="w-[140px] h-[32px] text-[11px]" 
            onDelete={() => {
              setIsDeleteMode(!isDeleteMode);
              setSelectedIds([]);
            }} 
          />
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
            {loading ? (
              <tr className="h-12 bg-white">
                <td colSpan={isDeleteMode ? 5 : 4} className="text-center text-xs">
                  Gelirler yükleniyor...
                </td>
              </tr>
            ) : gelirler.map((item, index) => {
              const isEven = (index + 1) % 2 === 0;
              const bgColor = isEven ? '#B1E5FF' : '#D8F2FF';
              const formattedDate = new Date(item.date).toLocaleDateString('tr-TR');

              return (
                <tr 
                  key={item.id} 
                  style={{ backgroundColor: bgColor }}
                  onDoubleClick={() => handleRowDoubleClick(item)} 
                  className={`h-12 border-b border-black last:border-0 text-sm text-black transition-all select-none ${
                    !isDeleteMode ? 'cursor-pointer hover:opacity-85' : ''
                  }`}
                >
                  {isDeleteMode && (
                    <td 
                      className="text-center border-r border-black/20"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <div className="flex justify-center items-center h-full">
                        <GeneralDeleteCheckbox 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => toggleSelect(item.id)} 
                        />
                      </div>
                    </td>
                  )}
                  <td className="border-r border-black px-4 text-center font-regular">{formattedDate}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.income_name}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.income_category}</td>
                  <td className="text-center font-regular px-4">{Number(item.income_amount).toLocaleString('tr-TR')} ₺</td>
                </tr>
              );
            })}
            {!loading && gelirler.length === 0 && (
              <tr className="h-12 bg-white">
                <td colSpan={isDeleteMode ? 5 : 4} className="text-center text-gray-400 italic text-xs">
                  Henüz gelir kaydı bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDeleteMode && selectedIds.length > 0 && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button 
            variant="applyDelete" 
            className="w-[110px] h-[32px] text-sm shadow-md"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            Onayla
          </Button>
        </div>
      )}

      {isConfirmModalOpen && (
        <BaseModal title="Silme Onayı" onClose={() => setIsConfirmModalOpen(false)}>
          <div className="p-4 text-center font-inter">
            <p className="mb-6 text-sm text-[#333D50]">
              Seçili <span className="font-bold">{selectedIds.length}</span> geliri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="add" onClick={() => setIsConfirmModalOpen(false)} className="w-[100px]">Vazgeç</Button>
              <Button variant="applyDelete" onClick={handleConfirmDelete} className="w-[100px]">Evet, Sil</Button>
            </div>
          </div>
        </BaseModal>
      )}

      {isAddModalOpen && (
        <GelirEkleModal onClose={() => { setIsAddModalOpen(false); fetchIncomes(); }} />
      )}
      
      {isEditModalOpen && selectedIncome && (
        <GelirDuzenleModal 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedIncome(null);
            fetchIncomes();
          }}
          initialData={{
            id: selectedIncome.id,
            date: selectedIncome.date,
            name: selectedIncome.income_name,
            category: selectedIncome.income_category as any,
            amount: Number(selectedIncome.income_amount)
          }}
        />
      )}
    </div>
  );
};

export default Incomes;
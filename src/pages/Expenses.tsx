import React, { useState, useMemo, useEffect } from 'react';
import { GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import HarcamaEkleModal from '../components/common/HarcamaEkleModal';
import FiltreleModal, { FilterState } from '../components/common/FiltreleModal';
import BaseModal from '../components/common/Modal';
import { apiRequest } from '../utils/api';

interface Expense {
  id: string;
  expense_name: string;
  expense_category: string;
  payment_method: string;
  expenses_amount: number | string;
  date: string;
}

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilterValues);
  const [harcamalar, setHarcamalar] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/expenses');
      setHarcamalar(Array.isArray(data) ? data : (data.expenses || data.data || []));
    } catch (error) {
      console.error(error);
      setHarcamalar([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

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
        item.expense_name.toLowerCase().includes(term) || 
        item.expense_category.toLowerCase().includes(term)
      );
    }
    if (currentFilters.expenseName) {
      result = result.filter(item => item.expense_name.toLowerCase().includes(currentFilters.expenseName.toLowerCase()));
    }
    if (currentFilters.category) {
      result = result.filter(item => item.expense_category === currentFilters.category);
    }
    if (currentFilters.paymentMethod) {
      result = result.filter(item => item.payment_method.toLowerCase() === currentFilters.paymentMethod?.toLowerCase());
    }
    if (currentFilters.minAmount) {
      result = result.filter(item => Number(item.expenses_amount) >= parseFloat(currentFilters.minAmount));
    }
    if (currentFilters.maxAmount) {
      result = result.filter(item => Number(item.expenses_amount) <= parseFloat(currentFilters.maxAmount));
    }
    if (currentFilters.date) {
      result = result.filter(item => item.date.startsWith(currentFilters.date));
    }
    result.sort((a, b) => {
      const amountA = Number(a.expenses_amount);
      const amountB = Number(b.expenses_amount);
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (currentFilters.amountSort) return currentFilters.amountSort === 'asc' ? amountA - amountB : amountB - amountA;
      return currentFilters.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return result;
  }, [harcamalar, currentFilters]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => apiRequest(`/expenses/${id}`, { method: 'DELETE' })));
      fetchExpenses();
      setIsDeleteMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Toplam Harcamalarım</h2>
        <div className="flex flex-col gap-2">
          <Button variant="add" className="w-[140px] h-[32px] text-[11px] shadow-sm" onClick={handleOpenAddModal}>+ Harcama Ekle</Button>
          
          {!isDeleteMode ? (
            <Button variant="delete" className="w-[140px] h-[32px] text-[11px]" onClick={() => setIsDeleteMode(true)}>Harcama Sil</Button>
          ) : (
            <Button variant="delete" className="w-[140px] h-[32px] text-[11px] !bg-gray-500 !text-white" onClick={() => { setIsDeleteMode(false); setSelectedIds([]); }}>Vazgeç</Button>
          )}

          <Button variant="filter" className="w-[140px] h-[32px] text-[11px] bg-[#FFEF79] border border-black shadow-sm" onClick={() => setIsFilterModalOpen(true)}>
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
              <th className="border-r border-black p-2 font-regular">Tutar</th>
              {!isDeleteMode && <th className="p-2 font-regular">İşlem</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="h-12 bg-white"><td colSpan={6} className="text-center text-xs">Harcamalar yükleniyor...</td></tr>
            ) : (Array.isArray(harcamalar) ? harcamalar : []).map((item, index) => {
              const isEven = (index + 1) % 2 === 0;
              const bgColor = isEven ? '#B1E5FF' : '#D8F2FF';
              const formattedDate = new Date(item.date).toLocaleDateString('tr-TR');

              return (
                <tr key={item.id} style={{ backgroundColor: bgColor }} className="h-12 border-b border-black last:border-0 text-sm text-black">
                  {isDeleteMode && (
                    <td className="text-center border-r border-black/20">
                      <GeneralDeleteCheckbox checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                    </td>
                  )}
                  <td className="border-r border-black px-4 text-center font-regular">{formattedDate}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.expense_name}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.expense_category}</td>
                  <td className="border-r border-black px-4 text-center font-regular">{item.payment_method}</td>
                  <td className="border-r border-black text-center font-regular px-4">{Number(item.expenses_amount).toLocaleString('tr-TR')} ₺</td>
                  {!isDeleteMode && (
                    <td className="text-center">
                      <button onClick={() => handleEdit(item)} className="text-xs underline text-blue-900 hover:text-black">Düzenle</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isDeleteMode && selectedIds.length > 0 && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button variant="applyDelete" className="w-[120px] h-[35px] text-sm shadow-md" onClick={() => setIsConfirmDeleteOpen(true)}>Onayla</Button>
        </div>
      )}

      {isModalOpen && (
        <HarcamaEkleModal 
          onClose={() => { setIsModalOpen(false); setEditingExpense(null); fetchExpenses(); }}
          onExpenseAdded={fetchExpenses}
          initialData={editingExpense ? { 
            id: editingExpense.id,
            date: editingExpense.date, 
            amount: editingExpense.expenses_amount, 
            category: editingExpense.expense_category, 
            name: editingExpense.expense_name,
            paymentMethod: editingExpense.payment_method 
          } : undefined}
          isEditMode={!!editingExpense}
        />
      )}
      
      {isFilterModalOpen && (
        <FiltreleModal onClose={() => setIsFilterModalOpen(false)} setFilterCount={() => {}} initialFilters={currentFilters} onApplyFilters={(updatedFilters) => setCurrentFilters(updatedFilters)} />
      )}

      {isConfirmDeleteOpen && (
        <BaseModal title="Harcamayı Sil" onClose={() => setIsConfirmDeleteOpen(false)}>
          <div className="p-4 text-center font-inter">
            <p className="text-sm mb-6">Seçtiğiniz <b>{selectedIds.length}</b> harcamayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex justify-center gap-3">
              <Button variant="cancel" className="w-[100px]" onClick={() => setIsConfirmDeleteOpen(false)}>Vazgeç</Button>
              <Button variant="applyDelete" className="w-[100px]" onClick={() => { handleConfirmDelete(); setIsConfirmDeleteOpen(false); }}>Sil</Button>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
};

export default Expenses;
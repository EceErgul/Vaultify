import React, { useState, useEffect } from 'react';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import Button from '../components/common/Button';
import { GelirEkleModal, GelirDuzenleModal } from '../components/common/GelirModallari';
import BaseModal from '../components/common/Modal';
import { apiRequest } from '../utils/api';
import Slider from '../components/common/Slider';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface IncomeItem {
  id: string;
  date: string;
  income_name: string;
  income_category: string;
  income_amount: number | string;
}

const Incomes = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<IncomeItem | null>(null);
  const [gelirler, setGelirler] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/incomes');
      setGelirler(Array.isArray(data) ? data : (data.incomes || data.data || []));
    } catch (error) {
      console.error(error);
      setGelirler([]);
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

  const handleRowEdit = (item: IncomeItem) => {
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
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-[var(--text-main)]">{t('inc_title')}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="add" 
            className="w-[140px] h-[32px] text-[11px] shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('inc_add_btn')}
          </Button>
          
          <GeneralDeleteComponent
            label={isDeleteMode ? t('inc_cancel_btn') : t('inc_delete_btn')} 
            className="w-[140px] h-[32px] text-[11px]" 
            onDelete={() => {
              setIsDeleteMode(!isDeleteMode);
              setSelectedIds([]);
            }} 
          />
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in duration-300 text-[var(--text-main)]">
          <GeneralDeleteCheckbox 
            checked={selectedIds.length === gelirler.length && gelirler.length > 0} 
            onChange={() => {
              if (selectedIds.length === gelirler.length) setSelectedIds([]);
              else setSelectedIds(gelirler.map(g => g.id));
            }} 
          />
          <span className="text-sm font-regular">{t('inc_select_all')}</span>
        </div>
      )}

      <div className="border border-[var(--border-color)] overflow-hidden rounded-sm shadow-sm bg-[var(--bg-card)]">
        <Slider>
        <table className="w-full border-collapse custom-income-table">
          <thead>
            <tr className="bg-[var(--table-header-bg)] h-11 border-b border-[var(--border-color)] text-[var(--text-main)] text-sm">
              <th className="w-12 border-r border-[var(--border-color)]"></th>
              <th className="border-r border-[var(--border-color)] p-2 font-regular">{t('inc_th_date')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-regular">{t('inc_th_name')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-regular">{t('inc_th_category')}</th>
              <th className="mobile-only border-r border-[var(--border-color)] p-2 font-regular">{t('inc_th_name_cat')}</th>

              <th className="p-2 font-regular">{t('inc_th_amount')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="h-12 bg-[var(--bg-card)]">
                <td colSpan={5} className="desktop-only text-center text-xs text-[var(--text-muted)]">{t('inc_loading')}</td>
                <td colSpan={4} className="mobile-only text-center text-xs text-[var(--text-muted)]">{t('inc_loading')}</td>
              </tr>
            ) : (Array.isArray(gelirler) ? gelirler : []).map((item, index) => {
              const isEven = (index + 1) % 2 === 0;
              const rowBg = isEven ? 'var(--table-row-even)' : 'var(--table-row-odd)';
              const formattedDate = new Date(item.date).toLocaleDateString('tr-TR');

              return (
                <tr 
                  key={item.id} 
                  style={{ backgroundColor: rowBg }}
                  className="h-12 border-b border-[var(--border-color)] last:border-0 text-sm text-[var(--text-main)] transition-colors"
                >
                  <td className="text-center border-r border-[var(--border-color)]">
                    <div className="flex justify-center items-center h-full">
                      {isDeleteMode ? (
                        <GeneralDeleteCheckbox 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => toggleSelect(item.id)} 
                        />
                      ) : (
                        <button
                          onClick={() => handleRowEdit(item)}
                          className="text-xs bg-[var(--table-header-bg)]/20 hover:bg-[var(--table-header-bg)]/40 text-[var(--text-main)] px-2 py-1 rounded transition-all"
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="border-r border-[var(--border-color)] px-4 text-center font-regular">
                    {formattedDate}
                  </td>
                  <td className="desktop-only border-r border-[var(--border-color)] px-4 text-center font-regular">
                    {item.income_name}
                  </td>
                  <td className="desktop-only border-r border-[var(--border-color)] px-4 text-center font-regular">
                    {item.income_category}
                  </td>
                  <td className="mobile-only border-r border-[var(--border-color)] px-4 font-regular">
                    <div className="combined-cell-content">
                      <span className="main-text">{item.income_name}</span>
                      <span className="sub-text text-[var(--text-muted)]">{item.income_category}</span>
                    </div>
                  </td>

                  <td className="text-center font-regular px-4">
                    {Number(item.income_amount).toLocaleString('tr-TR')} {currencySymbol}
                  </td>
                </tr>
              );
            })}
            {!loading && gelirler.length === 0 && (
              <tr className="h-12 bg-[var(--bg-card)]">
                <td colSpan={5} className="desktop-only text-center text-[var(--text-muted)] italic text-xs">
                  {t('inc_empty')}
                </td>
                <td colSpan={4} className="mobile-only text-center text-[var(--text-muted)] italic text-xs">
                  {t('inc_empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </Slider>
      </div>

      {isDeleteMode && selectedIds.length > 0 && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button 
            variant="applyDelete" 
            className="w-[110px] h-[32px] text-sm shadow-md"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            {t('inc_confirm_btn')}
          </Button>
        </div>
      )}

      {isConfirmModalOpen && (
        <BaseModal title={t('inc_modal_del_title')} onClose={() => setIsConfirmModalOpen(false)}>
          <div className="p-4 text-center font-inter text-[var(--text-main)]">
            <p className="mb-6 text-sm text-[var(--text-main)]">
              {t('inc_modal_del_text_part1')}<span className="font-bold">{selectedIds.length}</span>{t('inc_modal_del_text_part2')}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="add" onClick={() => setIsConfirmModalOpen(false)} className="w-[100px]">{t('inc_modal_cancel')}</Button>
              <Button variant="applyDelete" onClick={handleConfirmDelete} className="w-[100px]">{t('inc_modal_confirm')}</Button>
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
          }}
          onSuccess={fetchIncomes}
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
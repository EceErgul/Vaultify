import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import Button from '../components/common/Button';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import VarlikModallari from '../components/common/VarlikModallari';
import BaseModal from '../components/common/Modal';
import Slider from '../components/common/Slider';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/assets');
      const cleanData = response && response.data !== undefined ? response.data : response;
      setAssets(Array.isArray(cleanData) ? cleanData : []);
    } catch (err) {
      console.error("Varlıklar yüklenirken hata oluştu:", err);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSaveAsset = async (formData: any) => {
    try {
      const createdAsset = await apiRequest('/assets', {
        method: 'POST',
        body: {
          asset_name: formData.asset_name,
          asset_type: formData.asset_type,
          date: formData.date,
          total_quantity: formData.amount,
          total_cost: Number(formData.amount) * Number(formData.price)
        }
      });

      if (createdAsset) {
        fetchAssets();
      }
    } catch (error) {
      console.error("Varlık eklenirken bir hata oluştu:", error);
      alert(t('assets_err_add'));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await apiRequest(`/assets/${id}`, { method: 'DELETE' });
      }
      await fetchAssets();
      setSelectedIds([]);
      setIsDeleteMode(false);
      setIsDeleteConfirmModalOpen(false);
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
      alert(t('assets_err_delete'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && assets.length === 0) {
    return <div className="p-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg-page)] min-h-screen">{t('assets_loading')}</div>;
  }

  return (
    <div className="p-4 sm:p-8 font-inter max-w-7xl mx-auto bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-main)]">{t('assets_title')}</h2>
        <div className="flex flex-col gap-2 items-end">
          <Button variant="add" className="w-[140px] h-[30px] text-[10px]" onClick={() => setIsModalOpen(true)}>{t('assets_add_btn')}</Button>

          {!isDeleteMode && (
            <Button variant="delete" className="w-[140px] h-[30px] text-[10px]" onClick={() => setIsDeleteMode(true)}>{t('assets_delete_btn')}</Button>
          )}

          {isDeleteMode && (
            <Button variant="delete" className="w-[140px] h-[30px] text-[10px] !bg-gray-500 !text-white" onClick={() => { setIsDeleteMode(false); setSelectedIds([]); }}>{t('assets_cancel_btn')}</Button>
          )}
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in duration-300">
          <GeneralDeleteCheckbox checked={selectedIds.length === assets.length && assets.length > 0} onChange={handleSelectAll} />
          <span className="text-sm font-medium text-[var(--text-main)]">{t('assets_select_all')}</span>
        </div>
      )}

      <div className="border border-[var(--border-color)] overflow-hidden rounded-lg bg-[var(--bg-card)] shadow-v-soft">
        <Slider>
        <table className="w-full border-collapse custom-asset-table">
          <thead>
            <tr className="bg-[var(--sidebar-accent)]/20 h-10 border-b border-[var(--border-color)] text-[var(--text-main)] text-sm">
              {isDeleteMode && <th className="w-12 border-r border-[var(--border-color)]"></th>}
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-medium text-left pl-4">{t('assets_th_asset')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-medium">{t('assets_th_type')}</th>
              <th className="mobile-only border-r border-[var(--border-color)] p-2 font-medium">{t('assets_th_asset_type')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-medium">{t('assets_th_quantity')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-medium">{t('assets_th_cost')}</th>
              <th className="mobile-only border-r border-[var(--border-color)] p-2 font-medium">{t('assets_th_quantity_cost')}</th>
              <th className="p-2 font-medium">{t('assets_th_detail')}</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr className="h-12 bg-[var(--bg-card)]">
                <td colSpan={isDeleteMode ? 6 : 5} className="text-center text-sm font-medium py-4 text-[var(--text-muted)]">
                  {t('assets_empty')}
                </td>
              </tr>
            ) : (
              assets.map((item, index) => {
                const isEvenRow = (index + 1) % 2 === 0;
                
                return (
                  <tr 
                    key={item.id} 
                    className={`h-12 border-b border-[var(--border-color)] last:border-0 text-sm text-[var(--text-main)] transition-colors ${
                      isEvenRow ? 'bg-[var(--bg-page)]' : 'bg-[var(--bg-card)]'
                    }`}
                  >
                    {isDeleteMode && (
                      <td className="border-r border-[var(--border-color)] w-12 text-center">
                        <GeneralDeleteCheckbox 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => handleSelectItem(item.id)} 
                        />
                      </td>
                    )}
                    <td className="desktop-only border-r border-[var(--border-color)] px-4 font-medium">
                      {item.asset_name}
                    </td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center">{item.asset_type}</td>
                    <td className="mobile-only border-r border-[var(--border-color)] px-4">
                      <div className="combined-cell-content">
                        <span className="main-text font-medium">{item.asset_name}</span>
                        <span className="sub-text text-[var(--text-muted)]">{item.asset_type}</span>
                      </div>
                    </td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center">{Number(item.total_quantity).toString()}</td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center">{Number(item.total_cost).toString()} {currencySymbol}</td>
                    <td className="mobile-only border-r border-[var(--border-color)] px-4">
                      <div className="combined-cell-content">
                        <span className="main-text">{Number(item.total_quantity).toString()}</span>
                        <span className="sub-text text-[var(--text-muted)]">{Number(item.total_cost).toString()} {currencySymbol}</span>
                      </div>
                    </td>
                    <td className="text-center font-bold">
                      <button 
                        onClick={() => navigate(`/assets/${item.id}`)}
                        className="text-xs underline text-[var(--sidebar-accent)] hover:opacity-80 cursor-pointer"
                      >
                        {t('assets_view_transactions')}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </Slider>
      </div>

      {isDeleteMode && selectedIds.length > 0 && (
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="applyDelete" className="w-[140px] h-[35px] text-sm" onClick={() => setIsDeleteConfirmModalOpen(true)}>
            {t('assets_confirm_btn')}
          </Button>
        </div>
      )}

      {isDeleteConfirmModalOpen && (
        <BaseModal title={t('assets_delete_modal_title')} onClose={() => setIsDeleteConfirmModalOpen(false)}>
          <div className="p-6 text-center text-[var(--text-main)]">
            <p className="mb-6">{t('assets_delete_modal_text').replace('{count}', String(selectedIds.length))}</p>
            <div className="flex justify-center gap-4">
              <Button variant="cancel" onClick={() => setIsDeleteConfirmModalOpen(false)}>{t('assets_delete_modal_cancel')}</Button>
              <Button variant="applyDelete" onClick={handleConfirmDelete}>{t('assets_delete_modal_yes')}</Button>
            </div>
          </div>
        </BaseModal>
      )}

      <VarlikModallari 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode="add"
        onSave={handleSaveAsset} 
      />
    </div>
  );
};

export default Assets;
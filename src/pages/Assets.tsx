import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import Button from '../components/common/Button';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import VarlikModallari from '../components/common/VarlikModallari';
import BaseModal from '../components/common/Modal';
import Slider from '../components/common/Slider';

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

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
      alert("Varlık eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
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
      alert("Silme işlemi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && assets.length === 0) {
    return <div className="p-8 text-center text-sm text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="p-4 sm:p-8 font-inter max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-black">Toplam Varlıklarım</h2>
        <div className="flex flex-col gap-2 items-end">
          <Button variant="add" className="w-[120px] h-[30px] text-[10px]" onClick={() => setIsModalOpen(true)}>+ Varlık Ekle</Button>

          {!isDeleteMode && (
            <Button variant="delete" className="w-[120px] h-[30px] text-[10px]" onClick={() => setIsDeleteMode(true)}>- Varlık Sil</Button>
          )}

          {isDeleteMode && (
            <Button variant="delete" className="w-[120px] h-[30px] text-[10px] !bg-gray-500 !text-white" onClick={() => { setIsDeleteMode(false); setSelectedIds([]); }}>Vazgeç</Button>
          )}
        </div>
      </div>

      {isDeleteMode && (
        <div className="flex items-center gap-3 mb-2 ml-1 animate-in fade-in duration-300">
          <GeneralDeleteCheckbox checked={selectedIds.length === assets.length && assets.length > 0} onChange={handleSelectAll} />
          <span className="text-sm font-medium">Hepsini Seç</span>
        </div>
      )}

      <div className="border border-black overflow-hidden rounded-sm bg-white">
        <Slider>
        <table className="w-full border-collapse custom-asset-table">
          <thead>
            <tr className="bg-[#7ECCF4] h-10 border-b border-black text-black text-sm">
              {isDeleteMode && <th className="w-12 border-r border-black"></th>}
              <th className="desktop-only border-r border-black p-2 font-medium text-left pl-4">Varlık</th>
              <th className="desktop-only border-r border-black p-2 font-medium">Tür</th>
              <th className="mobile-only border-r border-black p-2 font-medium">Varlık / Tür</th>
              <th className="desktop-only border-r border-black p-2 font-medium">Miktar</th>
              <th className="desktop-only border-r border-black p-2 font-medium">Maliyet</th>
              <th className="mobile-only border-r border-black p-2 font-medium">Miktar / Maliyet</th>
              <th className="p-2 font-medium">Detay</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr className="h-12 bg-[#D8F2FF]">
                <td colSpan={isDeleteMode ? 6 : 5} className="text-center text-sm font-medium py-4">
                  Henüz varlık eklenmemiş.
                </td>
              </tr>
            ) : (
              assets.map((item, index) => {
                const isEvenRow = (index + 1) % 2 === 0;
                const bgColor = isEvenRow ? '#B1E5FF' : '#D8F2FF';
                const cleanQuantity = Number(item.total_quantity).toString();
                const cleanCost = Number(item.total_cost).toString();
                
                return (
                  <tr 
                    key={item.id} 
                    style={{ backgroundColor: bgColor }}
                    className="h-12 border-b border-black last:border-0 text-sm text-black"
                  >
                    {isDeleteMode && (
                      <td className="border-r border-black/20 w-12 text-center">
                        <GeneralDeleteCheckbox 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => handleSelectItem(item.id)} 
                        />
                      </td>
                    )}
                    <td className="desktop-only border-r border-black px-4 font-medium">
                      {item.asset_name}
                    </td>
                    <td className="desktop-only border-r border-black text-center">{item.asset_type}</td>
                    <td className="mobile-only border-r border-black px-4 font-regular">
                      <div className="combined-cell-content">
                        <span className="main-text font-medium">{item.asset_name}</span>
                        <span className="sub-text">{item.asset_type}</span>
                      </div>
                    </td>
                    <td className="desktop-only border-r border-black text-center">{cleanQuantity}</td>
                    <td className="desktop-only border-r border-black text-center">{cleanCost} ₺</td>
                    <td className="mobile-only border-r border-black px-4 font-regular">
                      <div className="combined-cell-content">
                        <span className="main-text">{cleanQuantity}</span>
                        <span className="sub-text">{cleanCost} ₺</span>
                      </div>
                    </td>
                    <td className="text-center font-bold">
                      <button 
                        onClick={() => navigate(`/assets/${item.id}`)}
                        className="text-xs underline text-blue-900 hover:text-black cursor-pointer"
                      >
                        İşlemleri Gör
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
          <Button variant="applyDelete" className="w-[120px] h-[35px] text-sm" onClick={() => setIsDeleteConfirmModalOpen(true)}>
            Onayla
          </Button>
        </div>
      )}

      {isDeleteConfirmModalOpen && (
        <BaseModal title="Silme Onayı" onClose={() => setIsDeleteConfirmModalOpen(false)}>
          <div className="p-6 text-center">
            <p className="mb-6">Seçili {selectedIds.length} varlığı silmek istediğinize emin misiniz?</p>
            <div className="flex justify-center gap-4">
              <Button variant="cancel" onClick={() => setIsDeleteConfirmModalOpen(false)}>Vazgeç</Button>
              <Button variant="applyDelete" onClick={handleConfirmDelete}>Evet, Sil</Button>
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
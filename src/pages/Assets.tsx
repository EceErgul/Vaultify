import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import Button from '../components/common/Button';
import { GeneralDeleteComponent, GeneralDeleteCheckbox } from '../components/common/GeneralDeleteComponent';
import VarlikModal from '../components/common/VarlikModal';
import BaseModal from '../components/common/Modal';

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

  const handleAssetAdded = () => {
    fetchAssets();
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
    <div className="p-8 font-inter max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Toplam Varlıklarım</h2>
        <div className="flex flex-col gap-2">
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
        <table className="w-full border-collapse">
             <thead>
            <tr className="bg-[#7ECCF4] h-10 border-b border-black">
              {isDeleteMode && <th className="w-12 border-r border-black"></th>}
              <th className="border-r border-black p-2 font-medium text-black text-left pl-4">Varlık</th>
              <th className="border-r border-black p-2 font-medium text-black">Tür</th>
              <th className="border-r border-black p-2 font-medium text-black">Miktar</th>
              <th className="border-r border-black p-2 font-medium text-black">Maliyet</th>
              <th className="p-2 font-medium text-black">Detay</th>
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

                    <td className="border-r border-black px-4 font-medium">
                      {item.asset_name}
                    </td>
                    <td className="border-r border-black text-center">{item.asset_type}</td>
                    <td className="border-r border-black text-center">{cleanQuantity}</td>
                    <td className="border-r border-black text-center">{cleanCost} ₺</td>
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

      <VarlikModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAssetAdded={handleAssetAdded} />
    </div>
  );
};

export default Assets;
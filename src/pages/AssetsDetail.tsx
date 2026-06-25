import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import AssetTransactionModal from '../components/common/AssetTransactionModal';
import VarlikAyrintisiDuzenle from '../components/common/VarlikAyrintisiDuzenleModal';
import { apiRequest } from '../utils/api';

interface Transaction {
  id: string;
  assetId: string;
  transactionType: string;
  date: string;
  totalQuantity: number;
  pricePerUnit: number;
  totalValue: number;
}

interface AssetSummary {
  id: string;
  assetName: string;
  assetType: string;
  totalQuantity: number;
  totalCost: number;
  currentPrice: number;
  lastUpdated: string;
}

const AssetsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetInfo, setAssetInfo] = useState<AssetSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [liveRelativeTime, setLiveRelativeTime] = useState<string>('şimdi');

const fetchDetailData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const currentAsset = await apiRequest(`/assets/${id}`);
      const txDataRaw = await apiRequest(`/assets/${id}/transactions`);

      console.log('=== 🎯 FRONTEND DEBBUGGING ===');
      console.log('Gelen Varlık Verisi (Doğrudan):', currentAsset);
      console.log('Gelen İşlem Geçmişi (Doğrudan):', txDataRaw);

      const txData = Array.isArray(txDataRaw) ? txDataRaw : [];

      if (currentAsset) {
        console.log("Canlı Fiyat Kontrol:", currentAsset.live_unit_price);

        setAssetInfo({
          id: currentAsset.id,
          assetName: currentAsset.asset_name,
          assetType: currentAsset.asset_type,
          totalQuantity: Number(currentAsset.total_quantity || 0),
          totalCost: Number(currentAsset.total_cost || 0),
          currentPrice: Number(currentAsset.live_unit_price || 0), 
          lastUpdated: currentAsset.fetchedAt || new Date().toISOString()
        });
      }
      
      const mappedTransactions = txData.map((tx: any) => ({
        id: tx.id,
        assetId: tx.asset_id,
        transactionType: tx.transaction_type,
        date: tx.date,
        totalQuantity: Number(tx.total_quantity || 0),
        pricePerUnit: Number(tx.price_per_unit || 0),
        totalValue: Number(tx.total_value || 0)
      }));

      setTransactions(mappedTransactions);
    } catch (error: any) {
      console.error('Varlık detayları yüklenirken hata oluştu:', error);
      setError(error?.message || 'Veri çekilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailData();
    }
  }, [id]);

  useEffect(() => {
    if (!assetInfo?.lastUpdated) return;

    const updateTime = () => {
      const diffInMs = new Date().getTime() - new Date(assetInfo.lastUpdated).getTime();
      const diffInSecs = Math.floor(diffInMs / 1000);
      const diffInMins = Math.floor(diffInSecs / 60);

      if (diffInSecs < 15) {
        setLiveRelativeTime('şimdi');
      } else if (diffInSecs < 60) {
        setLiveRelativeTime(`${diffInSecs}sn önce`);
      } else {
        setLiveRelativeTime(`${diffInMins}dk önce`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);

    return () => clearInterval(interval);
  }, [assetInfo?.lastUpdated]);

  const handleDelete = async (txId: string) => {
    const confirmDelete = window.confirm("Bu işlem kaydını silmek istediğinize emin misiniz?");
    if (confirmDelete) {
      try {
        await apiRequest(`/transactions/${txId}`, { method: 'DELETE' });
        fetchDetailData();
      } catch (error) {
        console.error("İşlem silinirken hata oluştu:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium">Veriler yükleniyor...</span>
      </div>
    );
  }

  if (!assetInfo) {
    return (
      <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen">
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Varlık bilgi katmanı çözülemedi.</h2>
          <p>Aynı sayfayı yenileyin veya farklı bir varlık seçin.</p>
          {error && <p className="mt-3 font-medium">Hata: {error}</p>}
        </div>
      </div>
    );
  }

  const totalQty = assetInfo.totalQuantity || 0;
  const totalCost = assetInfo.totalCost || 0;
  const currentPrice = assetInfo.currentPrice || 0;
  
  const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
  const totalValue = totalQty * currentPrice;
  const netProfitLoss = totalValue - totalCost;
  const profitLossPercentage = totalCost > 0 ? (netProfitLoss / totalCost) * 100 : 0;

  return (
    <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-medium text-black uppercase tracking-tight">
              {assetInfo.assetName} Detayları
            </h1>
            <p className="mt-2 text-sm text-gray-600">Son güncelleme: {liveRelativeTime}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="add" 
              className="w-[130px] h-[35px] text-sm shadow-md"
              onClick={() => setIsAddTransactionOpen(true)}
            >
              + İşlem Ekle
            </Button>
            <Button 
              variant="filter" 
              className="w-[130px] h-[35px] text-sm shadow-md"
              onClick={() => navigate(-1)}
            >
              ← Geri Dön
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Hata: {error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Toplam Miktar", value: `${totalQty.toLocaleString('tr-TR')}`, bg: "#FFF5D9" },
          { label: "Ortalama Maliyet", value: `${avgCost.toFixed(2)} ₺`, bg: "#FFF5D9" },
          { label: "Anlık Toplam Değer", value: `${totalValue.toFixed(2)} ₺`, bg: "#E3F2FD" },
          { 
            label: "Kâr / Zarar Durumu", 
            value: `${netProfitLoss >= 0 ? '+' : ''}${netProfitLoss.toFixed(2)} ₺ (${profitLossPercentage.toFixed(2)}%)`,
            bg: netProfitLoss >= 0 ? "#E8F5E9" : "#FFEBEE",
            textColor: netProfitLoss >= 0 ? "text-green-700" : "text-red-700"
          }
        ].map((card, i) => (
          <div 
            key={i} 
            style={{ backgroundColor: card.bg }}
            className="border border-black rounded-[15px] h-44 flex flex-col items-center justify-center p-4 text-center shadow-sm transition-transform hover:scale-[1.02]"
          >
            <span className="font-medium text-lg text-gray-700 mb-4 leading-tight">{card.label}</span>
            <span className={`font-bold text-2xl ${card.textColor || 'text-black'}`}>{card.value}</span>
          </div>
        ))}
      </div>

      <div className="border border-black overflow-hidden rounded-md shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FFEF79] h-12 border-b border-black text-black text-sm">
              <th className="border-r border-black p-2 font-bold uppercase">Tarih</th>
              <th className="border-r border-black p-2 font-bold uppercase">Tür</th>
              <th className="border-r border-black p-2 font-bold uppercase">Miktar</th>
              <th className="border-r border-black p-2 font-bold uppercase">Birim Fiyat</th>
              <th className="border-r border-black p-2 font-bold uppercase">Toplam Tutar</th>
              <th className="p-2 font-bold uppercase">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr className="h-14 bg-[#FFF5D9]">
                <td colSpan={6} className="text-center text-sm font-medium">Henüz işlem geçmişi bulunmuyor.</td>
              </tr>
            ) : (
              transactions.map((row, index) => {
                const isEven = (index + 1) % 2 === 0;
                const bgColor = isEven ? '#FFF5AD' : '#FFF5D9';
                const formattedDate = new Date(row.date).toLocaleDateString('tr-TR');

                return (
                  <tr 
                    key={row.id} 
                    style={{ backgroundColor: bgColor }}
                    className="h-14 border-b border-black last:border-0 text-sm text-black hover:brightness-95 transition-all"
                  >
                    <td className="border-r border-black text-center">{formattedDate}</td>
                    <td className="border-r border-black text-center font-medium">{row.transactionType}</td>
                    <td className="border-r border-black text-center">{row.totalQuantity}</td>
                    <td className="border-r border-black text-center">{row.pricePerUnit.toFixed(2)} ₺</td>
                    <td className="border-r border-black text-center font-semibold">{row.totalValue.toFixed(2)} ₺</td>

                    <td className="text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button 
                          onClick={() => setIsEditModalOpen(true)} 
                          className="hover:scale-125 transition-transform text-xl"
                          title="Düzenle"
                        >
                          📝
                        </button>
                        <span className="text-gray-400">|</span>
                        <button 
                          onClick={() => handleDelete(row.id)} 
                          className="hover:scale-125 transition-transform text-xl"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AssetTransactionModal
        assetId={id ?? ''}
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onCreated={fetchDetailData}
      />

      <VarlikAyrintisiDuzenle 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); fetchDetailData(); }} 
      />
    </div>
  );
};

export default AssetsDetail;
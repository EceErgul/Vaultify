import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import AssetTransactionModal from '../components/common/AssetTransactionModal';
import VarlikModallari from '../components/common/VarlikModallari';
import BaseModal from '../components/common/Modal';
import { apiRequest } from '../utils/api';
import Slider from '../components/common/Slider';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import AIAssetInsights from '../components/common/AiAssistedInsights';

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
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  const [isAssetEditModalOpen, setIsAssetEditModalOpen] = useState(false);
  const [isTransactionEditModalOpen, setIsTransactionEditModalOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetInfo, setAssetInfo] = useState<AssetSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [liveRelativeTime, setLiveRelativeTime] = useState<string>('şimdi');

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const fetchDetailData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [response, txResponse] = await Promise.all([
        apiRequest(`/assets/${id}`),
        apiRequest(`/assets/${id}/transactions`)
      ]);

      const currentAsset = response.data || response; 
      const txDataRaw = txResponse.data || txResponse;
      const txData = Array.isArray(txDataRaw) ? txDataRaw : [];

      if (currentAsset) {
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
        setLiveRelativeTime(t('time_now'));
      } else if (diffInSecs < 60) {
        setLiveRelativeTime(t('time_sec_ago').replace('{count}', String(diffInSecs)));
      } else {
        setLiveRelativeTime(t('time_min_ago').replace('{count}', String(diffInMins)));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);

    return () => clearInterval(interval);
  }, [assetInfo?.lastUpdated, t]);

  const handleDeleteClick = (txId: string) => {
    setTxToDelete(txId);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!txToDelete) {
      alert(t('detail_err_tx_id'));
      return;
    }

    try {
      await apiRequest(`/assets/transactions/${txToDelete}`, { method: 'DELETE' });
      await fetchDetailData();
    } catch (error: any) {
      console.error("Silme işleminde hata:", error);
      alert(t('detail_err_server_delete') + (error?.message || "Bilinmeyen API hatası"));
    } finally {
      setIsConfirmDeleteOpen(false);
      setTxToDelete(null);
    }
  };

  const handleUpdateAsset = async (formData: any) => {
    if (!id) return;
    try {
      await apiRequest(`/assets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          asset_name: formData.asset_name,
          asset_type: formData.asset_type,
          date: formData.date,
          total_quantity: formData.amount,
          total_cost: Number(formData.amount) * Number(formData.price)
        })
      });
      await fetchDetailData();
      setIsAssetEditModalOpen(false);
    } catch (error) {
      console.error("Varlık güncellenirken bir hata oluştu:", error);
      alert(t('detail_err_asset_update'));
    }
  };

  const handleUpdateTransaction = async (formData: any) => {
    if (!editingTx) return;
    try {
      await apiRequest(`/assets/transactions/${editingTx.id}`, { 
        method: 'PUT', 
        body: JSON.stringify({
          transactionType: editingTx.transactionType,
          date: formData.date,
          totalQuantity: parseFloat(formData.amount),
          pricePerUnit: parseFloat(formData.price),
          totalValue: parseFloat(formData.amount) * parseFloat(formData.price)
        })
      });
      await fetchDetailData();
      setIsTransactionEditModalOpen(false);
      setEditingTx(null);
    } catch (err) {
      console.error("İşlem güncellenirken hata:", err);
      alert(t('detail_err_tx_update'));
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)]">
        <span className="text-lg font-medium">{t('detail_loading')}</span>
      </div>
    );
  }

  if (!assetInfo) {
    return (
      <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 p-6 text-red-700 dark:text-red-400">
          <h2 className="text-lg font-semibold mb-2">{t('detail_err_layer')}</h2>
          <p>{t('detail_err_hint')}</p>
          {error && <p className="mt-3 font-medium">{t('detail_err_prefix')}{error}</p>}
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
    <div className="p-8 font-inter max-w-6xl mx-auto min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium text-[var(--text-main)] uppercase tracking-tight">
              {assetInfo.assetName}{t('detail_title_suffix')}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{t('detail_last_update')}{liveRelativeTime}</p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Button 
              variant="filter" 
              className="w-[130px] h-[35px] text-sm shadow-md"
              onClick={() => navigate(-1)}
            >
              {t('detail_back_btn')}
            </Button>
            <Button 
              variant="add" 
              className="w-[130px] h-[35px] text-sm shadow-md"
              onClick={() => setIsAddTransactionOpen(true)}
            >
              {t('detail_add_tx_btn')}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 p-4 text-red-700 dark:text-red-400">
            <p className="font-medium">{t('detail_err_prefix')}{error}</p>
          </div>
        )}
      </div>

      <div className="asset-detail-grid mb-6">
        {[
          { label: t('card_total_qty'), value: `${totalQty.toLocaleString('tr-TR')}`, bg: "var(--card-yellow-bg)" },
          { label: t('card_avg_cost'), value: `${avgCost.toFixed(2)} ${currencySymbol}`, bg: "var(--card-yellow-bg)" },
          { label: t('card_total_value'), value: `${totalValue.toFixed(2)} ${currencySymbol}`, bg: "var(--card-blue-bg)" },
          { 
            label: t('card_profit_loss'), 
            value: `${netProfitLoss >= 0 ? '+' : ''}${netProfitLoss.toFixed(2)} ${currencySymbol} (${profitLossPercentage.toFixed(2)}%)`,
            bg: netProfitLoss >= 0 ? "var(--card-green-bg)" : "var(--card-red-bg)",
            textColor: netProfitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }
        ].map((card, i) => (
          <div 
            key={i} 
            style={{ backgroundColor: card.bg }}
            className="border border-[var(--border-color)] rounded-[15px] h-44 flex flex-col items-center justify-center p-4 text-center shadow-sm transition-transform hover:scale-[1.02]"
          >
            <span className="font-medium text-lg text-[var(--text-muted)] mb-4 leading-tight">{card.label}</span>
            <span className={`font-bold text-2xl ${card.textColor || 'text-[var(--text-main)]'}`}>{card.value}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <AIAssetInsights
          assetId={assetInfo.id}
          assetName={assetInfo.assetName}
          balance={totalValue}
          currency={currencySymbol}
        />
      </div>

      <div className="border border-[var(--border-color)] overflow-hidden rounded-md shadow-lg bg-[var(--bg-card)]">
        <Slider>
        <table className="w-full border-collapse custom-asset-detail-table">
          <thead>
            <tr style={{ backgroundColor: 'var(--table-header-bg-yellow)' }} className="h-12 border-b border-[var(--border-color)] text-[var(--text-main)] text-sm">
              <th className="border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_date')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_type')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_quantity')}</th>
              <th className="mobile-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_type_quantity')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_price_per_unit')}</th>
              <th className="desktop-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_total_amount')}</th>
              <th className="mobile-only border-r border-[var(--border-color)] p-2 font-bold uppercase">{t('detail_th_price_amount')}</th>
              <th className="p-2 font-bold uppercase">{t('detail_th_action')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr style={{ backgroundColor: 'var(--table-row-even-yellow)' }} className="h-14">
                <td colSpan={6} className="text-center text-sm font-medium text-[var(--text-muted)]">{t('detail_empty_transactions')}</td>
              </tr>
            ) : (
              transactions.map((row, index) => {
                const isEven = (index + 1) % 2 === 0;
                const rowBg = isEven ? 'var(--table-row-even-yellow)' : 'var(--table-row-odd-yellow)';
                const formattedDate = new Date(row.date).toLocaleDateString('tr-TR');

                return (
                  <tr 
                    key={row.id} 
                    style={{ backgroundColor: rowBg }}
                    className="h-14 border-b border-[var(--border-color)] last:border-0 text-sm text-[var(--text-main)] hover:brightness-95 transition-all"
                  >
                    <td className="border-r border-[var(--border-color)] text-center">{formattedDate}</td>
                    
                    <td className="desktop-only border-r border-[var(--border-color)] text-center font-medium">{row.transactionType}</td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center">{row.totalQuantity}</td>
                    <td className="mobile-only border-r border-[var(--border-color)] px-4">
                      <div className="combined-cell-content">
                        <span className="main-text font-medium">{row.transactionType}</span>
                        <span className="sub-text text-[var(--text-muted)]">{row.totalQuantity}</span>
                      </div>
                    </td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center">{row.pricePerUnit.toFixed(2)} {currencySymbol}</td>
                    <td className="desktop-only border-r border-[var(--border-color)] text-center font-semibold">{row.totalValue.toFixed(2)} {currencySymbol}</td>
                    <td className="mobile-only border-r border-[var(--border-color)] px-4">
                      <div className="combined-cell-content">
                        <span className="main-text">{row.pricePerUnit.toFixed(2)} {currencySymbol}</span>
                        <span className="sub-text font-semibold">{row.totalValue.toFixed(2)} {currencySymbol}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingTx(row);
                            setIsTransactionEditModalOpen(true);
                          }} 
                          className="hover:scale-125 transition-transform text-xl"
                          title={t('detail_edit_title')}
                        >
                          📝
                        </button>
                        <span className="text-[var(--text-muted)]">|</span>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(row.id)} 
                          className="hover:scale-125 transition-transform text-xl"
                          title={t('detail_delete_title')}
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
        </Slider>
      </div>

      <AssetTransactionModal
        assetId={id ?? ''}
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onCreated={fetchDetailData}
      />

      <VarlikModallari 
        isOpen={isAssetEditModalOpen} 
        onClose={() => setIsAssetEditModalOpen(false)} 
        mode="edit"
        initialData={assetInfo ? {
          date: '',
          assetName: assetInfo.assetName,
          assetType: assetInfo.assetType as any,
          amount: assetInfo.totalQuantity,
          price: avgCost
        } : undefined}
        onSave={handleUpdateAsset} 
      />

      <VarlikModallari 
        isOpen={isTransactionEditModalOpen} 
        onClose={() => { 
          setIsTransactionEditModalOpen(false); 
          setEditingTx(null); 
        }}
        mode="edit"
        initialData={editingTx ? {
          date: editingTx.date.split('T')[0],
          amount: editingTx.totalQuantity,
          price: editingTx.pricePerUnit,
          assetType: editingTx.transactionType as any
        } : undefined}
        onSave={handleUpdateTransaction}
      />

      {isConfirmDeleteOpen && (
        <BaseModal title={t('detail_modal_delete_title')} onClose={() => setIsConfirmDeleteOpen(false)}>
          <div className="p-6 text-center font-inter text-[#333D50] rounded-b-xl">
            <p className="mb-6 text-lg font-medium text-[#333D50]">{t('detail_modal_delete_text')}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button 
                variant="cancel" 
                className="w-full sm:w-[120px] h-[40px] shadow-sm" 
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                {t('detail_modal_cancel')}
              </Button>
              <Button 
                variant="apply" 
                className="w-full sm:w-[120px] h-[40px] !bg-red-600 !text-white shadow-sm hover:!bg-red-700" 
                onClick={confirmDelete}
              >
                {t('detail_modal_confirm')}
              </Button>
            </div>
          </div>
        </BaseModal>
      )}
          </div>
  );
};

export default AssetsDetail;
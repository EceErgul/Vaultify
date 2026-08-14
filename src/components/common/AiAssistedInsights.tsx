import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext'; 
import { apiRequest } from '../../utils/api';

interface AIAssetInsightsProps {
  assetId?: string | number;
  assetName: string;
  balance: number;
  currency: string;
}

export const AIAssetInsights: React.FC<AIAssetInsightsProps> = ({ assetId, assetName, balance, currency }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/assets/${assetId}/analyze`, {
        method: 'GET',
        headers: { 'Accept-Language': 'tr' }
      });
      setInsight(res.data);
    } catch (err: any) {
      setInsight("Analiz şu an kullanılamıyor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 my-6 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="font-semibold text-[var(--text-main)] text-base">
            {t('ai_assistant_title')}
          </h3>
        </div>
        <button
          onClick={fetchAIAnalysis}
          disabled={loading}
          className="w-full sm:w-auto bg-[var(--bg-sidebar)] text-white px-4 py-2 sm:py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center"
        >
          {loading ? t('ai_analyzing') : t('ai_analyze_btn')}
        </button>
      </div>

      {insight ? (
        <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-page)] p-3.5 rounded-lg border border-[var(--border-color)]">
          {insight}
        </p>
      ) : (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('ai_assistant_desc')}
        </p>
      )}
    </div>
  );
};

export default AIAssetInsights;
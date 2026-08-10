import React, { useMemo, useEffect, useState } from 'react';
import * as Recharts from 'recharts';
import '../styles/dashboard.css';
import { Income } from '../types/index';
import { getCategoryColorVar } from '../utils/colourHelpers';
import { useUser } from '../context/UserContext';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = Recharts as any;

const Dashboard: React.FC = () => {
  const { dashboardData, loading } = useUser();
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const currencySymbols: Record<string, string> = {
    TL: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  const currencySymbol = currencySymbols[currency] || '₺';

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartRadii = () => {
    if (windowWidth <= 340) return { innerRadius: 48, outerRadius: 72 };
    if (windowWidth <= 420) return { innerRadius: 58, outerRadius: 85 };
    if (windowWidth <= 640) return { innerRadius: 70, outerRadius: 102 };
    return { innerRadius: 110, outerRadius: 155 };
  };

  const { innerRadius, outerRadius } = getChartRadii();
  const settings = dashboardData?.settings || {};
  const isInvisibleMode = settings?.invisible_mode ?? false;
  const incomes: Income[] = isInvisibleMode ? [] : (Array.isArray(dashboardData?.incomes) ? dashboardData.incomes : []);
  const expenses = isInvisibleMode ? [] : (Array.isArray(dashboardData?.expenses) ? dashboardData.expenses : []);
  const assets = isInvisibleMode ? [] : (Array.isArray(dashboardData?.assets) ? dashboardData.assets : []);
  const subscriptions = isInvisibleMode ? [] : (Array.isArray(dashboardData?.subscriptions) ? dashboardData.subscriptions : []);

  const resolveCssColor = (cssVarName: string) => {
    if (!cssVarName) return '#3b82f6'; // Varsayılan mavi
    const cleanVarName = cssVarName.replace('var(', '').replace(')', '').trim();
    return `var(${cleanVarName}, #3b82f6)`;
  };

  const sections = useMemo(() => {
    if (!isMounted || isInvisibleMode) return [];

    const safeIncomes = Array.isArray(incomes) ? incomes : [];
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const safeAssets = Array.isArray(assets) ? assets : [];
    const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];
    const totalIncome = safeIncomes.reduce((acc, curr) => acc + Number(curr.income_amount || 0), 0);
    const totalExpense = safeExpenses.reduce((acc, curr) => acc + Number(curr.expenses_amount || 0), 0);
    const totalAssets = safeAssets.reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);
    const totalSubscriptions = safeSubscriptions.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);

    const incomeChartData = safeIncomes.map(item => ({
      name: item.income_category,
      value: Number(item.income_amount || 0),
      fill: resolveCssColor(getCategoryColorVar(item.income_category))
    }));

    const expenseChartData = safeExpenses.map(item => ({
      name: item.expense_category || item.expense_category_chart,
      value: Number(item.expenses_amount || 0),
      fill: resolveCssColor(getCategoryColorVar(item.expense_category || item.expense_category_chart))
    }));

    return [
      { 
        title: t('dash_section_net_assets'), 
        amount: (totalIncome - totalExpense) + totalAssets,
        data: [
          { name: t('dash_item_income'), value: totalIncome, fill: resolveCssColor('--color-maas') },
          { name: t('dash_item_expense'), value: totalExpense, fill: resolveCssColor('--color-ev') },
          { name: t('dash_item_subscriptions'), value: totalSubscriptions, fill: resolveCssColor('--color-abonelik') },
          { name: t('dash_item_savings'), value: totalAssets, fill: resolveCssColor('--color-varlarim') },
        ] 
      },
      { title: t('dash_section_income_dist'), amount: totalIncome, data: incomeChartData },
      { title: t('dash_section_expense_dist'), amount: totalExpense, data: expenseChartData },
    ];
  }, [incomes, expenses, assets, subscriptions, isMounted, isInvisibleMode, t]);

  if (!isMounted || loading) {
    return (
      <div className="p-4 sm:p-8 bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] flex items-center justify-center">
        <span className="text-base sm:text-lg font-medium">{t('dash_loading')}</span>
      </div>
    );
  }
  
  if (isInvisibleMode) {
    return (
      <div className="p-4 sm:p-8 bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 sm:p-8 bg-[var(--bg-card)] rounded-[var(--v-card)] border border-[var(--border-color)] shadow-v-soft">
          <div className="text-4xl">👁️‍🗨️</div>
          <h2 className="text-xl font-bold">{t('dash_invisible_title')}</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {t('dash_invisible_desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main-wrapper p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-10 bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto pb-20">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            className="dashboard-section-card mb-6 sm:mb-12 w-full bg-[var(--bg-card)] rounded-[var(--v-card)] p-4 sm:p-6 md:p-8 shadow-v-soft border border-[var(--border-color)] group hover:border-[var(--sidebar-accent)] transition-all"
          >
             <div className="dashboard-section-header mb-4 sm:mb-8 flex justify-between items-end border-b border-[var(--border-color)] pb-3 sm:pb-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold group-hover:text-[var(--sidebar-accent)] transition-colors">
                  {section.title}
                </h2>
                <p className="text-[10px] sm:text-sm text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">{t('dash_financial_summary')}</p>
              </div>
              <div className="text-right">
                <span className="dashboard-amount text-base sm:text-2xl font-black text-[var(--sidebar-accent)]">
                  {section.amount.toLocaleString('tr-TR')} {currencySymbol}
                </span>
              </div>
             </div>

            <div className="dashboard-chart-wrapper h-[240px] sm:h-[350px] md:h-[400px] w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={section.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={section.data.length > 1 ? 6 : 0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {section.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      color: 'var(--text-main)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                    itemStyle={{ 
                      color: 'var(--text-main)', 
                      fontWeight: 'bold' 
                    }}
                    formatter={(value: any) => `${Number(value).toLocaleString()} ${currencySymbol}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {section.data.map((item: any, i: number) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-xl sm:rounded-2xl bg-[var(--bg-page)] border border-[var(--border-color)]">
                  <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold truncate">{item.name}</span>
                    <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium">
                      {item.value.toLocaleString('tr-TR')} {currencySymbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
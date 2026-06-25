import React, { useMemo, useEffect, useState } from 'react';
import * as Recharts from 'recharts';
import '../styles/dashboard.css';
import { Income, ExpensesCategoryChart } from '../types/index';
import { getCategoryColorVar } from '../utils/colourHelpers';
import { apiRequest } from '../utils/api';

const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = Recharts as any;

const FALLBACK_COLORS: Record<string, string> = {
  '--color-maas': '#38A169',
  '--color-kira': '#D69E2E',
  '--color-varliklarim': '#3182CE',
  '--color-ev': '#F56565',
  '--color-market': '#ED8936',
  '--color-gider-kira': '#A0522D',
  '--color-eglence': '#F6AD55',
  '--color-saglik': '#4FD1C5',
  '--color-ulasim': '#63B3ED',
  '--color-taksit': '#667EEA',
  '--color-borc': '#FC8181',
  '--color-fatura': '#F687B3',
  '--color-abonelik': '#D4D953',
  '--color-ek-is': '#319795',
  '--color-gelir-diger': '#A0AEC0',
  '--color-gider-diger': '#CBD5E0'
};

const Dashboard: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [incomeData, expenseData] = await Promise.all([
        apiRequest('/incomes'),
        apiRequest('/expenses')
      ]);
      setIncomes(incomeData);
      setExpenses(expenseData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const resolveCssColor = (cssVarName: string) => {
    if (typeof window === 'undefined') return `var(${cssVarName})`;
    const cleanVarName = cssVarName.replace('var(', '').replace(')', '').trim();
    const value = getComputedStyle(document.documentElement).getPropertyValue(cleanVarName).trim();
    return value || FALLBACK_COLORS[cleanVarName] || '#CBD5E0';
  };

  const sections = useMemo(() => {
    if (!isMounted) return [];

    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.income_amount), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.expenses_amount), 0);

    const incomeChartData = incomes.map(item => ({
      name: item.income_category,
      value: Number(item.income_amount),
      fill: resolveCssColor(getCategoryColorVar(item.income_category))
    }));

    const expenseChartData = expenses.map(item => ({
      name: item.expense_category || item.expense_category_chart,
      value: Number(item.expenses_amount),
      fill: resolveCssColor(getCategoryColorVar(item.expense_category || item.expense_category_chart))
    }));

    return [
      { 
        title: "Net Varlık Özeti", 
        amount: totalIncome - totalExpense, 
        data: [
          { name: 'Gelir', value: totalIncome, fill: resolveCssColor('--color-maas') },
          { name: 'Gider', value: totalExpense, fill: resolveCssColor('--color-ev') },
          { name: 'Birikim', value: totalIncome * 0.1, fill: resolveCssColor('--color-varliklarim') },
        ] 
      },
      { title: "Gelir Dağılımı", amount: totalIncome, data: incomeChartData },
      { title: "Gider Dağılımı", amount: totalExpense, data: expenseChartData },
    ];
  }, [incomes, expenses, isMounted]);

  if (!isMounted || loading) {
    return (
      <div className="p-8 bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] flex items-center justify-center">
        <span className="text-lg font-medium">Panel verileri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 bg-[var(--bg-page)] min-h-screen text-[var(--text-main)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto pb-20">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            className="mb-12 w-full bg-[var(--bg-card)] rounded-[var(--v-card)] p-8 shadow-v-soft border border-[var(--border-color)] group hover:border-[var(--sidebar-accent)] transition-all"
          >
            <div className="mb-8 flex justify-between items-end border-b border-[var(--border-color)] pb-6">
              <div>
                <h2 className="text-2xl font-bold group-hover:text-[var(--sidebar-accent)] transition-colors">
                  {section.title}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 uppercase tracking-widest">Finansal Özet</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[var(--sidebar-accent)]">
                  {section.amount.toLocaleString()} ₺
                </span>
              </div>
            </div>

            <div className="h-[400px] w-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={section.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={110}
                    outerRadius={155}
                    paddingAngle={section.data.length > 1 ? 8 : 0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {section.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1e293b', 
                      border: 'none',
                      color: '#fff' 
                    }}
                    formatter={(value: any) => `${Number(value).toLocaleString()} ₺`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.data.map((item: any, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-color)]"
                >
                  <div 
                    className="w-5 h-5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold truncate">{item.name}</span>
                    <span className="text-xs text-[var(--text-muted)] font-medium">
                      {item.value.toLocaleString()} ₺
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
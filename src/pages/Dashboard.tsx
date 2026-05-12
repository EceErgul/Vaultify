import React, { useEffect, useState } from 'react';
import { PieChart as RechartsPieChart, Pie as RechartsPie, Cell as RechartsCell, Tooltip, ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';
import { Income, ExpensesChart } from '../types';
import { getCategoryColorVar } from '../utils/colourHelpers';
import '../styles/dashboard.css';

const PieChart = RechartsPieChart as unknown as React.ComponentType<any>;
const Pie = RechartsPie as unknown as React.ComponentType<any>;
const Cell = RechartsCell as unknown as React.ComponentType<any>;
const ResponsiveContainer = RechartsResponsiveContainer as unknown as React.ComponentType<any>;

const mockIncomes: Income[] = [
  { id: '1', user_id: 'u1', income_name: 'Nisan Maaşı', income_category: 'Maaş', income_amount: 55000, date: '2026-04-01' },
  { id: '2', user_id: 'u1', income_name: 'Daire 3 Kira', income_category: 'Kira Geliri', income_amount: 15000, date: '2026-04-05' },
  { id: '3', user_id: 'u1', income_name: 'Hisse Temettü', income_category: 'Varlıklarım', income_amount: 5000, date: '2026-04-10' },
  { id: '4', user_id: 'u1', income_name: 'Özel Ders', income_category: 'Ek İş', income_amount: 8000, date: '2026-04-12' },
];

const mockExpenses: ExpensesChart[] = [
  { id: 'e1', user_id: 'u1', expense_name: 'Nisan Kirası', expense_category: 'Kira', expenses_amount: 20000, date: '2026-04-01' },
  { id: 'e2', user_id: 'u1', expense_name: 'Haftalık Market', expense_category: 'Market Alışverişi', expenses_amount: 3500, date: '2026-04-02' },
  { id: 'e3', user_id: 'u1', expense_name: 'Sinema ve Yemek', expense_category: 'Eğlence', expenses_amount: 2500, date: '2026-04-03' },
  { id: 'e4', user_id: 'u1', expense_name: 'Yakıt', expense_category: 'Ulaşım', expenses_amount: 4000, date: '2026-04-04' },
  { id: 'e5', user_id: 'u1', expense_name: 'Elektrik & Su', expense_category: 'Faturalar', expenses_amount: 3000, date: '2026-04-05' },
];

const Dashboard: React.FC = () => {
  const getVar = (name: string) => {
    if (typeof window === 'undefined') return '#CBD5E0';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#CBD5E0';
  };

  const totalIncome = mockIncomes.reduce((acc, curr) => acc + curr.income_amount, 0);
  const totalExpense = mockExpenses.reduce((acc, curr) => acc + curr.expenses_amount, 0);
  const totalSavings = mockIncomes
    .filter(i => i.income_category === 'Varlıklarım')
    .reduce((acc, curr) => acc + curr.income_amount, 0);

  const incomeCategoryData = mockIncomes.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.name === curr.income_category);
    if (existing) existing.value += curr.income_amount;
    else acc.push({ name: curr.income_category, value: curr.income_amount });
    return acc;
  }, []);

  const expenseCategoryData = mockExpenses.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.name === curr.expense_category);
    if (existing) existing.value += curr.expenses_amount;
    else acc.push({ name: curr.expense_category, value: curr.expenses_amount });
    return acc;
  }, []);

  const sections = [
    { 
      title: "Net Varlık", 
      amount: totalIncome - totalExpense, 
      data: [
        { name: 'Gelir', value: totalIncome, colorKey: '--color-maas' },
        { name: 'Gider', value: totalExpense, colorKey: '--color-ev' },
        { name: 'Birikim', value: totalSavings, colorKey: '--color-birikim' },
      ] 
    },
    { title: "Gelir Dağılımı", amount: totalIncome, data: incomeCategoryData },
    { title: "Gider Dağılımı", amount: totalExpense, data: expenseCategoryData },
  ];

  return (
    <div className="flex flex-col items-center space-y-12 py-10 bg-[var(--bg-dashboard)] min-h-screen transition-colors duration-500">
      {sections.map((section, idx) => (
        <div 
          key={idx} 
          className="w-full max-w-2xl bg-[var(--bg-card)] rounded-[25px] p-8 shadow-v-soft border border-gray-100 dark:border-gray-800 transition-all"
        >
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {section.title}
            </h2>
            <span className="text-lg font-medium opacity-70 text-[var(--text-primary)]">
              {section.amount.toLocaleString()} ₺
            </span>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={section.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {section.data.map((entry: any, index: number) => {
                    const finalKey = entry.colorKey || getCategoryColorVar(entry.name);
                    return <Cell key={`cell-${index}`} fill={getVar(finalKey)} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `${Number(value).toLocaleString()} ₺`}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {section.data.map((item: any, i: number) => {
               const finalKey = item.colorKey || getCategoryColorVar(item.name);
               return (
                <div key={i} className="flex items-center space-x-3 text-sm text-[var(--text-primary)]">
                  <div 
                    className="w-4 h-4 rounded-md flex-shrink-0" 
                    style={{ backgroundColor: getVar(finalKey) }} 
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-semibold opacity-90">{item.name}</span>
                    <span className="text-xs opacity-60">{item.value.toLocaleString()} ₺</span>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
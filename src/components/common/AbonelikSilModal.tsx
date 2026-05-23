import React, { useState } from 'react';
import BaseModal from './Modal';
import { GeneralDeleteComponent } from './GeneralDeleteComponent';

const mockAbonelikler = [
  { id: 1, ad: 'Netflix', odeme: '04.05.2026', fiyat: '160 ₺', baslangic: '06.07.2022' },
  { id: 2, ad: 'Amazon Prime', odeme: '06.05.2026', fiyat: '130 ₺', baslangic: '25.10.2025' },
  { id: 3, ad: 'Youtube Premium', odeme: '02.05.2026', fiyat: '53 ₺', baslangic: '30.11.2019' },
  { id: 4, ad: 'Jetbrains', odeme: '18.05.2026', fiyat: '750 ₺', baslangic: '08.03.2014' },
  { id: 5, ad: 'Spotify', odeme: '12.05.2026', fiyat: '85 ₺', baslangic: '14.02.2021' }, // Test için ekstra veri
  { id: 6, ad: 'iCloud', odeme: '20.05.2026', fiyat: '39 ₺', baslangic: '01.01.2023' },   // Test için ekstra veri
];

const AbonelikSilModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="w-5 h-5 bg-white border border-black rounded-[4px] cursor-pointer flex items-center justify-center shrink-0"
    >
      {checked && (
        <svg viewBox="0 0 100 100" className="w-3 h-3 stroke-black stroke-[15px]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      )}
    </div>
  );

  return (
    <BaseModal title="Abonelik Sil" onClose={onClose}>
      <div className="flex flex-col font-inter pr-1 w-full">
        <div className="flex items-center gap-2 mb-3 ml-2 select-none">
          <CustomCheckbox 
            checked={selectedIds.length === mockAbonelikler.length && mockAbonelikler.length > 0}
            onChange={() => {
              if (selectedIds.length === mockAbonelikler.length) setSelectedIds([]);
              else setSelectedIds(mockAbonelikler.map(a => a.id));
            }}
          />
          <span className="text-sm font-bold text-black">Hepsini Seç</span>
        </div>

        <div className="max-h-[240px] overflow-y-auto border border-black/20 rounded-sm">
          <table className="w-full border-collapse table-layout-auto">
            <thead>
              <tr className="bg-[#FF7B7B] text-black text-xs h-10 sticky top-0 z-10">
                <th className="w-12 border-b border-r border-black/20 bg-[#FF7B7B]"></th>
                <th className="p-2 border-b border-r border-black/20 text-left font-bold">Abonelik Adı</th>
                <th className="p-2 border-b border-r border-black/20 font-bold text-center">Ödeme Tarihi</th>
                <th className="p-2 border-b border-r border-black/20 font-bold text-center">Fiyat</th>
                <th className="p-2 border-b font-bold text-center">Başlangıç Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {mockAbonelikler.map((sub, index) => {
                const isEven = (index + 1) % 2 === 0;
                const rowColor = isEven ? '#FFBABA' : '#FF9E9E';
                const isChecked = selectedIds.includes(sub.id);

                return (
                  <tr 
                    key={sub.id} 
                    style={{ backgroundColor: rowColor }}
                    onClick={() => {
                      if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                      else setSelectedIds([...selectedIds, sub.id]);
                    }}
                    className="text-[11px] h-10 border-b border-black/10 cursor-pointer hover:opacity-95 select-none"
                  >
                    <td className="text-center p-2 border-r border-black/10">
                      <div className="flex justify-center items-center">
                        <CustomCheckbox 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedIds(selectedIds.filter(id => id !== sub.id));
                            else setSelectedIds([...selectedIds, sub.id]);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2 border-r border-black/10 font-medium">{sub.ad}</td>
                    <td className="p-2 border-r border-black/10 text-center">{sub.odeme}</td>
                    <td className="p-2 border-r border-black/10 text-center font-semibold">{sub.fiyat}</td>
                    <td className="p-2 text-center">{sub.baslangic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end pr-2 pb-2">
          <GeneralDeleteComponent 
            label="Abonelik Sil" 
            onDelete={() => console.log("Siliniyor:", selectedIds)} 
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default AbonelikSilModal;
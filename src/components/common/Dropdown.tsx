import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  value: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, placeholder, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative w-full font-inter">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[45px] w-full items-center justify-between overflow-hidden rounded-[6px] border border-[var(--border-color)] bg-[var(--bg-card)] cursor-pointer shadow-sm transition-colors"
      >
        <span className="px-4 text-sm text-[var(--text-main)]">
          {value || placeholder || t('placeholder_select')}
        </span>

        <div className="flex h-[35px] w-[35px] items-center justify-center border-l border-[var(--border-color)] bg-[var(--bg-card)] mr-[4px]">
          <ChevronDown 
            size={18} 
            className={`text-[var(--text-main)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-[120px] overflow-y-auto border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg rounded-[6px]">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer whitespace-nowrap transition-colors ${
                value === opt ? 'bg-[var(--border-color)] font-bold' : ''
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
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
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[45px] w-full items-center justify-between overflow-hidden rounded-[6px] border border-[#CDCDCD] dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
      >
        <span className="px-4 text-sm text-[#333D50] dark:text-gray-200">
          {value || placeholder || t('placeholder_select')}
        </span>

        <div className="flex h-[35px] w-[35px] items-center justify-center border-l border-[#CDCDCD] dark:border-gray-600 bg-white dark:bg-gray-800 mr-[4px]">
          <ChevronDown 
            size={18} 
            className={`text-[#333D50] dark:text-gray-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-[120px] overflow-y-auto border border-[#CDCDCD] dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg rounded-[6px]">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm text-[#333D50] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap ${
                value === opt ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''
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
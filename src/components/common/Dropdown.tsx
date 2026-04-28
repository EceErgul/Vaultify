import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[45px] w-full items-center justify-between overflow-hidden rounded-[6px] border border-[#CDCDCD] bg-white cursor-pointer"
      >
        <span className="px-4 text-sm text-[#333D50] opacity-70">
          {selected || placeholder || "Seçim yapınız"}
        </span>

        <div className="flex h-[35px] w-[35px] items-center justify-center border-l border-[#CDCDCD] bg-white mr-[4px]">
          <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 min-w-full border border-[#CDCDCD] bg-white shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setSelected(opt);
                onSelect(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-[#333D50] hover:bg-gray-100 cursor-pointer whitespace-nowrap"
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
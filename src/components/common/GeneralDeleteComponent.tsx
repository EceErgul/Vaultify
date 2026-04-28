import React from 'react';

interface GeneralDeleteComponentProps {
  label: string;
  onDelete: () => void;
  disabled?: boolean;
  className?: string;
}

export const GeneralDeleteComponent: React.FC<GeneralDeleteComponentProps> = ({ 
  label, 
  onDelete, 
  disabled,
  className 
}) => {
  return (
    <button
      onClick={onDelete}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        bg-[#FF8A8A] hover:bg-[#ff7171] active:bg-[#f36565]
        text-black font-bold text-sm
        px-6 py-2.5
        border border-black
        rounded-[8px]
        shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span className="text-lg leading-none">-</span>
      {label}
    </button>
  );
};

export const GeneralDeleteCheckbox = ({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: () => void;
}) => {
  return (
    <div 
      onClick={onChange}
      className="w-[22px] h-[22px] bg-white border border-black rounded-[4px] cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
    >
      {checked && (
        <svg viewBox="0 0 100 100" className="w-[14px] h-[14px] stroke-black stroke-[12px] fill-none">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      )}
    </div>
  );
};
import React from 'react';
import Button from './Button';

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
    <Button
      variant="delete"
      onClick={onDelete}
      disabled={disabled}
      className={className} 
    >
      <span className="text-lg leading-none">-</span>
      {label}
    </Button>
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
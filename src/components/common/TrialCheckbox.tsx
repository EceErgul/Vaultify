import React from 'react';

interface TrialCheckboxProps {
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const TrialCheckbox: React.FC<TrialCheckboxProps> = ({ 
  active, 
  onClick, 
  className = '' 
}) => (
  <div 
    className={`w-[50px] h-[50px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[6px] relative flex items-center justify-center cursor-pointer shadow-sm transition-colors ${className}`}
    onClick={onClick}
  >
    {active && (
      <div className="absolute inset-0 p-2">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-[var(--text-main)] stroke-[4px]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      </div>
    )}
  </div>
);

export default TrialCheckbox;
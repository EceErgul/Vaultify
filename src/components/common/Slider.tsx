import React from 'react';

interface SliderProps {
  children: React.ReactNode;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto overflow-y-hidden border border-[var(--border-color)] rounded-sm bg-[var(--bg-card)] shadow-sm custom-scrollbar ${className}`}>
      <div className="min-w-[480px]">
        {children}
      </div>
    </div>
  );
};

export default Slider;
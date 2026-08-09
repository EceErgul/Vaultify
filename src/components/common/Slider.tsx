import React from 'react';

interface SliderProps {
  children: React.ReactNode;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto overflow-y-hidden border border-black rounded-sm bg-white shadow-sm custom-scrollbar ${className}`}>
      <div className="min-w-[480px]">
        {children}
      </div>
    </div>
  );
};

export default Slider;
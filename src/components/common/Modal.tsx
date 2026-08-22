import React from 'react';

interface BaseModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[92%] max-w-[500px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 text-[var(--text-main)]">

        <button 
          onClick={onClose}
          className="absolute top-0 right-0 w-[38px] sm:w-[45px] h-[38px] sm:h-[45px] bg-[var(--bg-card)] border-l border-b border-[var(--border-color)] rounded-tr-[20px] flex items-center justify-center group transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <span className="text-[var(--danger-text)] text-lg sm:text-2xl font-bold">
            ✕
          </span>
        </button>

        <div className="p-5 sm:p-8">
          <h2 className="text-center text-lg sm:text-xl font-semibold text-[var(--text-main)] mb-5 sm:mb-8 font-inter">
            {title}
          </h2>

          <div className="relative z-50 space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-[var(--text-main)]"> 
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
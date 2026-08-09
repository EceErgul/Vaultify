import React from 'react';

interface BaseModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="relative w-[92%] max-w-[500px] bg-[#F0FAFF] border border-[#CDCDCD] rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

        <button 
          onClick={onClose}
          className="absolute top-0 right-0 w-[38px] sm:w-[45px] h-[38px] sm:h-[45px] bg-white border-l border-b border-[#CDCDCD] rounded-tr-[20px] flex items-center justify-center group transition-colors hover:bg-red-50"
        >
          <span className="text-[#D40303] text-lg sm:text-2xl font-bold [text-shadow:1px_0_0_#500D0D,-1px_0_0_#500D0D,0_1px_0_#500D0D,0_-1px_0_#500D0D]">
            X
          </span>
        </button>

        <div className="p-5 sm:p-8">
          <h2 className="text-center text-lg sm:text-xl font-semibold text-[#333D50] mb-5 sm:mb-8 font-inter">
            {title}
          </h2>

          <div className="relative z-50 space-y-4 max-h-[75vh] overflow-y-auto pr-1"> 
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isTotal?: boolean;
}

const Input: React.FC<InputProps> = ({ isTotal = false, className, ...props }) => {
  const baseStyles = "w-full h-[45px] px-4 rounded-[6px] text-sm transition-all focus:outline-none";
  
  const variantStyles = isTotal 
    ? "bg-[#CDCDCD] text-[#333D50] cursor-not-allowed" 
    : "bg-[#FFFFFF] border border-[#CDCDCD] text-[#333D50] focus:border-gray-400";

  return (
    <input 
      className={`${baseStyles} ${variantStyles} ${className}`}
      readOnly={isTotal}
      {...props}
    />
  );
};

export default Input;
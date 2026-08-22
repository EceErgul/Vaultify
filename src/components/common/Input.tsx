import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isTotal?: boolean;
}

const Input: React.FC<InputProps> = ({ isTotal = false, className, ...props }) => {
  const baseStyles = "w-full h-[45px] px-4 rounded-[6px] text-sm transition-all focus:outline-none";
  const variantStyles = isTotal 
    ? "bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed" 
    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--text-muted)]";

  return (
    <input 
      className={`${baseStyles} ${variantStyles} ${className}`}
      readOnly={isTotal}
      {...props}
    />
  );
};

export default Input;
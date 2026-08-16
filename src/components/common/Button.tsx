import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'delete' | 'apply' | 'auth' | 'hero' | 'filter' | 'applyDelete' | 'cancel';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'add', children, className = '', ...props }) => {
  const variantStyles = {
    add: 'bg-[#7ECCF4] text-black dark:bg-[#0284c7] dark:text-white',
    delete: 'bg-[#FF8A8A] text-black dark:bg-[#dc2626] dark:text-white',
    apply: 'bg-[#FFF6AF] text-black dark:bg-[#ca8a04] dark:text-white',
    applyDelete: 'bg-[#FF8A8A] text-black dark:bg-[#dc2626] dark:text-white',
    auth: 'bg-[#333D50] text-white dark:bg-[#475569] dark:text-white',
    hero: 'bg-[#F0FAFF] text-[#333D50] dark:bg-[#1e293b] dark:text-[#f8fafc]',
    filter: 'bg-[#FFEF79] text-black dark:bg-[#eab308] dark:text-zinc-950',
    cancel: 'bg-[#EAEAEA] text-black dark:bg-[#334155] dark:text-slate-200',
  };

  const baseStyles = "h-[26px] sm:h-[35px] px-3 sm:px-6 text-xs sm:text-sm rounded-lg border border-[var(--border-color)] shadow-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap select-none hover:opacity-90";

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
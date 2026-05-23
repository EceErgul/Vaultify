import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'delete' | 'apply' | 'auth' | 'hero' | 'filter' | 'applyDelete';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'add', children, className = '', ...props }) => {
  const variantStyles = {
    add: 'bg-[#7ECCF4] text-black',
    delete: 'bg-[#FF8A8A] text-black',
    apply: 'bg-[#FFF6AF] text-black',
    applyDelete: 'bg-[#FF8A8A] text-black',
    auth: 'bg-[#333D50] text-white',
    hero: 'bg-[#F0FAFF] text-[#333D50]',
    filter: 'bg-[#FFEF79] text-black'
  };

  const baseStyles = "px-6 py-2 rounded-lg border border-black shadow-sm font-medium transition-all duration-150 flex items-center justify-center gap-2";

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
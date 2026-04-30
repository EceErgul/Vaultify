import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'delete' | 'apply' | 'auth' | 'hero' | 'filter';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'add', children, className, ...props }) => {
  const variantStyles = {
    add: 'bg-[#7ECCF4] text-black',
    delete: 'bg-[#FF9E9E] text-black',
    apply: 'bg-[#FFF6AF] text-black',
    auth: 'bg-[#333D50] text-white',
    hero: 'bg-[#F0FAFF] text-[#333D50]',
    filter: 'bg-[#FFEF79] text-black'
  };

  const baseStyles = "px-6 py-2 rounded-lg border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] font-medium transition-all duration-150 flex items-center justify-center gap-2";

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
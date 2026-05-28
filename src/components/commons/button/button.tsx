import React from 'react';

interface MyButtonProps {
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MyButton: React.FC<MyButtonProps> = ({
  type = 'button',
  isLoading = false,
  children,
  onClick,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-2.5 px-4 bg-[#00AA5B] hover:bg-[#008F4C] text-white font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Memproses...' : children}
    </button>
  );
};
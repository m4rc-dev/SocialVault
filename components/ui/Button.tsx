import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50";
  
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-9 px-4 py-2 text-sm rounded-md",
    lg: "h-10 px-8 text-sm rounded-md",
    icon: "h-9 w-9 p-0 rounded-md"
  };

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
    outline: "border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-800 dark:hover:text-gray-50",
    ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
    destructive: "bg-white border border-gray-200 text-gray-900 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:bg-black dark:border-gray-800 dark:text-gray-100 dark:hover:bg-red-950/20"
  };

  const activeSize = sizes[size] || sizes.md;

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${activeSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
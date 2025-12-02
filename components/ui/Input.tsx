import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, rightElement, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-300 dark:text-gray-50 ${
            error ? 'border-red-500 focus-visible:ring-red-500' : ''
          } ${rightElement ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
    </div>
  );
};
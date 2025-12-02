import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-gray-300 dark:focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? 'bg-gray-900 dark:bg-gray-50' : 'bg-gray-200 dark:bg-gray-800'}
      `}
    >
      <span
        className={`
          pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-gray-950 shadow-lg ring-0 transition-transform duration-300 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};
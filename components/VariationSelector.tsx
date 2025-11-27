
import React from 'react';

interface VariationSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled: boolean;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({ value, onChange, min = 1, max = 4, disabled }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const buttonClass = (isDisabled: boolean) => `px-3 py-1 rounded-md transition-colors ${
    isDisabled || disabled
      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
  }`;

  return (
    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-inner h-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        生成数量
      </label>
      <div className="flex items-center space-x-2">
        <button onClick={handleDecrement} disabled={disabled || value <= min} className={buttonClass(value <= min)}>-</button>
        <span className="w-8 text-center font-semibold text-gray-800 dark:text-gray-100">{value}</span>
        <button onClick={handleIncrement} disabled={disabled || value >= max} className={buttonClass(value >= max)}>+</button>
      </div>
       <span className="text-xs text-gray-500 dark:text-gray-400">
        生成多张图片以供选择
      </span>
    </div>
  );
};

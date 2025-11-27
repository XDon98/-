
import React from 'react';

interface AgeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const AgeSelector: React.FC<AgeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
           <label htmlFor="age-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            模特年龄
          </label>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{value} 岁</span>
        </div>
        <input
          id="age-slider"
          type="range"
          min="8"
          max="18"
          step="1"
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>8岁</span>
          <span>18岁</span>
        </div>
      </div>
    </div>
  );
};

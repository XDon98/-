
import React from 'react';

interface HeightSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const HeightSelector: React.FC<HeightSelectorProps> = ({ value, onChange }) => {
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
      <div className="flex-1">
        <label htmlFor="height-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          身高: <span className="font-bold text-indigo-600 dark:text-indigo-400">{value} cm</span>
        </label>
        <input
          id="height-slider"
          type="range"
          min="70"
          max="150"
          step="1"
          value={value}
          onChange={handleHeightChange}
          className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>70cm</span>
          <span>150cm</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const ratios = ['9:16', '1:1', '16:9'];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ratios.map((ratio) => (
        <button
          key={ratio}
          onClick={() => onSelectRatio(ratio)}
          className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 flex flex-col items-center justify-center space-y-1 h-20
            ${
              selectedRatio === ratio
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          <div className="font-mono text-lg font-semibold">{ratio}</div>
          <div className="text-xs capitalize">{ratio === '1:1' ? '方形' : ratio === '16:9' ? '横向' : '纵向'}</div>
        </button>
      ))}
    </div>
  );
};

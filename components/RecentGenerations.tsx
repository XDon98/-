import React from 'react';

interface RecentGenerationsProps {
  images: string[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

export const RecentGenerations: React.FC<RecentGenerationsProps> = ({ images, onSelect, onClear }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">最近生成</h3>
        <button
          onClick={onClear}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 rounded"
          aria-label="Clear all recent generations"
        >
          清除全部
        </button>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-3 -mb-3">
        {images.map((url, index) => (
          <button
            key={`${url}-${index}`}
            onClick={() => onSelect(url)}
            className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 group"
            aria-label={`Select recent generation ${index + 1}`}
          >
            <img
              src={url}
              alt={`Recent generation ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
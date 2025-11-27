
import React from 'react';

interface BodyTypeSelectorProps {
  selectedBodyType: string;
  onSelectBodyType: (bodyType: string) => void;
}

const bodyTypes = ['随机', '苗条', '健壮', '丰满', '普通'];

export const BodyTypeSelector: React.FC<BodyTypeSelectorProps> = ({ selectedBodyType, onSelectBodyType }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {bodyTypes.map((bodyType) => (
        <button
          key={bodyType}
          onClick={() => onSelectBodyType(bodyType)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedBodyType === bodyType
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {bodyType}
        </button>
      ))}
    </div>
  );
};

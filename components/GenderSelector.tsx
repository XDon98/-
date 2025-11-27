
import React from 'react';

interface GenderSelectorProps {
  selectedGender: string;
  onSelectGender: (gender: string) => void;
}

const genders = ['随机', '女性', '男性'];

export const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onSelectGender }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {genders.map((gender) => (
        <button
          key={gender}
          onClick={() => onSelectGender(gender)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedGender === gender
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {gender}
        </button>
      ))}
    </div>
  );
};


import React from 'react';

interface EthnicitySelectorProps {
  selectedEthnicity: string;
  onSelectEthnicity: (ethnicity: string) => void;
}

const ethnicities = ['随机', '亚洲人', '白种人', '非洲裔', '拉丁裔'];

export const EthnicitySelector: React.FC<EthnicitySelectorProps> = ({ selectedEthnicity, onSelectEthnicity }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {ethnicities.map((ethnicity) => (
        <button
          key={ethnicity}
          onClick={() => onSelectEthnicity(ethnicity)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedEthnicity === ethnicity
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {ethnicity}
        </button>
      ))}
    </div>
  );
};

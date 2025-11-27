
import React from 'react';

interface ShotTypeSelectorProps {
  selectedShotType: string;
  onSelectShotType: (shotType: string) => void;
}

const shotTypes = ['全身', '半身', '特写'];

// A wrapper to provide consistent styling for all icons
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-1">
        {children}
    </svg>
);

// A component to render the correct icon based on the shot type name
const ShotTypeIcon: React.FC<{ shotType: string }> = ({ shotType }) => {
    switch (shotType) {
        case '全身': return <IconWrapper><circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M12 14l-3 5"/><path d="M12 14l3 5"/></IconWrapper>;
        case '半身': return <IconWrapper><circle cx="12" cy="6" r="2"/><path d="M12 8v4"/><path d="M9 12h6"/><rect x="7" y="12" width="10" height="6" rx="2"/></IconWrapper>;
        case '特写': return <IconWrapper><circle cx="12" cy="9" r="3"/><path d="M12 12c-2 0-4 1.5-4 4v1h8v-1c0-2.5-2-4-4-4z"/><rect x="4" y="4" width="16" height="16" rx="2"/></IconWrapper>;
        default: return null;
    }
};

export const ShotTypeSelector: React.FC<ShotTypeSelectorProps> = ({ selectedShotType, onSelectShotType }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {shotTypes.map((shotType) => (
        <button
          key={shotType}
          onClick={() => onSelectShotType(shotType)}
          className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 flex flex-col items-center justify-center min-h-[96px]
            ${
              selectedShotType === shotType
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          <ShotTypeIcon shotType={shotType} />
          <span>{shotType}</span>
        </button>
      ))}
    </div>
  );
};

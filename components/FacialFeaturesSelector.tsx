
import React from 'react';

interface FacialFeaturesSelectorProps {
  selectedFeatures: string[];
  onToggleFeature: (feature: string) => void;
}

const features = ['大眼睛', '高鼻梁', '双眼皮', '雀斑', '酒窝'];

export const FacialFeaturesSelector: React.FC<FacialFeaturesSelectorProps> = ({ selectedFeatures, onToggleFeature }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {features.map((feature) => (
        <button
          key={feature}
          onClick={() => onToggleFeature(feature)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedFeatures.includes(feature)
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {feature}
        </button>
      ))}
    </div>
  );
};


import React from 'react';

interface HairSelectorProps {
  selectedStyle: string;
  selectedColor: string;
  onStyleChange: (style: string) => void;
  onColorChange: (color: string) => void;
}

const styles = ['随机', '长直发', '长卷发', '短直发', '短卷发', '马尾', '丸子头', '编发'];
const colors = ['随机', '黑色', '棕色', '金色', '红色', '银色', '亚麻色'];

export const HairSelector: React.FC<HairSelectorProps> = ({ selectedStyle, selectedColor, onStyleChange, onColorChange }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
      <div className="flex-1">
        <label htmlFor="hair-style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          发型
        </label>
        <select
          id="hair-style"
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {styles.map(style => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="hair-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          发色
        </label>
        <select
          id="hair-color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {colors.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

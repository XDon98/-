
import React from 'react';

interface ExpressionSelectorProps {
  selectedExpression: string;
  onSelectExpression: (expression: string) => void;
}

const expressions = ['随机', '微笑', '大笑', '平静', '酷', '惊讶'];

export const ExpressionSelector: React.FC<ExpressionSelectorProps> = ({ selectedExpression, onSelectExpression }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {expressions.map((expression) => (
        <button
          key={expression}
          onClick={() => onSelectExpression(expression)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedExpression === expression
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {expression}
        </button>
      ))}
    </div>
  );
};

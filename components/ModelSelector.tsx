
import React from 'react';

interface Model {
  id: string;
  name: string;
  imageDataUrl: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string | null;
  onSelectModel: (modelId: string | null) => void;
  onDeleteModel: (modelId: string) => void;
  onRenameModel: (modelId: string, newName: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModelId, onSelectModel, onDeleteModel, onRenameModel }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        <button
          onClick={() => onSelectModel(null)}
          aria-label="Generate new model"
          className={`relative aspect-square border-2 rounded-lg flex flex-col items-center justify-center text-center p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${selectedModelId === null
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
              : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">新建模特</span>
        </button>

        {models.map((model) => (
          <div key={model.id} className="relative group">
            <button
              onClick={() => onSelectModel(model.id)}
              aria-label={`Select model ${model.name}`}
              className={`w-full aspect-square border-2 rounded-lg transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
                ${selectedModelId === model.id
                  ? 'border-indigo-600 ring-2 ring-indigo-500'
                  : 'border-transparent hover:border-indigo-400'
                }`}
            >
              <img src={model.imageDataUrl} alt={model.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center p-1 truncate">
                {model.name}
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentName = model.name;
                const newName = window.prompt(`为模特重命名:`, currentName);
                if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
                    onRenameModel(model.id, newName.trim());
                }
              }}
              className="absolute -top-2 -left-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label={`Rename ${model.name}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`确定要删除模特 "${model.name}" 吗？`)) {
                    onDeleteModel(model.id);
                }
              }}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete ${model.name}`}
            >
              &#x2715;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};